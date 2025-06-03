import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';

type StudentFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialValues?: any;
};

export default function StudentForm({
  open,
  onOpenChange,
  onSuccess,
  initialValues,
}: StudentFormProps) {
  const [classes, setClasses] = useState<{ label: string; value: number }[]>([]);

  // 获取班级列表
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        const data = await response.json();
        setClasses(
          data.items.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      } catch (error) {
        message.error('获取班级列表失败');
      }
    };

    if (open) {
      fetchClasses();
    }
  }, [open]);

  return (
    <ModalForm
      title={initialValues ? '编辑学生' : '新建学生'}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues}
      onFinish={async (values) => {
        try {
          const url = initialValues
            ? `/api/students/${initialValues.id}`
            : '/api/students';
          const method = initialValues ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            throw new Error('保存失败');
          }

          message.success('保存成功');
          onSuccess();
          return true;
        } catch (error) {
          message.error('保存失败，请重试');
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="姓名"
        placeholder="请输入学生姓名"
        rules={[{ required: true, message: '请输入学生姓名' }]}
      />
      <ProFormSelect
        name="category"
        label="类别"
        placeholder="请选择学生类别"
        options={[
          { label: 'A类', value: 'A' },
          { label: 'B类', value: 'B' },
          { label: 'C类', value: 'C' },
        ]}
      />
      <ProFormSelect
        name="classId"
        label="所属班级"
        placeholder="请选择班级"
        options={classes}
        rules={[{ required: true, message: '请选择班级' }]}
      />
    </ModalForm>
  );
} 