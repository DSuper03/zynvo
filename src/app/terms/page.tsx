
import { NextPage } from 'next';

const TermsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">
          Welcome to Zynvo! These terms and conditions outline the rules and
          regulations for the use of Zynvo's Website, located at zynvo.com.
        </p>
        <p className="mb-4">
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use Zynvo if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>
        <h2 className="text-2xl font-bold mb-2">Cookies</h2>
        <p className="mb-4">
          We employ the use of cookies. By accessing Zynvo, you agreed to
          use cookies in agreement with the Zynvo's Privacy Policy.
        </p>
        <h2 className="text-2xl font-bold mb-2">License</h2>
        <p className="mb-4">
          Unless otherwise stated, Zynvo and/or its licensors own the
          intellectual property rights for all material on Zynvo. All
          intellectual property rights are reserved. You may access this from
          Zynvo for your own personal use subjected to restrictions set in
          these terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
