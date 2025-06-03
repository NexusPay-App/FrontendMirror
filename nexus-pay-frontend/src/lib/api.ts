const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: { phoneNumber: string };
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  data?: {
    token: string;
    walletAddress: string;
    phoneNumber: string;
  };
}

export interface RegisterRequest {
  phoneNumber: string;
  email: string;
  password: string;
  verifyWith: 'phone' | 'email';
}

export interface USDCBalance {
  balanceInUSDC: string;
  balanceInKES: string;
  rate: number;
}

export interface PayWithCryptoRequest {
  amount: number;
  cryptoAmount: number;
  targetType: 'paybill' | 'till';
  targetNumber: string;
  accountNumber?: string;
  chain: 'arbitrum';
  tokenType: 'USDC';
  description?: string;
}

export interface PayWithCryptoResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    cryptoTransactionHash: string;
    mpesaTransactionId: string;
    status: string;
    instructions: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    transactionId: string;
    instructions: string;
  };
}

export interface BuyCryptoRequest {
  cryptoAmount: number;
  phone: string;
  chain: string;
  tokenType: string;
}

export interface BuyCryptoResponse {
  success: boolean;
  message?: string;
  data?: {
    transactionId?: string;
    instructions?: string;
  };
}

export interface Transaction {
  id: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  tokenAmount?: number;
  tokenSymbol?: string;
  amountInKES?: number;
  amountInUSD?: number;
  chain?: string;
  txHash?: string;
  blockExplorerUrl?: string;
  direction: 'credit' | 'debit'; // + or -
  description?: string;
  createdAt: string;
  updatedAt: string;
  targetType?: 'paybill' | 'till';
  targetNumber?: string;
  accountNumber?: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
  message?: string;
}

export interface TransactionDetailResponse {
  success: boolean;
  data?: Transaction;
  message?: string;
}

// API Class
class NexusPayAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Authentication
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const result = await this.handleResponse<VerifyOTPResponse>(response);
    
    // Store token if successful
    if (result.success && result.data?.token) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('walletAddress', result.data.walletAddress);
      localStorage.setItem('phoneNumber', result.data.phoneNumber);
    }
    
    return result;
  }

  async register(request: RegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('phoneNumber');
    
    return this.handleResponse(response);
  }

  // Crypto & Token Operations
  async getUSDCBalance(chain: string, address: string): Promise<USDCBalance> {
    const response = await fetch(`${API_BASE_URL}/usdc/usdc-balance/${chain}/${address}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<USDCBalance>(response);
  }

  async sendToken(request: {
    recipientIdentifier: string;
    amount: string;
    senderAddress: string;
    chain: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/tokens/sendToken`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async getWalletInfo() {
    const response = await fetch(`${API_BASE_URL}/tokens/wallet`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // M-Pesa Operations
  async payWithCrypto(request: PayWithCryptoRequest): Promise<PayWithCryptoResponse> {
    const response = await fetch(`${API_BASE_URL}/mpesa/pay-with-crypto`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse<PayWithCryptoResponse>(response);
  }

  async buyCrypto(request: BuyCryptoRequest): Promise<BuyCryptoResponse> {
    const response = await fetch(`${API_BASE_URL}/mpesa/buy-crypto`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse<BuyCryptoResponse>(response);
  }

  async payPaybill(request: {
    amount: number;
    phone: string;
    paybillNumber: string;
    accountNumber: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/mpesa/pay-paybill`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async payTill(request: {
    amount: number;
    phone: string;
    tillNumber: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/mpesa/pay-till`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async deposit(request: {
    amount: number;
    phone: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/mpesa/deposit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async withdraw(request: {
    amount: number;
    phone: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/mpesa/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async getTransactionStatus(transactionId: string) {
    const response = await fetch(`${API_BASE_URL}/mpesa/transaction-status/${transactionId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Transaction History
  async getTransactionHistory(page: number = 1, limit: number = 10): Promise<TransactionHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/transactions?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TransactionHistoryResponse>(response);
  }

  async getTransactionById(transactionId: string): Promise<TransactionDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TransactionDetailResponse>(response);
  }

  // User Management
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(request: { email?: string }) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getStoredWalletAddress(): string | null {
    return localStorage.getItem('walletAddress');
  }

  getStoredPhoneNumber(): string | null {
    return localStorage.getItem('phoneNumber');
  }
}

// Export singleton instance
export const api = new NexusPayAPI();
export default api; 