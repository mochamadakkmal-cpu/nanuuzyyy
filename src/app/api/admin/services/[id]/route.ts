import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      name,
      description,
      category,
      minQuantity,
      maxQuantity,
      basePrice,
      providerName,
      serviceId,
      apiKey,
      apiEndpoint,
      isActive
    } = await request.json();

    const service = await db.service.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(minQuantity && { minQuantity }),
        ...(maxQuantity && { maxQuantity }),
        ...(basePrice && { basePrice }),
        ...(providerName !== undefined && { providerName }),
        ...(serviceId !== undefined && { serviceId }),
        ...(apiKey !== undefined && { apiKey }),
        ...(apiEndpoint !== undefined && { apiEndpoint }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json(
      { 
        message: 'Service updated successfully',
        service
      }
    );
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.service.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Service deleted successfully' }
    );
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}