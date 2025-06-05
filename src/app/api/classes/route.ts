import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取班级列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const name = searchParams.get('name') || '';

    const where = {
      name: {
        contains: name,
      },
    };

    const [total, items] = await Promise.all([
      prisma.class.count({ where }),
      prisma.class.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return NextResponse.json({
      items,
      total,
    });
  } catch (error) {
    console.error('获取班级列表失败:', error);
    return NextResponse.json(
      { error: '获取班级列表失败' },
      { status: 500 }
    );
  }
}

// 创建班级
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const class_ = await prisma.class.create({
      data: {
        name,
      },
    });

    return NextResponse.json(class_);
  } catch (error) {
    console.error('创建班级失败:', error);
    return NextResponse.json(
      { error: '创建班级失败' },
      { status: 500 }
    );
  }
} 