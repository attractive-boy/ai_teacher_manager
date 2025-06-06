import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取单个班级
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const class_ = await prisma.class.findUnique({
      where: {
        id: parseInt((await params).id),
      },
    });

    if (!class_) {
      return NextResponse.json(
        { error: '班级不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(class_);
  } catch (error) {
    console.error('获取班级失败:', error);
    return NextResponse.json(
      { error: '获取班级失败' },
      { status: 500 }
    );
  }
}

// 更新班级
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const body = await request.json();
    const { name } = body;

    const class_ = await prisma.class.update({
      where: {
        id: parseInt((await params).id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(class_);
  } catch (error) {
    console.error('更新班级失败:', error);
    return NextResponse.json(
      { error: '更新班级失败' },
      { status: 500 }
    );
  }
}

// 删除班级
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除班级失败:', error);
    return NextResponse.json(
      { error: '删除班级失败' },
      { status: 500 }
    );
  }
} 