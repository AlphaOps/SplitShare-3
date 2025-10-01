import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Try to forward to backend server if it's running
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return NextResponse.json({ success: true, ...data });
      } else {
        return NextResponse.json(
          { success: false, error: data.error || 'Invalid email or password' },
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
