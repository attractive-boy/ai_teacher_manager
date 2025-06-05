"use client";

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import { useState } from 'react';
import ClassForm from './components/ClassForm';

// 定义班级数据类型
type ClassItem = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 工具函数
const waitTime = async (time: number = 100) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const columns: ProColumns<ClassItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '班级名称',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    tooltip: '班级名称过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_, record, __, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <Popconfirm
        key="delete"
        title="确定要删除这个班级吗？"
        onConfirm={async () => {
          try {
            const response = await fetch(`/api/classes/${record.id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              message.success('删除成功');
              action?.reload();
            } else {
              throw new Error('删除失败');
            }
          } catch (error) {
            message.error('删除失败，请重试');
          }
        }}
        okText="确定"
        cancelText="取消"
      >
        <a key="delete">删除</a>
      </Popconfirm>
    ],
  },
];

export default function ClassPage() {
  const actionRef = useRef<ActionType>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);

  return (
    <>
      <ProTable<ClassItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(1000);
          // 构建查询参数
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value) {
              queryParams.append(key, value.toString());
            }
          });

          try {
            const response = await fetch(`/api/classes?${queryParams.toString()}`);
            const data = await response.json();
            return {
              data: data.items,
              success: true,
              total: data.total,
            };
          } catch (error) {
            message.error('获取班级列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-class-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                createdAt: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="班级列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentClass(null);
              setFormOpen(true);
            }}
          >
            新建
          </Button>,
        ]}
      />

      <ClassForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={currentClass}
        onSuccess={() => {
          setFormOpen(false);
          setCurrentClass(null);
          actionRef.current?.reload();
        }}
      />
    </>
  );
} 