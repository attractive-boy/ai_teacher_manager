"use client";

import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';

type UserFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialValues?: any;
};

export default function UserForm({
  open,
  onOpenChange,
  onSuccess,
  initialValues,
}: UserFormProps) {
  return (
    <ModalForm
      title={initialValues ? '编辑用户' : '新建用户'}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues}
      onFinish={async (values) => {
        try {
          const url = initialValues
            ? `/api/users/${initialValues.id}`
            : '/api/users';
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
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      />
      <ProFormText
        name="name"
        label="姓名"
        placeholder="请输入姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        placeholder="请输入密码"
        rules={[{ required: !initialValues, message: '请输入密码' }]}
      />
      <ProFormSelect
        name="role"
        label="角色"
        placeholder="请选择角色"
        options={[
          { label: '教师', value: 'TEACHER' },
          { label: '家长', value: 'PARENT' },
        ]}
        rules={[{ required: true, message: '请选择角色' }]}
      />
    </ModalForm>
  );
} 