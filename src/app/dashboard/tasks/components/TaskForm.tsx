"use client";

import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';

type TaskFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialValues?: any;
};

export default function TaskForm({
  open,
  onOpenChange,
  onSuccess,
  initialValues,
}: TaskFormProps) {
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
      title={initialValues ? '编辑任务' : '新建任务'}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues}
      onFinish={async (values) => {
        try {
          const url = initialValues
            ? `/api/tasks/${initialValues.id}`
            : '/api/tasks';
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
        name="title"
        label="任务名称"
        placeholder="请输入任务名称"
        rules={[{ required: true, message: '请输入任务名称' }]}
      />
      <ProFormTextArea
        name="content"
        label="任务内容"
        placeholder="请输入任务内容"
        rules={[{ required: true, message: '请输入任务内容' }]}
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