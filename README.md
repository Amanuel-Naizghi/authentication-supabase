
# Supabase Authentication – Expo App

A React Native mobile application built with Expo, TypeScript, and Supabase for user authentication and protected data access.

## Technologies Used

- React Native / Expo
- TypeScript
- Supabase Authentication & Database
- React Navigation
- React Hook Form & Zod
- React Context API

## Features

- User sign-up, sign-in, and sign-out
- Form validation using React Hook Form and Zod
- Authentication state management with Context API
- Protected navigation for authenticated users
- Persistent sessions using Expo SQLite
- Public data displayed on the Sign-Up screen
- RLS-protected data displayed on the Home screen
- Loading indicators and authentication error handling

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd authentication-supabase
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_publishable_key
```

### 4. Run the Application

```bash
npx expo start
```

Use Expo Go or an emulator to run the application.

## Supabase Configuration

1. Create a Supabase project and enable Email Authentication.
2. Create a `colors` table containing publicly readable data.
3. Create a `demo` table with `id`, `name`, and `age` columns.
4. Enable Row Level Security (RLS) on both tables.
5. Configure SELECT policies:
   - `colors`: Public read access (`anon`, `authenticated`).
   - `demo`: Authenticated users only.

## Security

- Supabase configuration uses environment variables.
- `.env.local` is excluded from Git using `.gitignore`.
- User sessions are persisted using Expo SQLite.
- Protected database records are secured with RLS policies.

## Testing

- Sign-up and sign-in
- Sign-out functionality
- Form validation and error messages
- Session persistence after restarting the app
- Protected navigation and RLS data access

## Team Collaboration

Developed by 
- Amanuel Tesfatsion
- Pin Hung Chiang
- Rahul Thakur