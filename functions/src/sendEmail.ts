import { onCall, HttpsError } from 'firebase-functions/v2/https';

interface EmailPayload {
  to:      string;
  subject: string;
  text:    string;
  html?:   string;
}

/**
 * Callable Cloud Function for sending transactional emails.
 *
 * In development / when RESEND_API_KEY is not set, emails are logged
 * to the console rather than sent.
 *
 * In production, swap the stub below for a real Resend / SendGrid call:
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({ from: 'noreply@clive.dev', ...payload });
 */
export const sendEmail = onCall<EmailPayload>(async (request) => {
  const { to, subject, text, html } = request.data;

  if (!to || !subject || !text) {
    throw new HttpsError('invalid-argument', 'to, subject, and text are required');
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Development stub — just log
    console.log('[sendEmail stub]', { to, subject, text, html });
    return { success: true, stub: true };
  }

  // Production: call Resend REST API directly (no extra SDK needed)
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    'Clive <noreply@clive.dev>',
      to:      [to],
      subject,
      text,
      html: html ?? text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[sendEmail] Resend error', res.status, body);
    throw new HttpsError('internal', 'Failed to send email');
  }

  return { success: true };
});
