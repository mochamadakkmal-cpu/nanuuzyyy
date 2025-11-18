import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const services = await db.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      apiEndpoint
    } = await request.json();

    if (!name || !category || !minQuantity || !maxQuantity || !basePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        name,
        description: description || null,
        category,
        minQuantity,
        maxQuantity,
        basePrice,
        providerName: providerName || null,
        serviceId: serviceId || null,
        apiKey: apiKey || null,
        apiEndpoint: apiEndpoint || null,
      }
    });

    return NextResponse.json(
      { 
        message: 'Service created successfully',
        service
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}