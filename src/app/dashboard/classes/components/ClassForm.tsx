"use client";

import {
  ModalForm,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';

type ClassFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Record<string, any> | null;
  onSuccess: () => void;
};

export default function ClassForm({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
}: ClassFormProps) {
  return (
    <ModalForm
      title={initialValues ? '编辑班级' : '新建班级'}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues || undefined}
      onFinish={async (values) => {
        try {
          const url = initialValues
            ? `/api/classes/${initialValues.id}`
            : '/api/classes';
          const method = initialValues ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            message.success(initialValues ? '更新成功' : '创建成功');
            onSuccess();
            return true;
          } else {
            throw new Error(initialValues ? '更新失败' : '创建失败');
          }
        } catch (error) {
          message.error(initialValues ? '更新失败' : '创建失败');
          return false;
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="班级名称"
          placeholder="请输入班级名称"
          rules={[{ required: true, message: '请输入班级名称' }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
} 