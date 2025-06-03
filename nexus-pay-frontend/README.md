# 🚀 NexusPay Frontend MVP

A minimalistic and appealing frontend for NexusPay - a crypto-to-M-Pesa payment platform that allows users to pay bills using USDC tokens.

## ✨ Features

### 🔐 **Authentication**
- Phone number + password login
- SMS OTP verification
- User registration with email + phone
- Automatic authentication state management
- Secure token storage

### 💰 **Crypto Payments**
- Real-time USDC balance display
- Convert USDC to KES at live rates
- Pay M-Pesa paybills and till numbers
- Transaction status tracking
- Automatic balance refresh

### 📱 **User Experience**
- Clean, minimalistic design
- Mobile-first responsive layout
- Smooth animations and transitions
- Loading states and error handling
- PWA capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + localStorage
- **API Integration**: RESTful API calls
- **PWA**: next-pwa for offline capabilities

## 🏗 Project Structure

```
nexus-pay-frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx          # Phone + password login
│   │   │   ├── signup/page.tsx         # User registration
│   │   │   └── verify/page.tsx         # OTP verification
│   │   ├── dashboard/page.tsx          # Main dashboard
│   │   ├── globals.css                 # Global styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Splash screen
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx              # Reusable button component
│   │       └── Input.tsx               # Reusable input component
│   ├── constants/
│   │   └── colors.ts                   # NexusPay color palette
│   └── lib/
│       └── api.ts                      # API service layer
├── public/
│   ├── assets/                         # App icons and images
│   └── manifest.json                   # PWA manifest
└── API.md                             # Backend API documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NexusPay backend running on `http://localhost:8000`

### Installation

1. **Clone and install dependencies**:
```bash
cd nexus-pay-frontend
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Visit `http://localhost:3000`

## 🔌 API Integration

The app integrates with the NexusPay backend API documented in `API.md`. Key endpoints used:

### Authentication Flow
```typescript
// 1. Login (triggers OTP)
POST /api/auth/login
{
  "phoneNumber": "+254712345678",
  "password": "your_password"
}

// 2. Verify OTP
POST /api/auth/login/verify
{
  "phoneNumber": "+254712345678", 
  "otp": "123456"
}
```

### Balance & Payments
```typescript
// Get USDC balance
GET /api/usdc/usdc-balance/arbitrum/{walletAddress}

// Pay with crypto
POST /api/mpesa/pay-with-crypto
{
  "amount": 100,           // KES amount
  "cryptoAmount": 0.77,    // USDC amount
  "targetType": "paybill", // or "till"
  "targetNumber": "888880",
  "accountNumber": "12345", // for paybills only
  "chain": "arbitrum",
  "tokenType": "USDC"
}
```

## 📱 User Journey

### 1. **Splash Screen**
- Auto-advancing feature slides
- Get Started / Login options
- Auto-redirects authenticated users

### 2. **Authentication**
- **Login**: Phone + password → OTP verification
- **Signup**: Phone + email + password → OTP verification
- **Verification**: 6-digit SMS code with timer and resend

### 3. **Dashboard**
- **Balance Display**: USDC amount + KES equivalent + exchange rate
- **Pay with Crypto**: 
  - Choose Paybill or Till Number
  - Enter amount, target number, account (for paybills)
  - Real-time balance validation
  - Success instructions displayed
- **Wallet Info**: Full wallet address display
- **Logout**: Clear session and return to splash

## 🎨 Design System

### Colors
```css
Primary Yellow:    #F0B90B (buttons, accents)
Dark Gray:         #1E2329 (text, headers)
Light Gray:        #707A8A (secondary text)
Background:        #F8F9FA (app background)
Success Green:     #0ECB81 (success states)
Error Red:         #F6465D (error states)
Border Gray:       #EAECEF (borders, dividers)
```

### Components
- **Buttons**: Primary, secondary, outline variants
- **Inputs**: Icon support, error states, helper text
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Loading**: Spinners and skeleton states

## 🔧 Configuration

### API Base URL
Update in `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### PWA Settings
Configured in `next.config.mjs` and `public/manifest.json`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Splash screen auto-navigation
- [ ] Login with valid phone + password
- [ ] OTP verification (check server logs for OTP)
- [ ] Dashboard balance loading
- [ ] Pay with crypto form validation
- [ ] Successful payment flow
- [ ] Error handling (invalid inputs, network errors)
- [ ] Logout functionality
- [ ] Responsive design on mobile

### Test Credentials
Use any valid Kenyan phone number (+254...) and password. Check your backend logs for the OTP code.

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
For production, update:
- API base URL to your deployed backend
- PWA settings for your domain

## 🔮 Future Enhancements

### Short Term
- [ ] Transaction history page
- [ ] Buy crypto with M-Pesa
- [ ] Send crypto to other users
- [ ] Profile management

### Long Term
- [ ] Multi-chain support (Polygon, BSC)
- [ ] Multiple token types (USDT, BUSD)
- [ ] Savings features
- [ ] Bill payment automation
- [ ] Android/iOS native apps

## 📞 Support

### Common Issues

1. **"Failed to load balance"**
   - Ensure backend is running on port 8000
   - Check network connectivity
   - Verify authentication token

2. **"OTP verification failed"**  
   - Check backend logs for the actual OTP
   - Ensure phone number format is correct (+254...)

3. **"Payment failed"**
   - Verify sufficient USDC balance
   - Check if backend has valid M-Pesa configuration
   - Ensure target paybill/till number is valid

### Debug Mode
The backend API supports debug mode by adding `?debug=true` to requests for detailed logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the NexusPay ecosystem**
