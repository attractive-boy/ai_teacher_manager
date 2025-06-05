import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { students } = await request.json();
    console.log("students", students);

    // 验证数据
    if (!Array.isArray(students)) {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      );
    }

    // 批量创建学生
    const createdStudents = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const student of students) {
        // 查找或创建班级
        let classRecord = await tx.class.findFirst({
          where: { name: student['班级名称'] }
        });

        if (!classRecord) {
          classRecord = await tx.class.create({
            data: { name: student['班级名称'] }
          });
        }

        // 创建学生
        const newStudent = await tx.student.create({
          data: {
            name: student['姓名'],
            category: student['类别'] || 'C',
            classId: classRecord.id,
          },
        });
        results.push(newStudent);
      }
      return results;
    });

    return NextResponse.json({
      message: '批量导入成功',
      count: createdStudents.length,
    });
  } catch (error) {
    console.error('批量导入学生失败:', error);
    return NextResponse.json(
      { error: '批量导入失败' },
      { status: 500 }
    );
  }
} 