"use client";

import { EllipsisOutlined, PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Upload } from 'antd';
import { useRef } from 'react';
import TaskForm from './components/TaskForm';
import { useState } from 'react';
import * as XLSX from 'xlsx';

// 定义任务数据类型
type TaskItem = {
  id: number;
  title: string;
  content: string;
  classId: number;
  className: string;
  createdAt: string;
  updatedAt: string;
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default function TaskPage() {
  const actionRef = useRef<ActionType>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);

  const columns: ProColumns<TaskItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      tooltip: '任务名称过长会自动收缩',
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
      title: '任务内容',
      dataIndex: 'content',
      ellipsis: true,
      search: false,
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
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentTask(record);
            setFormOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除这个任务吗？"
          onConfirm={async () => {
            try {
              const response = await fetch(`/api/tasks/${record.id}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('删除失败');
              }
              message.success('删除成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('删除失败，请重试');
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<TaskItem>
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
            const response = await fetch(`/api/tasks?${queryParams.toString()}`);
            const data = await response.json();
            return {
              data: data.items,
              success: true,
              total: data.total,
            };
          } catch (error) {
            message.error('获取任务列表失败');
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
          persistenceKey: 'pro-table-task-demos',
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
        headerTitle="任务列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentTask(null);
              setFormOpen(true);
            }}
          >
            新建
          </Button>,
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={() => {
              // 创建工作簿
              const wb = XLSX.utils.book_new();
              // 创建工作表数据
              const wsData = [
                ['任务名称', '任务内容', '班级名称'], // 表头
                ['课堂练习1', '完成课本第10页习题', '计算机1班'], // 示例数据
                ['课后作业1', '预习下一章节内容', '计算机2班'],
              ];
              const ws = XLSX.utils.aoa_to_sheet(wsData);
              // 将工作表添加到工作簿
              XLSX.utils.book_append_sheet(wb, ws, '任务导入模板');
              // 下载文件
              XLSX.writeFile(wb, '任务导入模板.xlsx');
            }}
          >
            下载模板
          </Button>,
          <Upload
            key="upload"
            accept=".xlsx,.xls"
            showUploadList={false}
            customRequest={async ({ file }) => {
              try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const data = new Uint8Array(e.target?.result as ArrayBuffer);
                  const workbook = XLSX.read(data, { type: 'array' });
                  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  const jsonData = XLSX.utils.sheet_to_json(worksheet);

                  // 转换中文字段名为英文字段名
                  const formattedData = jsonData.map((item: any) => ({
                    title: item['任务名称'],
                    content: item['任务内容'],
                    className: item['班级名称']
                  }));

                  // 发送数据到服务器
                  const response = await fetch('/api/tasks/batch', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tasks: formattedData }),
                  });

                  if (!response.ok) {
                    throw new Error('导入失败');
                  }

                  message.success('导入成功');
                  actionRef.current?.reload();
                };
                reader.readAsArrayBuffer(file as Blob);
              } catch (error) {
                message.error('导入失败，请重试');
              }
            }}
          >
            <Button icon={<UploadOutlined />}>批量导入</Button>
          </Upload>,
        ]}
      />
      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          setFormOpen(false);
          actionRef.current?.reload();
        }}
        initialValues={currentTask}
      />
    </>
  );
} 