'use client';

/**
 * Landing / home page.
 * Renders WalletConnect when no wallet is connected; redirects to /dashboard when connected.
 * Requirements: 1.1, 1.5
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../hooks/useWallet';
import WalletConnect from '../components/WalletConnect';

export default function HomePage() {
  const { publicKey, connect, isConnecting, error, isInitialized } = useWallet();
  const router = useRouter();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleConnect = async (walletType: 'freighter' | 'albedo') => {
    setLocalError(null);
    await connect(walletType);
  };

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  useEffect(() => {
    if (isInitialized && publicKey) {
      router.replace('/dashboard');
    }
  }, [publicKey, router, isInitialized]);

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-block mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-300% leading-tight">
          Stellar Freelance
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2 animate-fade-in-up animation-delay-200">
          Decentralized Payments & Escrow
        </p>
        
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-400">
          Built on the Stellar blockchain for fast, secure transactions
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up animation-delay-600">
          <span className="badge">⚡ Instant Payments</span>
          <span className="badge">🔒 Secure Escrow</span>
          <span className="badge">💰 Low Fees</span>
          <span className="badge">🌍 Global</span>
        </div>
      </div>

      {/* Wallet Connect Card */}
      <div className="w-full max-w-md animate-fade-in-up animation-delay-800">
        <div className="card p-8 relative overflow-hidden group">
          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connect your wallet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred Stellar wallet to get started
              </p>
            </div>
            
            <WalletConnect onConnect={handleConnect} isConnecting={isConnecting} error={localError} />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-1000">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>Trusted by 1000+</span>
          </div>
        </div>
      </div>
    </main>
  );
}

