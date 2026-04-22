'use client';

/**
 * History page — paginated, filterable transaction history with CSV export.
 * Requirements: 7.1, 7.2, 7.3
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../hooks/useWallet';
import NavBar from '../../components/NavBar';
import TxHistory from '../../components/TxHistory';
import { fetchTransactionHistory } from '../../lib/stellar';
import type { TxRecord } from '../../components/TxHistory';

function mapToTxRecord(raw: any): TxRecord {
  // Support both mock format (paymentId, sender, recipient, status) and Horizon format
  if (raw.paymentId !== undefined) {
    return {
      paymentId: raw.paymentId,
      sender: raw.sender ?? '—',
      recipient: raw.recipient ?? '—',
      amount: raw.amount ?? '—',
      asset: raw.asset ?? '—',
      status: raw.status ?? '—',
    };
  }
  return {
    paymentId: raw.id ?? raw.hash ?? '—',
    sender: raw.source_account ?? '—',
    recipient: raw.to ?? '—',
    amount: raw.amount ?? '—',
    asset: raw.asset_type === 'native' ? 'XLM' : raw.asset_code ?? '—',
    status: raw.successful ? 'confirmed' : 'failed',
  };
}

export default function HistoryPage() {
  const { publicKey, connect, disconnect, isConnecting, error, balances, xlmUsdRate, isInitialized } =
    useWallet();
  const router = useRouter();

  const [records, setRecords] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && !publicKey) {
      router.replace('/');
    }
  }, [publicKey, router, isInitialized]);

  const loadHistory = useCallback(
    async (cursor?: string) => {
      if (!publicKey) return;
      setLoading(true);
      setFetchError(null);
      try {
        const { records: raw, nextCursor: nc } = await fetchTransactionHistory(
          publicKey,
          cursor
        );
        const mapped = raw.map(mapToTxRecord);
        setRecords((prev) => (cursor ? [...prev, ...mapped] : mapped));
        setNextCursor(nc);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    },
    [publicKey]
  );

  useEffect(() => {
    if (publicKey) loadHistory();
  }, [publicKey, loadHistory]);

  if (!isInitialized) {
    return null;
  }

  if (!publicKey) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <NavBar
        publicKey={publicKey}
        balances={balances}
        xlmUsdRate={xlmUsdRate}
        onDisconnect={disconnect}
      />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h1>
          </div>
          <button
            type="button"
            onClick={() => loadHistory()}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {fetchError && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-fade-in-up">
            {fetchError}
          </div>
        )}

        <div className="animate-fade-in-up animation-delay-200">
          <TxHistory records={records} />
        </div>

        {nextCursor && (
          <div className="mt-4 flex justify-center animate-fade-in-up">
            <button
              type="button"
              onClick={() => loadHistory(nextCursor)}
              disabled={loading}
              className="rounded-xl border-2 border-indigo-500 dark:border-indigo-400 px-6 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-all transform hover:scale-105"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
