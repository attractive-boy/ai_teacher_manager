import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// 获取学生列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('current') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const name = searchParams.get('name') || '';
    const category = searchParams.get('category') || '';

    // 构建查询条件
    const where = {
      ...(name && { name: { contains: name } }),
      ...(category && { category }),
    };

    // 获取总数
    const total = await prisma.student.count({ where });

    // 获取分页数据
    const students = await prisma.student.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 格式化数据
    const items = students.map((student: any) => ({
      ...student,
      className: student.class.name,
    }));

    return NextResponse.json({
      items,
      total,
    });
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return NextResponse.json(
      { error: '获取学生列表失败' },
      { status: 500 }
    );
  }
}

// 创建学生
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, classId } = body;

    // 验证必填字段
    if (!name || !classId) {
      return NextResponse.json(
        { error: '姓名和班级不能为空' },
        { status: 400 }
      );
    }

    // 创建学生
    const student = await prisma.student.create({
      data: {
        name,
        category,
        classId,
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...student,
      className: student.class.name,
    });
  } catch (error) {
    console.error('创建学生失败:', error);
    return NextResponse.json(
      { error: '创建学生失败' },
      { status: 500 }
    );
  }
} 