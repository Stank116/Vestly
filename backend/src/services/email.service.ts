import { env } from '../config/env';

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!env.RESEND_API_KEY) {
    console.log('[email:disabled]', input);
    return { skipped: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Vestly <notifications@vestly.app>',
      to: input.to,
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed with ${response.status}`);
  }

  return response.json();
}
