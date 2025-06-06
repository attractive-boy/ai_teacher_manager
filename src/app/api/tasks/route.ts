import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取任务列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('current') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const title = searchParams.get('title') || '';

    // 构建查询条件
    const where = {
      ...(title && { title: { contains: title } }),
    };

    // 获取总数
    const total = await prisma.task.count({ where });

    // 获取分页数据
    const tasks = await prisma.task.findMany({
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
    const items = tasks.map((task: any) => ({
      ...task,
      className: task.class.name,
    }));

    return NextResponse.json({
      items,
      total,
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    return NextResponse.json(
      { error: '获取任务列表失败' },
      { status: 500 }
    );
  }
}

// 创建任务
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, classId } = body;

    // 验证必填字段
    if (!title || !content || !classId) {
      return NextResponse.json(
        { error: '任务名称、内容和班级不能为空' },
        { status: 400 }
      );
    }

    // 创建任务
    const task = await prisma.task.create({
      data: {
        title,
        content,
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
      ...task,
      className: task.class.name,
    });
  } catch (error) {
    console.error('创建任务失败:', error);
    return NextResponse.json(
      { error: '创建任务失败' },
      { status: 500 }
    );
  }
} 