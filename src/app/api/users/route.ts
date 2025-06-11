import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@/generated/prisma';

// 获取用户列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('current') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const username = searchParams.get('username') || '';
    const role = searchParams.get('role') || '';

    // 构建查询条件
    const where: Prisma.UserWhereInput = {
      ...(username && { username: { contains: username } }),
      ...(role && { role: role as 'TEACHER' | 'PARENT' }),
    };

    // 获取总数
    const total = await prisma.user.count({ where });

    // 获取分页数据
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      items: users,
      total,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// 创建用户
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, name, role, classIds } = body;

    // 验证必填字段
    if (!username || !password || !name || !role) {
      return NextResponse.json(
        { error: '用户名、密码、姓名和角色不能为空' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role,
        classes: {
          connect: classIds ? classIds.map((id: number) => ({ id })) : []
        }
      },
      include: {
        classes: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    );
  }
} 