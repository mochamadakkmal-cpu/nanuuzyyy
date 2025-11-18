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

    const orders = await db.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Generate CSV content
    const csvHeaders = [
      'Order ID',
      'User Name',
      'User Email',
      'Package Name',
      'Platform',
      'Target Username',
      'Quantity',
      'Price',
      'Status',
      'Created At'
    ];

    const csvRows = orders.map(order => [
      `#${order.id.slice(-8)}`,
      `"${order.user.name || ''}"`,
      `"${order.user.email}"`,
      `"${order.packageName}"`,
      `"${order.platform}"`,
      `"@${order.targetUsername}"`,
      order.quantity.toString(),
      order.price.toString(),
      order.status,
      new Date(order.createdAt).toLocaleString('id-ID')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows
    ].join('\n');

    // Set response headers for CSV download
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to export orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}