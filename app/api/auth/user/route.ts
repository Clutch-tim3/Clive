import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/firebase/auth';

/** GET — return current session user profile */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Return safe subset (exclude any sensitive admin fields)
  return NextResponse.json({
    uid:         user.uid,
    email:       user.email,
    displayName: user.displayName,
    photoURL:    user.photoURL ?? null,
    role:        user.role,
    company:     user.company ?? null,
    website:     user.website ?? null,
    providerProfile: user.providerProfile ?? null,
  });
}
