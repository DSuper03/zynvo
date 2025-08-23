import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function VerificationPage() {
  const [userId, setUserId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock verification logic
  const verifyUser = async () => {
    if (!userId.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const id = userId.toLowerCase().trim();
    let result;
    
    if (id.includes('invalid') || id.length < 3) {
      result = {
        status: 'invalid',
        title: 'Invalid ID Format',
        message: 'The ID format is incorrect or too short. Please check and try again.',
        icon: AlertTriangle,
        color: 'text-red-400',
        borderColor: 'border-red-400',
        bgGlow: 'shadow-red-400/20'
      };
    } else if (id.includes('registered') || id.includes('user') || id.includes('verified')) {
      result = {
        status: 'registered',
        title: 'Successfully Registered! 🎉',
        message: 'Great news! This ID is verified and active in our system.',
        icon: CheckCircle,
        color: 'text-green-400',
        borderColor: 'border-green-400',
        bgGlow: 'shadow-green-400/20'
      };
    } else {
      result = {
        status: 'not-registered',
        title: 'Not Registered Yet',
        message: 'This ID is not found in our system. Would you like to register?',
        icon: XCircle,
        color: 'text-orange-400',
        borderColor: 'border-orange-400',
        bgGlow: 'shadow-orange-400/20'
      };
    }
    
    setVerificationResult(result);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyUser();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
              }
              div {
                animation: float infinite ease-in-out;
              }
            `}</style>
          </div>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full opacity-10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-yellow-300 rounded-full opacity-15 blur-2xl animate-ping" style={{animationDuration: '3s'}}></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            ✨ Verification Station! ✨
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-2">
            Ready to check your status? Let's make some magic happen! 🚀
          </p>
          <p className="text-yellow-400 text-sm sm:text-base font-medium">
            Enter your ID and discover your verification journey
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md mb-8">
          <div className="bg-black/70 backdrop-blur-lg border-2 border-yellow-400 rounded-2xl p-6 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all duration-300">
            <div className="mb-4">
              <label htmlFor="userId" className="block text-yellow-400 text-sm font-semibold mb-2">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your ID (try 'user123', 'invalid', or 'test')"
                className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
              />
            </div>
            
            <button
              onClick={verifyUser}
              disabled={isLoading || !userId.trim()}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-300 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-yellow-400/50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Status ⚡'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {verificationResult && (
          <div className="w-full max-w-2xl animate-slide-up">
            <div className={`bg-black/80 backdrop-blur-lg border-2 ${verificationResult.borderColor} rounded-2xl p-6 shadow-2xl ${verificationResult.bgGlow} transition-all duration-500`}>
              <div className="text-center">
                <verificationResult.icon 
                  size={64} 
                  className={`mx-auto mb-4 ${verificationResult.color} animate-bounce`}
                />
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-3">
                  {verificationResult.title}
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-4">
                  {verificationResult.message}
                </p>
                
                {/* Status specific content */}
                {verificationResult.status === 'registered' && (
                  <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mt-4">
                    <p className="text-green-300 text-sm">
                      🎊 Welcome back! Your account is active and ready to go.
                    </p>
                  </div>
                )}
                
                {verificationResult.status === 'not-registered' && (
                  <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4 mt-4">
                    <p className="text-orange-300 text-sm mb-3">
                      💫 No worries! Registration is quick and easy.
                    </p>
                    <button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-semibold py-2 px-4 rounded-lg hover:from-orange-300 hover:to-yellow-300 transition-colors duration-200">
                      Start Registration
                    </button>
                  </div>
                )}
                
                {verificationResult.status === 'invalid' && (
                  <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mt-4">
                    <p className="text-red-300 text-sm">
                      🔍 Double-check your ID format and try again!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help? We're here to make verification a breeze! 💨
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}