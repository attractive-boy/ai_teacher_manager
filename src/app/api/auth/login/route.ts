import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    console.log(username, password);


    // 验证用户名和密码
    const user = await prisma.admin.findFirst({
      where: {
        username,
      },
    });
    console.log(user);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 返回用户信息和 token
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
} 