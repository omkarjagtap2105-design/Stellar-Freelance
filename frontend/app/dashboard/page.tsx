'use client';

/**
 * Dashboard page — main workspace for payments, escrow, and invoices.
 * Requirements: 2.1, 3.1, 10.1
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../hooks/useWallet';
import NavBar from '../../components/NavBar';
import PaymentForm from '../../components/PaymentForm';
import EscrowForm from '../../components/EscrowForm';
import BatchPayment from '../../components/BatchPayment';
import InvoiceGenerator from '../../components/InvoiceGenerator';

/** Placeholder invoice data shown until a real tx is available */
const PLACEHOLDER_INVOICE = {
  txId: '—',
  sender: '—',
  recipient: '—',
  amount: '0',
  asset: 'XLM',
  timestamp: new Date().toISOString(),
  network: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015',
};

export default function DashboardPage() {
  const { publicKey, signFn, connect, disconnect, isConnecting, error, balances, xlmUsdRate, isInitialized } =
    useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !publicKey) {
      router.replace('/');
    }
  }, [publicKey, router, isInitialized]);

  // Show nothing until session is restored from localStorage
  if (!isInitialized) {
    return null;
  }

  if (!publicKey) {
    return null;
  }

  // signFn may be briefly null during state transitions; show loading
  if (!signFn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <NavBar
        publicKey={publicKey}
        balances={balances}
        xlmUsdRate={xlmUsdRate}
        onDisconnect={disconnect}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Stats */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient bg-300%">
                Welcome Back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your payments, escrows, and invoices seamlessly
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 transform hover:scale-105 transition-transform">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Total Balance</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {balances.find(b => b.asset === 'XLM')?.balance || '0'} XLM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid with Staggered Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Payment Card */}
          <div className="card-animated" style={{ animationDelay: '0.1s' }}>
            <div className="card p-6 h-full group hover:shadow-indigo-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Payment</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Instant XLM transfers</p>
                </div>
              </div>
              <PaymentForm publicKey={publicKey} signFn={signFn} />
            </div>
          </div>

          {/* Create Escrow Card */}
          <div className="card-animated" style={{ animationDelay: '0.2s' }}>
            <div className="card p-6 h-full group hover:shadow-purple-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Escrow</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Secure milestone payments</p>
                </div>
              </div>
              <EscrowForm publicKey={publicKey} signFn={signFn} />
            </div>
          </div>

          {/* Batch Payment Card */}
          <div className="card-animated" style={{ animationDelay: '0.3s' }}>
            <div className="card p-6 h-full group hover:shadow-green-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Batch Payment</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pay multiple recipients</p>
                </div>
              </div>
              <BatchPayment publicKey={publicKey} signFn={signFn} />
            </div>
          </div>

          {/* Invoice Generator Card */}
          <div className="card-animated" style={{ animationDelay: '0.4s' }}>
            <div className="card p-6 h-full group hover:shadow-orange-500/20 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Generator</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create PDF invoices</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Generate professional PDF invoices for completed transactions
              </p>
              <InvoiceGenerator data={PLACEHOLDER_INVOICE} label="Download Sample Invoice" />
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-indigo-100 dark:border-indigo-800 animate-fade-in animation-delay-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check out our documentation and guides</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all transform hover:scale-105">
                View Docs
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


