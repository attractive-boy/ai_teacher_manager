import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@/generated/prisma';

export async function POST(request: Request) {
  try {
    const { users } = await request.json();
    console.log("users", users);

    // 验证数据
    if (!Array.isArray(users)) {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      );
    }

    // 批量创建用户
    const createdUsers = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const user of users) {
        // 检查用户名是否已存在
        const existingUser = await tx.user.findUnique({
          where: { username: user['用户名'] }
        });

        if (existingUser) {
          continue; // 跳过已存在的用户
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(user['密码'], 10);

        // 创建用户
        const newUser = await tx.user.create({
          data: {
            username: user['用户名'],
            password: hashedPassword,
            name: user['姓名'],
            role: user['角色'] as 'TEACHER' | 'PARENT',
          },
          select: {
            id: true,
            username: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        results.push(newUser);
      }
      return results;
    });

    return NextResponse.json({
      message: '批量导入成功',
      count: createdUsers.length,
    });
  } catch (error) {
    console.error('批量导入用户失败:', error);
    return NextResponse.json(
      { error: '批量导入失败' },
      { status: 500 }
    );
  }
} 