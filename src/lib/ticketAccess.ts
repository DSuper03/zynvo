/**
 * Whether a pass's entry QR may be shown. Mirrors the backend's check-in rule
 * (checkInPass): the registration must be approved by the club head/core team
 * and its payment must not be pending or rejected.
 *
 * Returns null when the QR can be shown, otherwise what to tell the student.
 * An approvalStatus of undefined means the API didn't send the field (older
 * backend); the scanner still enforces the rule, so the QR is not hidden then.
 */
export type TicketLock = { title: string; message: string; tone: 'pending' | 'rejected' };

export function ticketLock(approvalStatus?: string | null, paymentStatus?: string | null): TicketLock | null {
  if (approvalStatus !== undefined) {
    const approval = String(approvalStatus ?? '').trim().toLowerCase();
    if (approval === 'rejected' || approval === 'declined') {
      return {
        title: 'Request declined',
        message: 'Your registration for this event was not approved by the organiser.',
        tone: 'rejected',
      };
    }
    if (approval !== 'approved') {
      return {
        title: 'Approval pending',
        message: 'The organiser is reviewing your request. Your QR code will appear here once approved.',
        tone: 'pending',
      };
    }
  }
  const payment = String(paymentStatus ?? '').trim().toUpperCase();
  if (payment === 'REJECTED') {
    return {
      title: 'Payment not accepted',
      message: "The organiser couldn't verify your payment. Contact them to sort it out.",
      tone: 'rejected',
    };
  }
  if (payment === 'PENDING') {
    return {
      title: 'Payment under review',
      message: "The organiser is verifying your payment. Your QR code will appear here once it's confirmed.",
      tone: 'pending',
    };
  }
  return null;
}
