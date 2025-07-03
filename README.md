# 💪 FitForce - Intelligent Workout Generator

A modern, full-stack fitness application that generates personalized workout routines and tracks your progress with real-time data persistence.

![FitForce Demo](https://img.shields.io/badge/Status-Production-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green)

## 🌟 Features

### 🎯 Smart Workout Generation
- **Intelligent Algorithm**: Generates personalized workouts based on your goals, target muscles, and training style
- **Multiple Training Styles**: Individual muscle targeting, bro splits, bodybuilder splits, upper/lower splits
- **Goal-Oriented**: Strength & power, growth & hypertrophy, or cardiovascular endurance
- **Scientific Rep Ranges**: Automatically calculates optimal reps, sets, and rest periods

### 📊 Complete Progress Tracking
- **Real-Time Set Tracking**: Log weights, reps, and completion status for every set
- **Workout History**: View all past workouts with detailed statistics
- **Progress Analytics**: Track total workouts, sets completed, average workout time, and most targeted muscles
- **Exercise Notes**: Add personal notes about form, weight progression, and how exercises felt

### 🔐 Secure User Management
- **JWT Authentication**: Secure login/logout with HTTP-only cookies
- **Bcrypt Password Hashing**: Industry-standard password security
- **Persistent Sessions**: Stay logged in across browser sessions
- **User Profiles**: Personal dashboards with workout statistics

### 🎥 Exercise Guidance
- **Video Demonstrations**: Integrated YouTube videos for proper form
- **Detailed Descriptions**: Step-by-step exercise instructions
- **Muscle Group Targeting**: Visual muscle group identification
- **Exercise Substitutions**: Alternative exercises for variety

## 🚀 Live Demo

**Production App**: [https://gym-app-pi-nine.vercel.app](https://gym-app-pi-nine.vercel.app)

### Test Credentials
- **Email**: `john@example.com`
- **Password**: `password123`

Or create your own account to start tracking your fitness journey!

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **React Context** - State management for auth and workout tracking

### Backend
- **Next.js API Routes** - Serverless backend functions
- **PostgreSQL** - Robust relational database
- **Supabase** - Database hosting and management
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Frontend and API hosting
- **Supabase** - Database hosting
- **GitHub** - Version control and CI/CD

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### 1. Clone the Repository
```bash
git clone https://github.com/bilali19/Gym-App.git
cd Gym-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-here

# Environment
NODE_ENV=development
```

### 4. Database Setup
Run the database schema in your PostgreSQL database:
```bash
# Option 1: Use the provided schema.sql file
psql -h your-host -U your-user -d your-database -f schema.sql

# Option 2: Copy and paste schema.sql content into your database admin panel
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

## 🏗️ Project Structure

```
fitforce/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── workouts/      # Workout CRUD operations
│   │   │   └── stats/         # User statistics
│   │   ├── dashboard/         # User dashboard page
│   │   ├── generate/          # Workout generator page
│   │   ├── history/           # Workout history page
│   │   ├── workout/           # Active workout page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── AuthModal.tsx      # Login/signup modal
│   │   ├── ExerciseCard.tsx   # Individual exercise display
│   │   ├── Generator.tsx      # Workout generation form
│   │   ├── Navbar.tsx         # Navigation component
│   │   └── UserProfile.tsx    # User profile modal
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── WorkoutTrackingContext.tsx # Workout state
│   ├── lib/                   # Utility libraries
│   │   ├── database.ts        # Database connection
│   │   ├── models.ts          # Database models and queries
│   │   └── error-handler.ts   # Error handling utilities
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
│       ├── functions.ts       # Workout generation logic
│       └── soldier.ts         # Exercise database and schemes
├── public/                    # Static assets
├── schema.sql                 # Database schema
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies and scripts
```

## 🎯 How It Works

### Workout Generation Algorithm
1. **User Input**: Select training style (individual, bro split, etc.), target muscles, and fitness goal
2. **Exercise Selection**: Algorithm filters 100+ exercises based on muscle groups and equipment
3. **Set/Rep Calculation**: Scientifically-backed rep ranges and rest periods based on training goal
4. **Workout Assembly**: Creates balanced routine with compound and accessory movements

### Progress Tracking System
1. **Session Creation**: When starting a workout, creates database record with exercises and sets
2. **Real-Time Updates**: Each set completion updates the database immediately
3. **Statistics Calculation**: Aggregates data for progress metrics and analytics
4. **History Storage**: All workout data persists for long-term progress tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Workouts
- `POST /api/workouts` - Create new workout session
- `GET /api/workouts` - Get user's workout history
- `GET /api/workouts/[id]` - Get specific workout with exercises
- `PATCH /api/workouts/[id]` - Update workout (complete, add notes)
- `DELETE /api/workouts/[id]` - Delete workout session

### Exercise Tracking
- `PATCH /api/workouts/[id]/sets/[setId]` - Update individual set data
- `PATCH /api/workouts/[id]/exercises/[exerciseId]/notes` - Add exercise notes

### Statistics
- `GET /api/stats` - Get user workout statistics

## 🚀 Deployment

### Vercel Deployment
1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: Import your project in the Vercel dashboard
3. **Environment Variables**: Add your environment variables in Vercel settings:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. **Deploy**: Vercel automatically builds and deploys on every push

### Database Setup (Supabase)
1. **Create Project**: Sign up at [supabase.com](https://supabase.com)
2. **Run Schema**: Copy `schema.sql` content into SQL Editor
3. **Get Connection String**: Copy from Settings → Database
4. **Update Environment Variables**: Use the connection string in your env vars

## 🏋️‍♂️ Usage Guide

### For Users
1. **Sign Up**: Create an account with email and password
2. **Generate Workout**: Choose your training style, target muscles, and goal
3. **Start Training**: Begin your workout and track each set with weights and reps
4. **Add Notes**: Record thoughts about form, difficulty, or progress
5. **Complete Workout**: Finish and review your session statistics
6. **Track Progress**: View your workout history and progress analytics

### For Developers
1. **Fork the Repository**: Create your own copy
2. **Add New Exercises**: Update `utils/soldier.ts` with new exercise data
3. **Modify Algorithms**: Adjust workout generation logic in `utils/functions.ts`
4. **Extend Tracking**: Add new metrics or features to the tracking system
5. **Contribute**: Submit pull requests with improvements

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Add new features or fix bugs
4. **Test thoroughly**: Ensure everything works correctly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes and submit for review

### Development Guidelines
- Follow TypeScript best practices
- Use proper error handling with the error helper utilities
- Add `export const dynamic = 'force-dynamic'` to API routes that use cookies
- Test authentication flows thoroughly
- Ensure responsive design on all screen sizes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Exercise Database**: Special thanks to [James McArthur](https://github.com/jamezmca) for the comprehensive exercise database from [swoley-fit](https://github.com/jamezmca/swoley-fit/blob/main/src/utils/swoldier.js)
- **YouTube Integration**: Exercise demonstration videos for proper form
- **Next.js Team**: Amazing React framework with excellent developer experience
- **Supabase**: Fantastic PostgreSQL hosting and database management
- **Vercel**: Seamless deployment and hosting platform
- **Tailwind CSS**: Beautiful, utility-first CSS framework

## 📞 Support

Having issues? Here are some resources:

- **Documentation**: Check this README and code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Community**: Join discussions in GitHub Discussions
- **Email**: Contact the maintainer at [bilalibrahim623@gmail.com](mailto:bilalibrahim623@gmail.com)

---

**Built with ❤️ for the fitness community**

*Start your fitness journey today with FitForce - where technology meets gains!* 💪