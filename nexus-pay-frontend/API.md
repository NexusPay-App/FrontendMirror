# 🚀 **NexusPay API Documentation**

**Base URL:** `http://localhost:8000/api`

---

## 🔐 **AUTHENTICATION ENDPOINTS**

### **1. Login (Phone + Password)**
```http
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "+254759280875",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Please verify your login with the code sent to your phone number.",
  "data": {"phoneNumber": "+254759280875"}
}
```

### **2. Verify Login OTP**
```http
POST /api/auth/login/verify
Content-Type: application/json

{
  "phoneNumber": "+254759280875",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "walletAddress": "0x31c41BCa835C0d3c597cbBaFf2e8dBF973645fb4",
    "phoneNumber": "+254759280875"
  }
}
```

### **3. Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "phoneNumber": "+254759280875",
  "email": "user@example.com",
  "password": "SecurePass123",
  "verifyWith": "phone"
}
```

### **4. Logout**
```http
POST /api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💰 **CRYPTO & TOKEN ENDPOINTS**

### **5. Get USDC Balance**
```http
GET /api/usdc/usdc-balance/{chain}/{address}
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```http
GET /api/usdc/usdc-balance/arbitrum/0x31c41BCa835C0d3c597cbBaFf2e8dBF973645fb4
```

**Response:**
```json
{
  "balanceInUSDC": "14.3",
  "balanceInKES": "1847.89",
  "rate": 129.22
}
```

### **6. Send Tokens**
```http
POST /api/tokens/sendToken
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "recipientIdentifier": "+254712345678",
  "amount": "10.5",
  "senderAddress": "0x31c41BCa835C0d3c597cbBaFf2e8dBF973645fb4",
  "chain": "arbitrum"
}
```

### **7. Get Wallet Info**
```http
GET /api/tokens/wallet
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📱 **M-PESA ENDPOINTS**

### **8. Buy Crypto with M-Pesa**
```http
POST /api/mpesa/buy-crypto
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "cryptoAmount": 1.0,
  "phone": "+254759280875",
  "chain": "arbitrum",
  "tokenType": "USDC"
}
```

### **9. Pay with Crypto (Main Feature)**
```http
POST /api/mpesa/pay-with-crypto
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 50,
  "cryptoAmount": 0.5,
  "targetType": "paybill",
  "targetNumber": "888880",
  "accountNumber": "92104099558",
  "chain": "arbitrum",
  "tokenType": "USDC",
  "description": "Electricity bill payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crypto payment completed successfully",
  "data": {
    "transactionId": "uuid-here",
    "cryptoTransactionHash": "0x123...",
    "mpesaTransactionId": "AG_20250603_xxx",
    "status": "completed",
    "instructions": "✅ 50 KES sent to your phone. Use this money to pay paybill 888880"
  }
}
```

### **10. Pay Paybill (Direct)**
```http
POST /api/mpesa/pay-paybill
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 100,
  "phone": "+254759280875",
  "paybillNumber": "888880",
  "accountNumber": "92104099558"
}
```

### **11. Pay Till (Direct)**
```http
POST /api/mpesa/pay-till
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 50,
  "phone": "+254759280875",
  "tillNumber": "123456"
}
```

### **12. M-Pesa Deposit**
```http
POST /api/mpesa/deposit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 100,
  "phone": "+254759280875"
}
```

### **13. M-Pesa Withdraw**
```http
POST /api/mpesa/withdraw
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 50,
  "phone": "+254759280875"
}
```

### **14. Get Transaction Status**
```http
GET /api/mpesa/transaction-status/{transactionId}
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👤 **USER MANAGEMENT**

### **15. Get User Profile**
```http
GET /api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### **16. Update Profile**
```http
PUT /api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

---

## 🔧 **ADMIN ENDPOINTS**

### **17. Get Platform Wallet Status**
```http
GET /api/admin/wallets/status
Authorization: Bearer YOUR_JWT_TOKEN
```

### **18. Withdraw Fees to Main Wallet**
```http
POST /api/admin/wallets/withdraw-fees
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 1000
}
```

### **19. Get Transactions Requiring Intervention**
```http
GET /api/admin/transactions/intervention
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 **WEBHOOK ENDPOINTS** (For M-Pesa Callbacks)

### **20. STK Push Callback**
```http
POST /api/mpesa/stk-callback
Content-Type: application/json
```

### **21. B2C Callback**
```http
POST /api/mpesa/b2c-callback
Content-Type: application/json
```

### **22. Queue Timeout**
```http
POST /api/mpesa/queue-timeout
Content-Type: application/json
```

---

## 🚀 **INTEGRATION GUIDE**

### **Step 1: Authentication Flow**
```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+254759280875',
    password: 'your_password'
  })
});

// 2. Verify OTP (get from SMS or server logs)
const verifyResponse = await fetch('http://localhost:8000/api/auth/login/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+254759280875',
    otp: '123456'
  })
});

const { data } = await verifyResponse.json();
const authToken = data.token;
```

### **Step 2: Check Balances**
```javascript
const balanceResponse = await fetch(
  'http://localhost:8000/api/usdc/usdc-balance/arbitrum/0xYourAddress',
  {
    headers: { 'Authorization': `Bearer ${authToken}` }
  }
);
```

### **Step 3: Pay with Crypto**
```javascript
const paymentResponse = await fetch('http://localhost:8000/api/mpesa/pay-with-crypto', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify({
    amount: 50,                    // KES amount
    cryptoAmount: 0.5,             // USDC amount
    targetType: 'paybill',         // or 'till'
    targetNumber: '888880',        // paybill/till number
    accountNumber: '92104099558',  // for paybills only
    chain: 'arbitrum',            // blockchain
    tokenType: 'USDC',            // token type
    description: 'Bill payment'   // optional
  })
});
```

### **Step 4: Error Handling**
```javascript
const response = await fetch(endpoint, options);
const result = await response.json();

if (!result.success) {
  console.error('Error:', result.error);
  // Handle specific error codes
  if (result.error?.code === 'INSUFFICIENT_BALANCE') {
    // Show balance insufficient message
  }
}
```

---

## 📋 **Common Error Codes**

| Code | Description | Solution |
|------|-------------|----------|
| `AUTH_REQUIRED` | Missing/invalid token | Login again |
| `INSUFFICIENT_BALANCE` | Not enough crypto | Buy more crypto |
| `INVALID_AMOUNT` | Amount validation failed | Check amount format |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `SYSTEM_OVERLOAD` | Server overloaded | Retry in 30-60 seconds |

---

## 🔗 **Postman Collection**

Import this JSON to get started quickly:

```json
{
  "info": { "name": "NexusPay API", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:8000/api" },
    { "key": "authToken", "value": "" }
  ],
  "item": [
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"+254759280875\",\n  \"password\": \"your_password\"\n}"
        }
      }
    },
    {
      "name": "Auth - Verify OTP",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login/verify",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"+254759280875\",\n  \"otp\": \"123456\"\n}"
        }
      }
    },
    {
      "name": "Get USDC Balance",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/usdc/usdc-balance/arbitrum/0x31c41BCa835C0d3c597cbBaFf2e8dBF973645fb4",
        "header": [{"key": "Authorization", "value": "Bearer {{authToken}}"}]
      }
    },
    {
      "name": "Pay with Crypto",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/mpesa/pay-with-crypto",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{authToken}}"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": 50,\n  \"cryptoAmount\": 0.5,\n  \"targetType\": \"paybill\",\n  \"targetNumber\": \"888880\",\n  \"accountNumber\": \"92104099558\",\n  \"chain\": \"arbitrum\",\n  \"tokenType\": \"USDC\",\n  \"description\": \"Bill payment\"\n}"
        }
      }
    }
  ]
}
```

---

## 🔧 **Environment Setup**

### **Required Environment Variables**
```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Thirdweb (Blockchain)
THIRDWEB_SECRET_KEY=your_thirdweb_secret

# M-Pesa Configuration
MPESA_DEV_CONSUMER_KEY=your_consumer_key
MPESA_DEV_CONSUMER_SECRET=your_consumer_secret
MPESA_DEV_SHORTCODE=your_shortcode
MPESA_DEV_PASSKEY=your_passkey
MPESA_DEV_SECURITY_CREDENTIAL=your_encrypted_security_credential
MPESA_DEV_INITIATOR_NAME=your_initiator_name

# Webhook URLs (for M-Pesa callbacks)
WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok-free.app
MPESA_STK_CALLBACK_URL=${WEBHOOK_BASE_URL}/api/mpesa/stk-callback
MPESA_B2C_CALLBACK_URL=${WEBHOOK_BASE_URL}/api/mpesa/b2c-callback
MPESA_QUEUE_TIMEOUT_URL=${WEBHOOK_BASE_URL}/api/mpesa/queue-timeout

# SMS Service
AFRICAS_TALKING_API_KEY=your_africas_talking_api_key
```

---

## 📱 **Mobile App Integration Examples**

### **React Native Example**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class NexusPayAPI {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
  }

  async login(phoneNumber, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password })
    });
    return response.json();
  }

  async verifyOTP(phoneNumber, otp) {
    const response = await fetch(`${this.baseURL}/auth/login/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    });
    const result = await response.json();
    if (result.success) {
      await AsyncStorage.setItem('authToken', result.data.token);
    }
    return result;
  }

  async payWithCrypto(paymentData) {
    const token = await AsyncStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/mpesa/pay-with-crypto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  }
}

// Usage
const api = new NexusPayAPI();
```

### **Flutter/Dart Example**
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class NexusPayAPI {
  static const String baseURL = 'http://localhost:8000/api';
  
  static Future<Map<String, dynamic>> login(String phoneNumber, String password) async {
    final response = await http.post(
      Uri.parse('$baseURL/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'phoneNumber': phoneNumber,
        'password': password,
      }),
    );
    return jsonDecode(response.body);
  }
  
  static Future<Map<String, dynamic>> payWithCrypto(Map<String, dynamic> paymentData, String token) async {
    final response = await http.post(
      Uri.parse('$baseURL/mpesa/pay-with-crypto'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(paymentData),
    );
    return jsonDecode(response.body);
  }
}
```

---

## 🚨 **Security Best Practices**

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (iOS Keychain, Android Keystore)
3. **Implement token refresh mechanism**
4. **Validate all inputs on client side**
5. **Handle errors gracefully**
6. **Never log sensitive data**
7. **Use rate limiting on client side**

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**

1. **"Invalid SecurityCredential" (Error 2001)**
   - Check M-Pesa initiator name configuration
   - Verify security credential is correctly generated

2. **"Insufficient Balance"**
   - Check crypto balance on correct chain
   - Ensure user has enough tokens

3. **"Rate Limit Exceeded"**
   - Implement exponential backoff
   - Reduce request frequency

4. **Token Expired**
   - Implement automatic re-login
   - Store refresh tokens securely

### **Debug Mode:**
Add `?debug=true` to any endpoint for detailed logging (development only).

---

**Last Updated:** June 3, 2025  
**Version:** 1.0.0  
**Server:** NexusPay Backend v1.0 