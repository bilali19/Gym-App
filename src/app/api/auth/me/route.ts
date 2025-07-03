// import { NextRequest, NextResponse } from 'next/server'
// import { userModel } from '@/lib/models'
// import jwt from 'jsonwebtoken'

// export async function GET(request: NextRequest) {
//   try {
//     const token = request.cookies.get('auth-token')?.value

//     if (!token) {
//       return NextResponse.json(
//         { error: 'No token provided' },
//         { status: 401 }
//       )
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
//     const user = await userModel.findById(decoded.userId)

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         createdAt: user.created_at
//       }
//     })

//   } catch (error) {
//     console.error('Auth verification error:', error)
//     return NextResponse.json(
//       { error: 'Invalid token' },
//       { status: 401 }
//     )
//   }
// }

// Temporarily add this to src/app/api/auth/me/route.ts for debugging

// Updated src/app/api/auth/me/route.ts with proper error handling

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { userModel } from '@/lib/models'
import jwt from 'jsonwebtoken'
import { getErrorMessage, logError } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Environment check:');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const token = request.cookies.get('auth-token')?.value
    console.log('🔍 Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    console.log('🔍 Verifying JWT...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }
    console.log('🔍 JWT decoded successfully, userId:', decoded.userId);
    
    console.log('🔍 Looking up user in database...');
    const user = await userModel.findById(decoded.userId)
    console.log('🔍 User found:', !!user);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    })

  } catch (error) {
    logError(error, 'Auth verification');
    
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}