// Server-only guard — importing this from a client component causes a build error.
// Use this import path in all API routes instead of './namecom' directly.
import 'server-only';
export * from './namecom';
