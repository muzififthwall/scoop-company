import { kv } from '@vercel/kv';

// Event night configuration type
export interface EventNight {
  key: string;
  displayName: string;
  value: string;
  movie: string;
  adultOnly?: boolean;
}

// Event nights configuration
export const EVENT_NIGHTS: readonly EventNight[] = [
  {
    key: '11-nov',
    displayName: '🏙️ Tue 11 Nov - Home Alone 2 - 5:00PM',
    value: 'Tuesday 11 Nov — 5:00pm',
    movie: 'Home Alone 2'
  },
  {
    key: '18-nov',
    displayName: '💚 Tue 18 Nov - Grinch - 5:00PM',
    value: 'Tuesday 18 Nov — 5:00pm',
    movie: 'Grinch'
  },
  {
    key: '19-nov',
    displayName: '🎁 Wed 19 Nov - Arthur Christmas - 5:00PM',
    value: 'Wednesday 19 Nov — 5:00pm',
    movie: 'Arthur Christmas'
  },
  {
    key: '26-nov',
    displayName: '🚂 Wed 26 Nov - Polar Express - 6:30PM arrival (6:45PM start) - ADULTS ONLY',
    value: 'Wednesday 26 Nov — 6:30pm arrival (6:45pm start)',
    movie: 'Polar Express',
    adultOnly: true
  },
  {
    key: '27-nov',
    displayName: '🧝‍♂️ Thu 27 Nov - Elf - 6:30PM arrival (6:45PM start) - ADULTS ONLY',
    value: 'Thursday 27 Nov — 6:30pm arrival (6:45pm start)',
    movie: 'Elf',
    adultOnly: true
  },
  {
    key: '3-dec',
    displayName: '🎅 Wed 3 Dec - Christmas Chronicles - 5:00PM',
    value: 'Wednesday 3 Dec — 5:00pm',
    movie: 'Christmas Chronicles'
  },
  {
    key: '4-dec',
    displayName: '🧣 Thu 4 Dec - The Santa Clause - 5:00PM',
    value: 'Thursday 4 Dec — 5:00pm',
    movie: 'The Santa Clause'
  },
  {
    key: '10-dec',
    displayName: '🎶 Wed 10 Dec - Jingle Jangle - 5:00PM',
    value: 'Wednesday 10 Dec — 5:00pm',
    movie: 'Jingle Jangle'
  },
  {
    key: '16-dec',
    displayName: '💚 Tue 16 Dec - Cartoon Grinch - 5:00PM',
    value: 'Tuesday 16 Dec — 5:00pm',
    movie: 'Cartoon Grinch'
  },
  {
    key: '18-dec',
    displayName: '🏠 Thu 18 Dec - Home Alone - 5:00PM',
    value: 'Thursday 18 Dec — 5:00pm',
    movie: 'Home Alone'
  },
  {
    key: '22-dec',
    displayName: '🏙️ Mon 22 Dec - Home Alone 2 - 5:00PM',
    value: 'Monday 22 Dec — 5:00pm',
    movie: 'Home Alone 2'
  },
  {
    key: '23-dec',
    displayName: '🚂 Tue 23 Dec - Polar Express - 5:00PM',
    value: 'Tuesday 23 Dec — 5:00pm',
    movie: 'Polar Express'
  },
  {
    key: '29-dec',
    displayName: '🧝‍♂️ Mon 29 Dec - Elf - 5:00PM',
    value: 'Monday 29 Dec — 5:00pm',
    movie: 'Elf'
  },
  {
    key: '30-dec',
    displayName: '🤖 Tue 30 Dec - Jingle all the Way - 5:00PM',
    value: 'Tuesday 30 Dec — 5:00pm',
    movie: 'Jingle all the Way'
  },
];

export const MAX_KID_TICKETS = 20;
export const MAX_ADULT_TICKETS = 15;
export const RESERVATION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// Global sold out flag - set to true to disable all ticket sales
export const TICKETS_SOLD_OUT = false;

// Types
export interface InventoryData {
  kid_tickets_sold: number;
  adult_tickets_sold: number;
}

export interface ReservationData {
  kidTickets: number;
  adultTickets: number;
  nightKey: string;
  createdAt: number;
  sessionId: string;
}

export interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultTicketsRemaining: number;
  isSoldOut: boolean;
  adultOnly?: boolean;
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
      adult_tickets_sold: 0,
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
  const reservedAdults = reservations.reduce((sum, r) => sum + r.adultTickets, 0);

  const kidTicketsRemaining = MAX_KID_TICKETS - inventory.kid_tickets_sold - reservedKids;
  const adultTicketsRemaining = MAX_ADULT_TICKETS - inventory.adult_tickets_sold - reservedAdults;

  return {
    nightKey,
    displayName: nightInfo.displayName,
    value: nightInfo.value,
    kidTicketsRemaining: Math.max(0, kidTicketsRemaining),
    adultTicketsRemaining: Math.max(0, adultTicketsRemaining),
    isSoldOut: nightInfo.adultOnly ? adultTicketsRemaining <= 0 : kidTicketsRemaining <= 0,
    adultOnly: nightInfo.adultOnly,
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
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  // Check if this is an adult-only event
  const nightInfo = getNightFromKey(nightKey);
  const isAdultOnly = nightInfo?.adultOnly === true;

  // Validate inputs
  if (!isAdultOnly && kidTickets < 1) {
    return { success: false, error: 'Must book at least 1 kid ticket' };
  }

  if (!isAdultOnly && adultTickets > 0 && kidTickets < 1) {
    return { success: false, error: 'Must have at least 1 kid ticket to book adult tickets' };
  }

  if (isAdultOnly && kidTickets > 0) {
    return { success: false, error: 'This is an adults-only event. Kid tickets are not available.' };
  }

  if (isAdultOnly && adultTickets < 1) {
    return { success: false, error: 'Must book at least 1 adult ticket' };
  }

  if (kidTickets > 8 || adultTickets > 8) {
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

  if (availability.adultTicketsRemaining < adultTickets) {
    return {
      success: false,
      error: `Only ${availability.adultTicketsRemaining} adult ticket(s) remaining for this night`
    };
  }

  // Create reservation
  const reservation: ReservationData = {
    kidTickets,
    adultTickets,
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
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current inventory
    const inventory = await getInventory(nightKey);

    // Update inventory
    const newInventory: InventoryData = {
      kid_tickets_sold: inventory.kid_tickets_sold + kidTickets,
      adult_tickets_sold: inventory.adult_tickets_sold + adultTickets,
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
    // Always overwrite to ensure fresh start for new dates
    await kv.set(key, {
      kid_tickets_sold: 0,
      adult_tickets_sold: 0,
    });
  }
}
