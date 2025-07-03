import { NextRequest, NextResponse } from 'next/server'
import { userModel } from '@/lib/models'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('🔍 Login attempt for:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Looking for user in database...')
    const user = await userModel.findByEmailWithPassword(email)
    
    console.log('🔍 User found:', !!user)
    if (user) {
      console.log('🔍 User ID:', user.id)
      console.log('🔍 User name:', user.name)
      console.log('🔍 Password hash length:', user.password_hash.length)
      console.log('🔍 Password hash starts with:', user.password_hash.substring(0, 15))
      console.log('🔍 Input password:', password)
      console.log('🔍 Input password length:', password.length)
    }
    
    if (!user) {
      console.log('❌ User not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('🔍 Verifying password...')
    const isPasswordValid = await userModel.verifyPassword(password, user.password_hash)
    console.log('🔍 Password verification result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('❌ Password verification failed')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('✅ Password verified, creating JWT...')
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    console.log('✅ Login successful for:', email)
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}