import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tasks } = body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: '无效的任务数据' },
        { status: 400 }
      );
    }

    // 使用事务来确保所有任务都成功创建
    const result = await prisma.$transaction(async (tx) => {
      const createdTasks = [];

      for (const task of tasks) {
        const { title, content, className } = task;

        // 验证必填字段
        if (!title || !content || !className) {
          throw new Error('任务名称、内容和班级名称不能为空');
        }

        // 查找班级
        const classRecord = await tx.class.findFirst({
          where: { name: className },
        });

        if (!classRecord) {
          throw new Error(`班级 "${className}" 不存在`);
        }

        // 创建任务
        const createdTask = await tx.task.create({
          data: {
            title,
            content,
            classId: classRecord.id,
          },
          include: {
            class: {
              select: {
                name: true,
              },
            },
          },
        });

        createdTasks.push({
          ...createdTask,
          className: createdTask.class.name,
        });
      }

      return createdTasks;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('批量创建任务失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '批量创建任务失败' },
      { status: 500 }
    );
  }
} 