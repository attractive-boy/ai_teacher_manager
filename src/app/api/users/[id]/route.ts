import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: any }> }
): Promise<NextResponse> {
  const userId = parseInt((await params).id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId },
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
  const userId = parseInt((await params).id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const { username, password, name, role, classIds } = await request.json();
    
    // 如果用户名发生变化，检查新用户名是否已存在
    if (username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: '用户名已被使用' },
          { status: 400 }
        );
      }
    }

    // 准备更新数据
    const updateData: any = {
      username,
      name,
      role,
      classes: {
        set: [], // 先清空现有关联
        connect: classIds ? classIds.map((id: number) => ({ id })) : []
      }
    };

    // 如果提供了新密码，则更新密码
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        classes: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
} 