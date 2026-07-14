// Winter-only cinema. While it's out of season the cinema page collects
// interest instead of selling tickets; flip this to false to turn ticket sales
// back on (that restores the existing Stripe checkout flow untouched).
//
// Kept free of any database imports so client components can read it without
// pulling the KV client into the browser bundle.
export const CINEMA_INTEREST_MODE = true;
