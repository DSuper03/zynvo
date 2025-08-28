
import { NextPage } from 'next';

const PrivacyPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <p className="mb-4">
          We use Your Personal data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy.
        </p>
        <h2 className="text-2xl font-bold mb-2">Information We Collect</h2>
        <p className="mb-4">
          We may collect personally identifiable information, such as your name,
          email address, and other contact details when you register on our
          site.
        </p>
        <h2 className="text-2xl font-bold mb-2">How We Use Your Information</h2>
        <p className="mb-4">
          We may use the information we collect to personalize your experience,
          improve our website, and send periodic emails.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
