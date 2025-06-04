import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 删除学生
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // 检查学生是否存在
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { error: '学生不存在' },
        { status: 404 }
      );
    }

    // 删除学生
    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除学生失败:', error);
    return NextResponse.json(
      { error: '删除学生失败' },
      { status: 500 }
    );
  }
}

// 更新学生信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, category, classId } = body;

    // 检查学生是否存在
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { error: '学生不存在' },
        { status: 404 }
      );
    }

    // 更新学生信息
    const updatedStudent = await prisma.student.update({
      where: { id },
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
    console.error('更新学生信息失败:', error);
    return NextResponse.json(
      { error: '更新学生信息失败' },
      { status: 500 }
    );
  }
} 