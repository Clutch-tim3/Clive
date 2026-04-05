const PAYPAL_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getPayPalToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

/** Create a one-time order (used for first month of a subscription) */
export async function createPayPalOrder(amountZAR: number, description: string) {
  const token = await getPayPalToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'ZAR', value: (amountZAR / 100).toFixed(2) },
        description,
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/capture`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
      },
    }),
  });
  return res.json();
}

/** Capture an approved order */
export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return res.json();
}

/** Create a recurring billing plan for a product tier */
export async function createPayPalPlan(
  productName: string,
  priceZAR: number,
  tierId: string,
) {
  const token = await getPayPalToken();

  const productRes = await fetch(`${PAYPAL_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: productName, type: 'SERVICE' }),
  });
  const ppProduct = await productRes.json();

  const planRes = await fetch(`${PAYPAL_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: ppProduct.id,
      name: `${productName} — ${tierId}`,
      billing_cycles: [{
        frequency: { interval_unit: 'MONTH', interval_count: 1 },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: { value: (priceZAR / 100).toFixed(2), currency_code: 'ZAR' },
        },
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });
  return planRes.json();
}

/** Send a payout to a provider's PayPal account */
export async function sendPayPalPayout(
  paypalEmail: string,
  amountZAR: number,
  reference: string,
) {
  const token = await getPayPalToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/payments/payouts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: reference,
        email_subject: 'Your Clive earnings payout',
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: (amountZAR / 100).toFixed(2), currency: 'ZAR' },
        receiver: paypalEmail,
        note: `Clive platform earnings — ${reference}`,
      }],
    }),
  });
  return res.json();
}

/** Verify a PayPal webhook event signature */
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  try {
    const token = await getPayPalToken();
    const res = await fetch(
      `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_algo:         headers['paypal-auth-algo'],
          cert_url:          headers['paypal-cert-url'],
          transmission_id:   headers['paypal-transmission-id'],
          transmission_sig:  headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id:        process.env.PAYPAL_WEBHOOK_ID,
          webhook_event:     JSON.parse(body),
        }),
      },
    );
    const data = await res.json();
    return data.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}
