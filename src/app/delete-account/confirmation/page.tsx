import type { Metadata } from 'next';
import ConfirmClient from './ConfirmClient';

export const metadata: Metadata = {
  title: 'Confirm account deletion — Zynvo',
  description:
    'Confirm the deletion of your Zynvo account from the email link we sent you.',
  alternates: {
    canonical: 'https://zynvosocial.com/delete-account/confirmation',
  },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  token?: string;
  email?: string;
}>;

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const token = (params.token || '').trim();
  const maskedEmail = (params.email || '').trim();

  return <ConfirmClient token={token} maskedEmail={maskedEmail} />;
}
