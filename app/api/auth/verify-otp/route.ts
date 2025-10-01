import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Try to forward to backend server if it's running
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return NextResponse.json({ success: true, ...data });
      } else {
        return NextResponse.json(
          { success: false, error: data.error || 'OTP verification failed' },
          { status: response.status }
        );
      }
    } catch (backendError) {
      // Backend server is not running, return a helpful error
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Backend server is not running. Please start the backend server with: npm run dev:server' 
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
