import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function DELETE(
  request: NextRequest
): Promise<NextResponse> {
  const studentId = parseInt(request.url.split('/').pop() || '');

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 });
    }

    await prisma.student.delete({
      where: { id: studentId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse> {
  const studentId = parseInt(request.url.split('/').pop() || '');

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 });
    }

    const { name, category, classId } = await request.json();
    
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
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
      ...updatedStudent,
      className: updatedStudent.class.name,
    });
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
} 