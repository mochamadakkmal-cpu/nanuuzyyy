import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { emailNotifications, whatsappNotifications } = await request.json();

    // In a real application, you would save these settings to database
    // For now, we'll just return success
    
    console.log('Notification settings updated:', {
      emailNotifications,
      whatsappNotifications,
      updatedBy: session.user.email,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Notification settings updated successfully',
        settings: {
          emailNotifications,
          whatsappNotifications
        }
      }
    );
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}