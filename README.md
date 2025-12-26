# Indosat LMS - Learning Management System

A comprehensive Learning Management System built with React Native, Expo Router, and NativeWind for Indosat Ooredoo Hutchison Direct Sales Executives.

## Features

- 🎓 **Role-based Access**: Admin, Trainer, and DSE (Direct Sales Executive) roles
- 📚 **Course Management**: Browse, enroll, and complete courses with video modules
- 📝 **Interactive Quizzes**: Test your knowledge with timed quizzes
- 🏆 **Gamification**: Earn badges, track progress, and compete on leaderboards
- 📜 **Certificates**: Download certificates upon course completion
- 📊 **Analytics Dashboard**: Track learning metrics and performance
- 🎨 **Modern UI**: Built with NativeWind (TailwindCSS for React Native)

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 (TailwindCSS)
- **Icons**: Lucide React Native
- **State Management**: React Context API
- **Backend**: Supabase (optional)
- **API Integration**: YouTube Data API v3

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your API keys:
   ```env
   EXPO_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Or with cache clearing:
   ```bash
   npx expo start --clear
   ```

## Project Structure

```
lms/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with AppProvider
│   ├── index.tsx                # Landing page / redirect
│   ├── login.tsx                # Login page
│   ├── components/              # React components
│   │   ├── admin/              # Admin dashboard components
│   │   ├── trainer/            # Trainer dashboard components
│   │   ├── dse/                # DSE dashboard components
│   │   ├── shared/             # Shared components (Quiz, etc)
│   │   ├── debug/              # Debug tools (YouTube API, OAuth)
│   │   ├── Login.tsx
│   │   ├── Sidebar.tsx
│   │   └── LandingPage.tsx
│   ├── dashboard/              # Dashboard routes
│   │   ├── _layout.tsx         # Dashboard layout with sidebar
│   │   ├── index.tsx           # Dashboard home
│   │   ├── learning.tsx
│   │   ├── certificates.tsx
│   │   ├── leaderboard.tsx
│   │   └── badges.tsx
│   └── debug/                  # Debug routes
│       ├── yt-api.tsx
│       ├── yt-oauth.tsx
│       └── yt-upload.tsx
├── context/
│   └── AppContext.tsx          # Global state management
├── types/
│   └── index.ts                # TypeScript type definitions
├── lib/
│   └── supabase.ts             # Supabase client
├── services/
│   ├── youtubeApi.ts           # YouTube Data API wrapper
│   └── googleOAuth.ts          # Google OAuth helper (stub)
├── assets/                      # Images and static files
├── global.css                   # Global TailwindCSS styles
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler configuration
├── tailwind.config.js          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## User Roles & Demo Accounts

### Admin
- Email: `admin@indosat.com`
- Access: Full system management, user management, analytics

### Trainer
- Email: `ahmad@indosat.com`
- Access: Course creation, student management, assessments

### DSE (Direct Sales Executive)
- Email: `budi@indosat.com`
- Access: Course enrollment, learning, quizzes, certificates

## Features by Role

### Admin Dashboard
- User management
- Course oversight
- System analytics
- Activity monitoring

### Trainer Dashboard
- Course creation and management
- Student progress tracking
- Assessment management
- Content upload

### DSE Dashboard
- Browse and enroll in courses
- Watch video modules
- Take quizzes
- Earn badges and certificates
- View leaderboard
- Track personal progress

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_YOUTUBE_API_KEY` | YouTube Data API v3 key | Optional |
| `EXPO_PUBLIC_YOUTUBE_API_DEBUG` | Enable YouTube API debug logs | Optional |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Optional |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous key | Optional |

## Troubleshooting

### Metro bundler cache issues
```bash
npx expo start --clear
```

### Remove all caches
```bash
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Fix package versions
```bash
npx expo install --fix
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@indosat.com or open an issue in the repository.
