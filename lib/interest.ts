import { kv } from '@vercel/kv';

const INTEREST_KEY = 'cinema:interest';

export interface InterestSignup {
  name: string;
  email: string;
  phone: string;
  signedUpAt: string;
}

export async function addInterestSignup(signup: InterestSignup): Promise<void> {
  await kv.lpush(INTEREST_KEY, JSON.stringify(signup));
}

export async function getInterestSignups(): Promise<InterestSignup[]> {
  const raw = await kv.lrange<InterestSignup | string>(INTEREST_KEY, 0, -1);

  return raw
    .map((entry) => {
      // Vercel KV deserialises JSON automatically, but a string can come back
      // if the value was ever written by hand.
      if (typeof entry !== 'string') return entry;
      try {
        return JSON.parse(entry) as InterestSignup;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is InterestSignup => entry !== null);
}
