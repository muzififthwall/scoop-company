import { kv } from '@vercel/kv';

// Event nights configuration
export const EVENT_NIGHTS = [
  {
    key: 'monday_27_oct_2025',
    displayName: 'Monday, October 27th - 4:45PM',
    value: 'Monday 27 Oct — 4:45pm',
  },
  {
    key: 'tuesday_28_oct_2025',
    displayName: 'Tuesday, October 28th - 4:45PM',
    value: 'Tuesday 28 Oct — 4:45pm',
  },
  {
    key: 'wednesday_29_oct_2025',
    displayName: 'Wednesday, October 29th - 4:45PM',
    value: 'Wednesday 29 Oct — 4:45pm',
  },
  {
    key: 'thursday_30_oct_2025',
    displayName: 'Thursday, October 30th - 4:45PM',
    value: 'Thursday 30 Oct — 4:45pm',
  },
  {
    key: 'friday_31_oct_2025',
    displayName: 'Friday, October 31st - 4:45PM',
    value: 'Friday 31 Oct — 4:45pm',
  },
] as const;

export const MAX_KID_TICKETS = 15;
export const MAX_ADULT_TICKETS = 15;
export const RESERVATION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Types
export interface InventoryData {
  kid_tickets_sold: number;
  adult_drink_tickets_sold: number;
  adult_full_tickets_sold: number;
}

export interface ReservationData {
  kidTickets: number;
  adultDrinkTickets: number;
  adultFullTickets: number;
  nightKey: string;
  createdAt: number;
  sessionId: string;
}

export interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultDrinkTicketsRemaining: number;
  adultFullTicketsRemaining: number;
  isSoldOut: boolean;
}

// Helper to get night key from display value
export function getNightKeyFromValue(value: string): string | null {
  const night = EVENT_NIGHTS.find(n => n.value === value);
  return night ? night.key : null;
}

// Helper to get night display info from key
export function getNightFromKey(key: string) {
  return EVENT_NIGHTS.find(n => n.key === key);
}

// Get current inventory for a specific night
export async function getInventory(nightKey: string): Promise<InventoryData> {
  const key = `inventory:${nightKey}`;
  const data = await kv.get<InventoryData>(key);

  if (!data) {
    // If not found, return zero (uninitialized)
    return {
      kid_tickets_sold: 0,
      adult_drink_tickets_sold: 0,
      adult_full_tickets_sold: 0,
    };
  }

  return data;
}

// Get availability for a specific night
export async function getAvailability(nightKey: string): Promise<Availability> {
  const nightInfo = getNightFromKey(nightKey);
  if (!nightInfo) {
    throw new Error(`Invalid night key: ${nightKey}`);
  }

  const inventory = await getInventory(nightKey);

  // Get active reservations for this night
  const reservations = await getActiveReservations(nightKey);
  const reservedKids = reservations.reduce((sum, r) => sum + r.kidTickets, 0);
  const reservedAdultDrink = reservations.reduce((sum, r) => sum + r.adultDrinkTickets, 0);
  const reservedAdultFull = reservations.reduce((sum, r) => sum + r.adultFullTickets, 0);

  const kidTicketsRemaining = MAX_KID_TICKETS - inventory.kid_tickets_sold - reservedKids;
  // Adults are counted together (drink + full) with a combined limit of 15
  const totalAdultSold = inventory.adult_drink_tickets_sold + inventory.adult_full_tickets_sold;
  const totalAdultReserved = reservedAdultDrink + reservedAdultFull;
  const totalAdultRemaining = MAX_ADULT_TICKETS - totalAdultSold - totalAdultReserved;

  return {
    nightKey,
    displayName: nightInfo.displayName,
    value: nightInfo.value,
    kidTicketsRemaining: Math.max(0, kidTicketsRemaining),
    adultDrinkTicketsRemaining: Math.max(0, totalAdultRemaining),
    adultFullTicketsRemaining: Math.max(0, totalAdultRemaining),
    isSoldOut: kidTicketsRemaining <= 0,
  };
}

// Get availability for all nights
export async function getAllAvailability(): Promise<Availability[]> {
  const availabilities = await Promise.all(
    EVENT_NIGHTS.map(night => getAvailability(night.key))
  );
  return availabilities;
}

// Get active reservations for a night
async function getActiveReservations(nightKey: string): Promise<ReservationData[]> {
  const pattern = `reservation:*:${nightKey}`;
  const keys = await kv.keys(pattern);

  const now = Date.now();
  const activeReservations: ReservationData[] = [];

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) < RESERVATION_TIMEOUT_MS) {
      activeReservations.push(reservation);
    }
  }

  return activeReservations;
}

// Reserve tickets (called before Stripe checkout)
export async function reserveTickets(
  nightKey: string,
  kidTickets: number,
  adultDrinkTickets: number,
  adultFullTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  // Validate inputs
  if (kidTickets < 1) {
    return { success: false, error: 'Must book at least 1 kid ticket' };
  }

  const totalAdults = adultDrinkTickets + adultFullTickets;
  if (totalAdults > 0 && kidTickets < 1) {
    return { success: false, error: 'Must have at least 1 kid ticket to book adult tickets' };
  }

  if (kidTickets > 8 || adultDrinkTickets > 8 || adultFullTickets > 8) {
    return { success: false, error: 'Maximum 8 tickets per type' };
  }

  // Check availability
  const availability = await getAvailability(nightKey);

  if (availability.kidTicketsRemaining < kidTickets) {
    return {
      success: false,
      error: `Only ${availability.kidTicketsRemaining} kid ticket(s) remaining for this night`
    };
  }

  // Check total adult availability (drink + full combined)
  if (availability.adultDrinkTicketsRemaining < totalAdults) {
    return {
      success: false,
      error: `Only ${availability.adultDrinkTicketsRemaining} adult ticket(s) remaining for this night`
    };
  }

  // Create reservation
  const reservation: ReservationData = {
    kidTickets,
    adultDrinkTickets,
    adultFullTickets,
    nightKey,
    createdAt: Date.now(),
    sessionId,
  };

  const reservationKey = `reservation:${sessionId}:${nightKey}`;

  // Store reservation with 35-minute expiry (slightly longer than timeout for safety)
  await kv.set(reservationKey, reservation, {
    ex: Math.ceil(RESERVATION_TIMEOUT_MS / 1000) + 300 // +5 minutes buffer
  });

  return { success: true };
}

// Confirm booking (called after successful Stripe payment)
export async function confirmBooking(
  nightKey: string,
  kidTickets: number,
  adultDrinkTickets: number,
  adultFullTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current inventory
    const inventory = await getInventory(nightKey);

    // Update inventory
    const newInventory: InventoryData = {
      kid_tickets_sold: inventory.kid_tickets_sold + kidTickets,
      adult_drink_tickets_sold: inventory.adult_drink_tickets_sold + adultDrinkTickets,
      adult_full_tickets_sold: inventory.adult_full_tickets_sold + adultFullTickets,
    };

    // Save updated inventory
    const inventoryKey = `inventory:${nightKey}`;
    await kv.set(inventoryKey, newInventory);

    // Remove reservation
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);

    return { success: true };
  } catch (error) {
    console.error('Error confirming booking:', error);
    return { success: false, error: 'Failed to confirm booking' };
  }
}

// Release reservation (called when checkout is cancelled or expired)
export async function releaseReservation(sessionId: string, nightKey?: string): Promise<void> {
  if (nightKey) {
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);
  } else {
    // If no night key provided, try to find and delete all reservations for this session
    const pattern = `reservation:${sessionId}:*`;
    const keys = await kv.keys(pattern);
    for (const key of keys) {
      await kv.del(key);
    }
  }
}

// Clean up expired reservations (should be called periodically)
export async function cleanupExpiredReservations(): Promise<number> {
  const pattern = 'reservation:*';
  const keys = await kv.keys(pattern);

  const now = Date.now();
  let cleanedCount = 0;

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) >= RESERVATION_TIMEOUT_MS) {
      await kv.del(key);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

// Initialize inventory for all nights (admin use only)
export async function initializeInventory(): Promise<void> {
  for (const night of EVENT_NIGHTS) {
    const key = `inventory:${night.key}`;
    const existing = await kv.get(key);

    if (!existing) {
      await kv.set(key, {
        kid_tickets_sold: 0,
        adult_drink_tickets_sold: 0,
        adult_full_tickets_sold: 0,
      });
    }
  }
}
