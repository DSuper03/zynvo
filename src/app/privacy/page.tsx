// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>

        <p className="mt-3 text-sm text-gray-500">
          Effective Date: July 24, 2026
        </p>

        <p className="mt-8 leading-7">
          Welcome to <strong>Zynvo</strong>. Your privacy is important to us.
          This Privacy Policy explains what information we collect, how we use
          it, and the choices you have regarding your information while using
          Zynvo.
        </p>

        <Section title="1. Information We Collect">
          <h3 className="font-semibold">Account Information</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Name</li>
            <li>Email Address</li>
            <li>Encrypted Password</li>
            <li>Profile Picture</li>
            <li>College Name</li>
            <li>Course</li>
            <li>Academic Year</li>
            <li>Club Membership</li>
            <li>Bio</li>
          </ul>

          <h3 className="mt-6 font-semibold">Optional Profile Information</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Phone Number</li>
            <li>Instagram Profile</li>
            <li>LinkedIn Profile</li>
            <li>Twitter/X Profile</li>
          </ul>

          <h3 className="mt-6 font-semibold">User Generated Content</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Posts</li>
            <li>Comments and Announcements</li>
            <li>Event Registrations</li>
            <li>Team Information</li>
            <li>Registration Responses</li>
            <li>Images uploaded by users</li>
          </ul>

          <h3 className="mt-6 font-semibold">Payment Information</h3>
          <p className="mt-2">
            For paid events, users may upload payment confirmation screenshots.
            Zynvo does not store or process debit card, credit card, or banking
            information.
          </p>

          <h3 className="mt-6 font-semibold">Push Notifications</h3>
          <p className="mt-2">
            If you enable notifications, we may store a push notification token
            to deliver event reminders, announcements, and account updates.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc space-y-2 pl-6">
            <li>Create and manage your account.</li>
            <li>Authenticate your identity.</li>
            <li>Display your public profile.</li>
            <li>Enable club and event participation.</li>
            <li>Allow users to create teams and posts.</li>
            <li>Verify event registrations and payments.</li>
            <li>Send notifications and important updates.</li>
            <li>Maintain platform security and prevent abuse.</li>
            <li>Improve the quality and performance of our services.</li>
          </ul>
        </Section>

        <Section title="3. Third-Party Services">
          <p>
            Zynvo uses trusted third-party providers to operate the platform.
            These providers process data only as necessary to provide their
            services.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Clerk</strong> – User authentication and account
              management.
            </li>
            <li>
              <strong>Google Sign-In</strong> – Secure login via Google,
              provided through Clerk.
            </li>
            <li>
              <strong>ImageKit</strong> – Storage and delivery of uploaded
              images.
            </li>
            <li>
              <strong>Google Cloud Platform (GCP)</strong> – Backend hosting and
              infrastructure.
            </li>
            <li>
              <strong>Expo Notifications</strong> – Delivery of push
              notifications.
            </li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>
            We do not sell your personal information.
          </p>

          <p className="mt-4">
            Information may be shared only when necessary:
          </p>

          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>With event organizers for events you register for.</li>
            <li>With club administrators where applicable.</li>
            <li>With trusted service providers that operate Zynvo.</li>
            <li>When required by law or legal process.</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>
            We use industry-standard security measures including encrypted
            connections (HTTPS), secure authentication, password hashing,
            controlled access to infrastructure, and secure cloud hosting to
            protect your information.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain personal information only for as long as necessary to
            provide our services, comply with legal obligations, resolve
            disputes, and enforce our agreements.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <ul className="list-disc space-y-2 pl-6">
            <li>Access your personal information.</li>
            <li>Update your profile.</li>
            <li>Delete your account.</li>
            <li>Request deletion of your personal data.</li>
            <li>Contact us regarding privacy concerns.</li>
          </ul>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Zynvo is intended for users who are at least 13 years old. We do not
            knowingly collect personal information from children under 13.
          </p>
        </Section>

        <Section title="9. Changes to this Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes become
            effective once published on this page.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions regarding this Privacy Policy or your
            personal information, contact us at:
          </p>

          <div className="mt-4 rounded-lg border p-4">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:privacy@zynvosocial.com"
                className="text-blue-600 hover:underline"
              >
                zynvosocial@gmail.com
              </a>
            </p>

            <p className="mt-2">
              <strong>Website:</strong>{" "}
              <a
                href="https://zynvosocial.com"
                className="text-blue-600 hover:underline"
              >
                https://zynvosocial.com
              </a>
            </p>
          </div>
        </Section>
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
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-gray-700">
        {children}
      </div>
    </section>
  );
}