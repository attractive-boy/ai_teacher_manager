import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: any }> }
): Promise<NextResponse> {
  const taskId = (await params).id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: any }> }
): Promise<NextResponse> {
  const taskId = (await params).id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }

    const { title, content, classId } = await request.json();
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
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
      ...updatedTask,
      className: updatedTask.class.name,
    });
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
} 