import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Zynvo',
  description:
    'How Zynvo collects, uses, shares, and protects your information across the website, mobile apps, and backend services. Covers account data, analytics, push notifications, and your privacy rights.',
  alternates: { canonical: 'https://zynvosocial.com/privacy' },
  openGraph: {
    type: 'article',
    url: 'https://zynvosocial.com/privacy',
    title: 'Privacy Policy — Zynvo',
    description:
      'How Zynvo collects, uses, shares, and protects your information, and the rights you have over your data.',
    siteName: 'Zynvo',
  },
  robots: { index: true, follow: true },
};

const PRIVACY_EMAIL = 'privacy@zynvosocial.com';
const SUPPORT_EMAIL = 'zynvosocial@gmail.com';
const APP_URL = 'https://zynvosocial.com';
const LAST_UPDATED = 'August 7, 2026';
const EFFECTIVE = 'August 7, 2026';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-gray-200">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-yellow-400">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Effective Date: {EFFECTIVE} &middot; Last Updated: {LAST_UPDATED}
          </p>
        </div>

        <Section title="1. Introduction">
          <p>
            Welcome to <strong className="text-white">Zynvo</strong> (
            <a className="text-yellow-400 underline-offset-2 hover:underline" href={APP_URL}>
              zynvosocial.com
            </a>
            ). We operate a social platform that helps college students discover
            clubs, events, and people across campuses, and helps clubs and
            colleges run those experiences end-to-end.
          </p>
          <p>
            This Privacy Policy explains what personal information we collect,
            why we collect it, who we share it with, and the rights and choices
            you have. It applies to our website, our mobile applications, and
            any other service that links to this page.
          </p>
          <p>
            By creating an account or using Zynvo, you agree to this Policy.
            If you do not agree, please do not use the service.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>
            We collect information you give us directly, information we get
            from your use of the service, and a small amount of information
            from third-party login providers.
          </p>

          <Subhead>2.1 Account &amp; identity</Subhead>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Name and display name</li>
            <li>Email address (verified via Clerk)</li>
            <li>Profile photo</li>
            <li>College / institution</li>
            <li>Course, academic year, and club memberships</li>
            <li>Bio and other optional profile fields you fill in</li>
            <li>
              Social handles you choose to link (Instagram, LinkedIn, X / Twitter)
            </li>
          </ul>

          <Subhead>2.2 Content you create</Subhead>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Posts, comments, replies, and announcements</li>
            <li>Event RSVPs and team registrations</li>
            <li>Uploaded images, videos, and payment screenshots</li>
            <li>Reports and blocks you submit against other users</li>
          </ul>

          <Subhead>2.3 Authentication &amp; device data</Subhead>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Authentication data managed by <strong>Clerk</strong> (sessions,
              sign-in method, hashed credentials). Zynvo never sees your raw
              password.
            </li>
            <li>
              Push notification tokens from <strong>Expo</strong> and
              <strong> Firebase Cloud Messaging (FCM)</strong> so we can deliver
              event reminders, message notifications, and security alerts.
            </li>
            <li>Device type, operating system, app version, locale, and time zone</li>
          </ul>

          <Subhead>2.4 Analytics &amp; usage data</Subhead>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Product analytics via <strong>PostHog</strong> (events, page
              views, feature usage, performance metrics). We use this to
              improve Zynvo and to debug problems. We do not sell this data.
            </li>
            <li>
              Error reporting via <strong>Sentry</strong> and
              <strong> Vercel Analytics / Speed Insights</strong> for the
              website
            </li>
            <li>Server logs (IP address, request timestamps, user agent)</li>
          </ul>

          <Subhead>2.5 Payment data</Subhead>
          <p>
            For paid events we only store payment proof screenshots you upload.
            We do not collect, store, or process debit/credit card numbers,
            UPI PINs, net-banking credentials, or any other payment instrument
            directly. Payments are made to event organizers outside Zynvo.
          </p>
        </Section>

        <Section title="3. Why We Collect It (How We Use Your Data)">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>To create and authenticate your account</li>
            <li>To show your profile and content to other users</li>
            <li>To let you RSVP to events, join teams, and follow clubs</li>
            <li>To deliver push notifications you have opted into</li>
            <li>
              To detect abuse, spam, and security incidents, and to enforce our
              Terms
            </li>
            <li>
              To understand how Zynvo is used and to improve features and
              performance
            </li>
            <li>
              To respond to support requests and legal / regulatory inquiries
            </li>
          </ul>
        </Section>

        <Section title="4. Who We Share Your Data With">
          <p>
            <strong className="text-white">We do not sell your personal data.</strong>{' '}
            Period. We also do not rent, trade, or share it for advertising
            purposes.
          </p>
          <p>
            We share the minimum data necessary with the following service
            providers, all bound by confidentiality and data-processing
            agreements:
          </p>

          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/70 text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Data shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <Row
                  name="Clerk"
                  purpose="Authentication &amp; account management"
                  data="Name, email, OAuth profile, session info"
                />
                <Row
                  name="Google Cloud Platform"
                  purpose="Hosting our backend &amp; database"
                  data="All account and content data at rest"
                />
                <Row
                  name="ImageKit"
                  purpose="Image / video storage &amp; delivery"
                  data="Uploaded media files"
                />
                <Row
                  name="PostHog"
                  purpose="Product analytics"
                  data="Anonymous &amp; authenticated event data, IP, user agent"
                />
                <Row
                  name="Sentry / Vercel"
                  purpose="Error &amp; performance monitoring"
                  data="Error stack traces, performance metrics"
                />
                <Row
                  name="Expo &amp; Firebase Cloud Messaging"
                  purpose="Push notification delivery"
                  data="Device push tokens, notification content"
                />
                <Row
                  name="Event organizers (your RSVPs)"
                  purpose="Operate the events you register for"
                  data="Your name, email, college, RSVP form answers"
                />
              </tbody>
            </table>
          </div>

          <p>
            We may also disclose information when required by law, valid legal
            process, or to protect the safety, rights, or property of Zynvo,
            our users, or the public.
          </p>
        </Section>

        <Section title="5. Cookies &amp; Local Storage">
          <p>
            Zynvo uses cookies and similar local storage for authentication
            (Clerk session), analytics (PostHog), and to remember your
            preferences (theme, locale, last seen). You can disable
            non-essential cookies in your browser, but the service may not
            work correctly without them.
          </p>
        </Section>

        <Section title="6. Your Rights &amp; Controls">
          <p>You can always do the following:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-white">Edit your profile</strong> from
              the in-app profile editor at any time.
            </li>
            <li>
              <strong className="text-white">Report or block</strong> any user
              or piece of content from inside the app. We review every report.
            </li>
            <li>
              <strong className="text-white">Delete your account</strong> and
              all associated data via the in-app settings, or by visiting{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href="/delete-account"
              >
                zynvosocial.com/delete-account
              </a>
              . See Section 7 below.
            </li>
            <li>
              <strong className="text-white">Export your data</strong> &mdash;
              email{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href={`mailto:${PRIVACY_EMAIL}`}
              >
                {PRIVACY_EMAIL}
              </a>{' '}
              and we will provide a copy within 30 days.
            </li>
            <li>
              <strong className="text-white">Opt out of analytics</strong> by
              using the &ldquo;Do Not Track&rdquo; browser signal or by emailing
              us to be excluded.
            </li>
            <li>
              <strong className="text-white">Withdraw consent</strong> for
              optional processing at any time without affecting the lawfulness
              of processing carried out before withdrawal.
            </li>
          </ul>
        </Section>

        <Section title="7. Account Deletion">
          <p>
            You can request deletion of your Zynvo account and associated data
            in either of these ways:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              In the app: <em>Settings &rarr; Account &rarr; Delete account</em>.
            </li>
            <li>
              On the web: visit{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href="/delete-account"
              >
                zynvosocial.com/delete-account
              </a>
              . You can sign in with Clerk for a one-click request, or use the
              email-verification fallback if you can&apos;t sign in.
            </li>
          </ul>
          <p>
            When deletion is confirmed, we delete your profile, posts, RSVPs,
            comments, uploaded media, sessions, and push tokens within{' '}
            <strong className="text-white">30 days</strong>. We may retain
            limited information for legitimate reasons (see Section 8).
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We keep personal data only as long as needed for the purposes
            described in this Policy, and then delete or anonymize it.
            Specific retention rules:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-white">Account data:</strong> deleted
              within 30 days of a confirmed deletion request.
            </li>
            <li>
              <strong className="text-white">Posts &amp; RSVPs:</strong> deleted
              with your account; cached copies may persist in backups for up to
              90 days before being overwritten.
            </li>
            <li>
              <strong className="text-white">Payment proof &amp; financial
              records:</strong> retained for up to 8 years where required by
              tax / accounting law.
            </li>
            <li>
              <strong className="text-white">Abuse &amp; legal-hold
              records:</strong> retained for up to 2 years after account
              closure when there has been a Terms violation, fraud, or an
              active legal dispute.
            </li>
            <li>
              <strong className="text-white">Aggregated analytics:</strong>{' '}
              retained indefinitely in a form that can no longer identify you.
            </li>
          </ul>
        </Section>

        <Section title="9. Data Security">
          <p>
            We protect your data with industry-standard controls: HTTPS/TLS in
            transit, encryption at rest on our cloud database, hashed
            credentials (managed by Clerk), role-based access for staff, and
            ongoing monitoring via Sentry. No system is 100% secure, but we
            work continuously to reduce risk.
          </p>
        </Section>

        <Section title="10. International Transfers">
          <p>
            Zynvo is operated from India, and our primary infrastructure is on
            Google Cloud in the Asia-South region. By using Zynvo, you
            understand your data may be transferred to and processed in
            countries other than your own. We rely on standard contractual
            clauses with our processors for such transfers.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            Zynvo is intended for users who are at least 13 years old. We do
            not knowingly collect personal information from children under 13.
            If you believe a child under 13 has created an account, contact us
            at {PRIVACY_EMAIL} and we will delete it.
          </p>
        </Section>

        <Section title="12. Changes to this Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do,
            we will revise the &ldquo;Last Updated&rdquo; date at the top.
            For material changes, we will notify you via the app or by email
            before the change takes effect.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            For any privacy question, request, or complaint, contact our
            privacy team:
          </p>
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-5">
            <p>
              <strong className="text-white">Privacy email:</strong>{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href={`mailto:${PRIVACY_EMAIL}`}
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">General support:</strong>{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">Website:</strong>{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href={APP_URL}
              >
                {APP_URL}
              </a>
            </p>
            <p className="mt-2">
              <strong className="text-white">Delete account:</strong>{' '}
              <a
                className="text-yellow-400 underline-offset-2 hover:underline"
                href="/delete-account"
              >
                zynvosocial.com/delete-account
              </a>
            </p>
          </div>
        </Section>

        <p className="mt-12 text-xs text-gray-500">
          This page is also available in plain text at{' '}
          <Link
            className="text-yellow-400 underline-offset-2 hover:underline"
            href="/_markdown/privacy"
          >
            /_markdown/privacy
          </Link>{' '}
          for screen readers and agentic tools.
        </p>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-gray-800 pt-10">
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-gray-300">
        {children}
      </div>
    </section>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-4 text-lg font-semibold text-white">{children}</h3>
  );
}

function Row({
  name,
  purpose,
  data,
}: {
  name: string;
  purpose: string;
  data: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-white">{name}</td>
      <td className="px-4 py-3">{purpose}</td>
      <td className="px-4 py-3">{data}</td>
    </tr>
  );
}
