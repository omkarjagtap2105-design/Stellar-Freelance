'use client';

/**
 * Payment link page — pre-populates PaymentForm from URL search params.
 * Format: /pay?to={address}&amount={amount}&asset={asset}
 * Requirements: 9.1, 9.2, 9.3
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWallet } from '../../hooks/useWallet';
import NavBar from '../../components/NavBar';
import PaymentForm from '../../components/PaymentForm';
import WalletConnect from '../../components/WalletConnect';

/** Stellar address regex: G + 55 base32 chars */
const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;

function parseParams(searchParams: URLSearchParams): {
  to: string;
  amount: string;
  asset: string;
  addressError: string | null;
} {
  const to = searchParams.get('to') ?? '';
  const amount = searchParams.get('amount') ?? '';
  const asset = searchParams.get('asset') ?? 'XLM';

  const addressError =
    to && !STELLAR_ADDRESS_RE.test(to)
      ? `Invalid Stellar address in payment link: "${to}"`
      : null;

  return { to, amount, asset, addressError };
}

function PayPageContent() {
  const { publicKey, signFn, connect, disconnect, isConnecting, error, balances, xlmUsdRate } =
    useWallet();
  const searchParams = useSearchParams();

  const { to, amount, asset, addressError } = parseParams(searchParams);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <NavBar
        publicKey={publicKey}
        balances={balances}
        xlmUsdRate={xlmUsdRate}
        onDisconnect={disconnect}
      />

      <main className="mx-auto max-w-md px-4 py-12">
        <div className="card p-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Request
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete the payment below.
              </p>
            </div>
          </div>

          {/* Invalid address error — blocks form (Req 9.3) */}
          {addressError && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-400"
            >
              {addressError}
            </div>
          )}

          {!publicKey ? (
            /* Prompt wallet connection if not yet connected */
            <WalletConnect onConnect={connect} isConnecting={isConnecting} error={error} />
          ) : !signFn ? null : addressError ? (
            /* Block form submission when address is invalid */
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fix the address in the payment link to proceed.
            </p>
          ) : (
            <PaymentForm
              publicKey={publicKey}
              signFn={signFn}
              defaultTo={to}
              defaultAmount={amount}
              defaultAsset={asset !== 'XLM' ? asset : undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <PayPageContent />
    </Suspense>
  );
}
