import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const studentId = parseInt(id as string);

  try {
    // 检查学生是否存在
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ error: '学生不存在' });
    }

    switch (req.method) {
      case 'DELETE':
        // 删除学生
        await prisma.student.delete({
          where: { id: studentId },
        });
        return res.status(200).json({ success: true });

      case 'PUT':
        const { name, category, classId } = req.body;
        
        // 更新学生信息
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

        return res.status(200).json({
          ...updatedStudent,
          className: updatedStudent.class.name,
        });

      default:
        res.setHeader('Allow', ['DELETE', 'PUT']);
        return res.status(405).json({ error: `方法 ${req.method} 不被允许` });
    }
  } catch (error) {
    console.error('操作失败:', error);
    return res.status(500).json({ error: '操作失败' });
  }
} 