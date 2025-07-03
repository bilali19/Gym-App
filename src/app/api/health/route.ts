import { NextResponse } from 'next/server'
import { getErrorMessage, logError } from '@/lib/error-handler'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      }
    })
  } catch (error) {
    logError(error, 'Health check');
    
    return NextResponse.json({
      status: 'error',
      error: getErrorMessage(error)
    }, { status: 500 })
  }
}