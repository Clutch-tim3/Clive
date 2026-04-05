import crypto from 'crypto';

const STITCH_TOKEN_URL = 'https://secure.stitch.money/connect/token';
const STITCH_GRAPHQL   = 'https://api.stitch.money/graphql';

/** Get a client-credentials access token from Stitch */
export async function getStitchToken(): Promise<string> {
  const res = await fetch(STITCH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env.STITCH_CLIENT_ID!,
      client_secret: process.env.STITCH_CLIENT_SECRET!,
      audience:      'https://api.stitch.money',
      scope:         'client_paymentrequest',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

/** Create a Stitch payment initiation request and return { id, url } */
export async function initiateStitchPayment(
  amountZAR: number,
  reference: string,
  beneficiaryName: string,
): Promise<{ id: string; url: string }> {
  const token  = await getStitchToken();
  const amount = (amountZAR / 100).toFixed(2);

  const mutation = `
    mutation CreatePaymentRequest($input: CreateClientPaymentRequestInput!) {
      clientPaymentInitiationRequestCreate(input: $input) {
        paymentInitiationRequest {
          id
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      amount: { quantity: amount, currency: 'ZAR' },
      payerConstraints: { customerAccountType: 'personal' },
      beneficiary: {
        bankAccount: {
          name:            beneficiaryName,
          bankId:          'fnb',
          // TODO: replace with Clive's actual platform settlement account
          accountNumber:   process.env.STITCH_PLATFORM_ACCOUNT ?? '1234567890',
          accountType:     'current',
          beneficiaryType: 'business',
        },
      },
      externalReference: reference,
      merchant:          'Clive Developer Platform',
    },
  };

  const res  = await fetch(STITCH_GRAPHQL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: mutation, variables }),
  });
  const data = await res.json();
  return data.data?.clientPaymentInitiationRequestCreate?.paymentInitiationRequest;
}

/** Verify a Stitch webhook using HMAC-SHA256 */
export function verifyStitchWebhook(payload: string, signature: string): boolean {
  try {
    const expected = crypto
      .createHmac('sha256', process.env.STITCH_WEBHOOK_SECRET!)
      .update(payload)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  } catch {
    return false;
  }
}
