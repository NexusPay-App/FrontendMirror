'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api, USDCBalance, BuyCryptoResponse, Transaction, TransactionHistoryResponse } from '@/lib/api';

// Supported chains and tokens
const SUPPORTED_CHAINS = [
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'celo', label: 'Celo' },
  { value: 'base', label: 'Base' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'gnosis', label: 'Gnosis' },
];

const SUPPORTED_TOKENS = [
  { value: 'USDC', label: 'USDC' },
  { value: 'USDT', label: 'USDT' },
  { value: 'BITCOIN', label: 'Bitcoin' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<USDCBalance | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showBuyCrypto, setShowBuyCrypto] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  
  // Payment form data
  const [paymentData, setPaymentData] = useState({
    amount: '',
    targetType: 'paybill' as 'paybill' | 'till',
    targetNumber: '',
    accountNumber: '',
    description: '',
  });
  
  // Buy crypto form data
  const [buyCryptoData, setBuyCryptoData] = useState({
    cryptoAmount: '',
    chain: 'arbitrum',
    tokenType: 'USDC',
    paymentMethod: 'mpesa' as 'mpesa' | 'bank',
  });
  
  // Transaction history data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsPagination, setTransactionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');
  const [transactionError, setTransactionError] = useState('');

  // Get user info
  const walletAddress = api.getStoredWalletAddress();
  const phoneNumber = api.getStoredPhoneNumber();

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    loadBalance();
  }, [router]);

  const loadBalance = async () => {
    if (!walletAddress) return;

    try {
      const balanceData = await api.getUSDCBalance('arbitrum', walletAddress);
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentSuccess('');
    
    if (!balance || !walletAddress) {
      setPaymentError('Balance not loaded');
      return;
    }

    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }

    // Calculate crypto amount based on rate
    const cryptoAmount = amount / balance.rate;
    
    if (cryptoAmount > parseFloat(balance.balanceInUSDC)) {
      setPaymentError('Insufficient USDC balance');
      return;
    }

    setIsPaymentLoading(true);

    try {
      const response = await api.payWithCrypto({
        amount,
        cryptoAmount,
        targetType: paymentData.targetType,
        targetNumber: paymentData.targetNumber,
        accountNumber: paymentData.targetType === 'paybill' ? paymentData.accountNumber : undefined,
        chain: 'arbitrum',
        tokenType: 'USDC',
        description: paymentData.description || undefined,
      });

      if (response.success && response.data) {
        setPaymentSuccess(response.data.instructions);
        setPaymentData({
          amount: '',
          targetType: 'paybill',
          targetNumber: '',
          accountNumber: '',
          description: '',
        });
        // Refresh balance
        loadBalance();
      } else {
        setPaymentError(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleBuyCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyError('');
    setBuySuccess('');
    
    if (!phoneNumber) {
      setBuyError('Phone number not available');
      return;
    }

    const cryptoAmount = parseFloat(buyCryptoData.cryptoAmount);
    if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
      setBuyError('Please enter a valid crypto amount');
      return;
    }

    setIsBuyLoading(true);

    try {
      const response: BuyCryptoResponse = await api.buyCrypto({
        cryptoAmount,
        phone: phoneNumber,
        chain: buyCryptoData.chain,
        tokenType: buyCryptoData.tokenType,
      });

      if (response.success && response.data) {
        setBuySuccess(response.data.instructions || 'Crypto purchase initiated successfully!');
        setBuyCryptoData({
          cryptoAmount: '',
          chain: 'arbitrum',
          tokenType: 'USDC',
          paymentMethod: 'mpesa',
        });
        // Refresh balance
        loadBalance();
      } else {
        setBuyError(response.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Buy crypto error:', error);
      setBuyError(error instanceof Error ? error.message : 'Purchase failed');
    } finally {
      setIsBuyLoading(false);
    }
  };

  const loadTransactionHistory = async (page: number = 1) => {
    setIsLoadingTransactions(true);
    setTransactionError('');
    
    try {
      const response: TransactionHistoryResponse = await api.getTransactionHistory(page, 10);
      
      if (response.success && response.data) {
        setTransactions(response.data.transactions);
        setTransactionsPagination(response.data.pagination);
      } else {
        setTransactionError('Failed to load transaction history');
      }
    } catch (error) {
      console.error('Transaction history error:', error);
      setTransactionError(error instanceof Error ? error.message : 'Failed to load transactions');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const getBlockExplorerUrl = (chain: string, txHash: string): string => {
    const explorers: Record<string, string> = {
      arbitrum: 'https://arbiscan.io/tx/',
      celo: 'https://celoscan.io/tx/',
      base: 'https://basescan.org/tx/',
      optimism: 'https://optimistic.etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      avalanche: 'https://snowtrace.io/tx/',
      scroll: 'https://scrollscan.com/tx/',
      gnosis: 'https://gnosisscan.io/tx/',
    };
    
    return explorers[chain.toLowerCase()] + txHash;
  };

  const formatTransactionType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'crypto_to_paybill': 'Pay Bill',
      'crypto_to_till': 'Pay Till',
      'fiat_to_crypto': 'Buy Crypto',
      'crypto_to_fiat': 'Sell Crypto',
      'crypto_transfer': 'Transfer',
      'deposit': 'Deposit',
      'withdrawal': 'Withdrawal',
    };
    
    return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!api.isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#EAECEF]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#1E2329]">NexusPay</h1>
            <p className="text-sm text-[#707A8A]">{phoneNumber}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#707A8A] hover:text-[#F6465D] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAECEF]">
          <div className="text-center">
            <p className="text-sm text-[#707A8A] mb-2">USDC Balance</p>
            {isLoadingBalance ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 border-2 border-[#F0B90B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : balance ? (
              <>
                <h2 className="text-3xl font-bold text-[#1E2329] mb-1">
                  ${balance.balanceInUSDC}
                </h2>
                <p className="text-sm text-[#707A8A]">
                  ≈ KES {balance.balanceInKES} (Rate: {balance.rate})
                </p>
              </>
            ) : (
              <p className="text-[#F6465D]">Failed to load balance</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowBuyCrypto(!showBuyCrypto)}
            className="flex items-center justify-center gap-2 h-14 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Buy Crypto
          </Button>
          
          <Button
            onClick={() => setShowPayment(!showPayment)}
            variant="outline"
            className="flex items-center justify-center gap-2 h-14 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Pay Bills
          </Button>
        </div>

        {/* Secondary Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              setShowTransactions(!showTransactions);
              if (!showTransactions && transactions.length === 0) {
                loadTransactionHistory();
              }
            }}
            variant="outline"
            className="flex items-center justify-center gap-2 h-14 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v5h5" />
              <path d="M21 21v-5h-5" />
              <path d="M2 12h20" />
              <path d="M13 2L3 7l10 5 10-5-10-5" />
            </svg>
            Transactions
          </Button>
          
          <Button
            variant="outline"
            onClick={loadBalance}
            className="flex items-center justify-center gap-2 h-14 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Refresh
          </Button>
        </div>

        {/* Buy Crypto Form */}
        {showBuyCrypto && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAECEF]">
            <h3 className="text-lg font-semibold text-[#1E2329] mb-4">Buy Crypto with M-Pesa</h3>
            
            {buyError && (
              <div className="mb-4 p-3 rounded-lg bg-[#F6465D]/10 text-[#F6465D] text-sm">
                {buyError}
              </div>
            )}
            
            {buySuccess && (
              <div className="mb-4 p-3 rounded-lg bg-[#0ECB81]/10 text-[#0ECB81] text-sm">
                {buySuccess}
              </div>
            )}

            <form onSubmit={handleBuyCryptoSubmit} className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-[#1E2329] mb-2">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="mpesa"
                      checked={buyCryptoData.paymentMethod === 'mpesa'}
                      onChange={(e) => setBuyCryptoData(prev => ({ ...prev, paymentMethod: e.target.value as 'mpesa' | 'bank' }))}
                      className="text-[#F0B90B]"
                    />
                    <span className="text-sm font-medium">M-Pesa</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="bank"
                      checked={buyCryptoData.paymentMethod === 'bank'}
                      onChange={(e) => setBuyCryptoData(prev => ({ ...prev, paymentMethod: e.target.value as 'mpesa' | 'bank' }))}
                      className="text-[#F0B90B]"
                    />
                    <span className="text-sm">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1E2329] mb-2">Token</label>
                <select
                  value={buyCryptoData.tokenType}
                  onChange={(e) => setBuyCryptoData(prev => ({ ...prev, tokenType: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-[#EAECEF] rounded-lg focus:border-[#F0B90B] focus:outline-none transition-colors"
                >
                  {SUPPORTED_TOKENS.map(token => (
                    <option key={token.value} value={token.value}>
                      {token.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chain Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1E2329] mb-2">Blockchain Network</label>
                <select
                  value={buyCryptoData.chain}
                  onChange={(e) => setBuyCryptoData(prev => ({ ...prev, chain: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-[#EAECEF] rounded-lg focus:border-[#F0B90B] focus:outline-none transition-colors"
                >
                  {SUPPORTED_CHAINS.map(chain => (
                    <option key={chain.value} value={chain.value}>
                      {chain.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crypto Amount */}
              <Input
                label="Crypto Amount"
                type="number"
                step="0.01"
                value={buyCryptoData.cryptoAmount}
                onChange={(e) => setBuyCryptoData(prev => ({ ...prev, cryptoAmount: e.target.value }))}
                placeholder="Enter amount to buy"
                required
                helperText={`Amount of ${buyCryptoData.tokenType} to purchase`}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBuyCrypto(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isBuyLoading}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Form */}
        {showPayment && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAECEF]">
            <h3 className="text-lg font-semibold text-[#1E2329] mb-4">Pay with Crypto</h3>
            
            {paymentError && (
              <div className="mb-4 p-3 rounded-lg bg-[#F6465D]/10 text-[#F6465D] text-sm">
                {paymentError}
              </div>
            )}
            
            {paymentSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-[#0ECB81]/10 text-[#0ECB81] text-sm">
                {paymentSuccess}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <Input
                label="Amount (KES)"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#1E2329] mb-2">Payment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="paybill"
                      checked={paymentData.targetType === 'paybill'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, targetType: e.target.value as 'paybill' | 'till' }))}
                      className="text-[#F0B90B]"
                    />
                    <span className="text-sm">Paybill</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="till"
                      checked={paymentData.targetType === 'till'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, targetType: e.target.value as 'paybill' | 'till' }))}
                      className="text-[#F0B90B]"
                    />
                    <span className="text-sm">Till Number</span>
                  </label>
                </div>
              </div>

              <Input
                label={paymentData.targetType === 'paybill' ? 'Paybill Number' : 'Till Number'}
                type="text"
                value={paymentData.targetNumber}
                onChange={(e) => setPaymentData(prev => ({ ...prev, targetNumber: e.target.value }))}
                placeholder={paymentData.targetType === 'paybill' ? 'e.g., 888880' : 'e.g., 123456'}
                required
              />

              {paymentData.targetType === 'paybill' && (
                <Input
                  label="Account Number"
                  type="text"
                  value={paymentData.accountNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Enter account number"
                  required
                />
              )}

              <Input
                label="Description (Optional)"
                type="text"  
                value={paymentData.description}
                onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Payment description"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isPaymentLoading}
                  className="flex-1"
                >
                  Pay Now
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Transaction History */}
        {showTransactions && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAECEF]">
            <h3 className="text-lg font-semibold text-[#1E2329] mb-4">Transaction History</h3>
            
            {transactionError && (
              <div className="mb-4 p-3 rounded-lg bg-[#F6465D]/10 text-[#F6465D] text-sm">
                {transactionError}
              </div>
            )}

            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 border-2 border-[#F0B90B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-[#707A8A]"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5,4.21 12,6.81 16.5,4.21" />
                  <polyline points="7.5,19.79 7.5,14.6 3,12" />
                  <polyline points="21,12 16.5,14.6 16.5,19.79" />
                </svg>
                <p className="text-[#707A8A] text-sm">No transactions yet</p>
                <p className="text-[#707A8A] text-xs mt-1">Your transaction history will appear here</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border border-[#EAECEF] rounded-xl p-4 hover:bg-[#F8F9FA] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Transaction Type & Status */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-[#1E2329]">
                              {formatTransactionType(transaction.type)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === 'completed'
                                  ? 'bg-[#0ECB81]/10 text-[#0ECB81]'
                                  : transaction.status === 'pending'
                                  ? 'bg-[#F0B90B]/10 text-[#F0B90B]'
                                  : 'bg-[#F6465D]/10 text-[#F6465D]'
                              }`}
                            >
                              {transaction.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Amount & Token Info */}
                          <div className="space-y-1 mb-2">
                            {transaction.tokenAmount && transaction.tokenSymbol && (
                              <p className="text-sm text-[#1E2329]">
                                <span className="font-mono">
                                  {transaction.tokenAmount} {transaction.tokenSymbol}
                                </span>
                                {transaction.chain && (
                                  <span className="ml-2 px-2 py-1 bg-[#F8F9FA] rounded text-xs text-[#707A8A]">
                                    {transaction.chain.toUpperCase()}
                                  </span>
                                )}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-[#707A8A]">
                              {transaction.amountInUSD && (
                                <span>${transaction.amountInUSD.toFixed(2)}</span>
                              )}
                              {transaction.amountInKES && (
                                <span>KES {transaction.amountInKES.toFixed(2)}</span>
                              )}
                            </div>
                          </div>

                          {/* Target Info for payments */}
                          {(transaction.targetType || transaction.targetNumber) && (
                            <p className="text-xs text-[#707A8A] mb-2">
                              {transaction.targetType === 'paybill' ? 'Paybill:' : 'Till:'} {transaction.targetNumber}
                              {transaction.accountNumber && ` • Account: ${transaction.accountNumber}`}
                            </p>
                          )}

                          {/* Description */}
                          {transaction.description && (
                            <p className="text-xs text-[#707A8A] mb-2">{transaction.description}</p>
                          )}

                          {/* Transaction Hash & Block Explorer */}
                          {transaction.txHash && transaction.chain && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-[#707A8A]">TX:</span>
                              <code className="text-xs font-mono text-[#1E2329] bg-[#F8F9FA] px-2 py-1 rounded">
                                {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-8)}
                              </code>
                              <a
                                href={getBlockExplorerUrl(transaction.chain, transaction.txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#F0B90B] hover:underline text-xs font-medium"
                              >
                                View on Explorer ↗
                              </a>
                            </div>
                          )}

                          {/* Date */}
                          <p className="text-xs text-[#707A8A]">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>

                        {/* Direction Indicator */}
                        <div className="flex flex-col items-end">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.direction === 'credit'
                                ? 'bg-[#0ECB81]/10 text-[#0ECB81]'
                                : 'bg-[#F6465D]/10 text-[#F6465D]'
                            }`}
                          >
                            {transaction.direction === 'credit' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 19V5" />
                                <path d="m5 12 7-7 7 7" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14" />
                                <path d="m19 12-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium mt-1 ${
                              transaction.direction === 'credit' ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                            }`}
                          >
                            {transaction.direction === 'credit' ? '+' : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {transactionsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EAECEF]">
                    <div className="text-sm text-[#707A8A]">
                      Page {transactionsPagination.currentPage} of {transactionsPagination.totalPages}
                      {' '}• {transactionsPagination.totalItems} total transactions
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadTransactionHistory(transactionsPagination.currentPage - 1)}
                        disabled={transactionsPagination.currentPage === 1 || isLoadingTransactions}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadTransactionHistory(transactionsPagination.currentPage + 1)}
                        disabled={transactionsPagination.currentPage === transactionsPagination.totalPages || isLoadingTransactions}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Wallet Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAECEF]">
          <h3 className="text-lg font-semibold text-[#1E2329] mb-3">Wallet Address</h3>
          <div className="bg-[#F8F9FA] rounded-lg p-3">
            <p className="text-sm font-mono text-[#707A8A] break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 