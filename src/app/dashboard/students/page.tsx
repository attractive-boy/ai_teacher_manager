"use client";

import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import StudentForm from './components/StudentForm';
import { useState } from 'react';

// 定义学生数据类型
type StudentItem = {
  id: number;
  name: string;
  category: string;
  classId: number;
  className: string;
  createdAt: string;
  updatedAt: string;
};

// 工具函数移到组件内部
const waitTime = async (time: number = 100) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const columns: ProColumns<StudentItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    tooltip: '姓名过长会自动收缩',
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
    title: '类别',
    dataIndex: 'category',
    valueEnum: {
      'A': { text: 'A类', status: 'Success' },
      'B': { text: 'B类', status: 'Warning' },
      'C': { text: 'C类', status: 'Error' },
    },
    filters: true,
    onFilter: true,
  },
  {
    title: '所属班级',
    dataIndex: 'className',
    ellipsis: true,
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
        title="确定要删除这个学生吗？"
        onConfirm={async () => {
          try {
            const response = await fetch(`/api/students/${record.id}`, {
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
      </Popconfirm>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default function StudentPage() {
  const actionRef = useRef<ActionType>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentItem | null>(null);

  return (
    <>
      <ProTable<StudentItem>
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
            const response = await fetch(`/api/students?${queryParams.toString()}`);
            const data = await response.json();
            return {
              data: data.items,
              success: true,
              total: data.total,
            };
          } catch (error) {
            message.error('获取学生列表失败');
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
          persistenceKey: 'pro-table-student-demos',
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
        headerTitle="学生列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentStudent(null);
              setFormOpen(true);
            }}
          >
            新建
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: '导出数据',
                  key: '1',
                },
                {
                  label: '批量导入',
                  key: '2',
                },
                {
                  label: '批量删除',
                  key: '3',
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={currentStudent}
        onSuccess={() => {
          setFormOpen(false);
          setCurrentStudent(null);
          actionRef.current?.reload();
        }}
      />
    </>
  );
} 