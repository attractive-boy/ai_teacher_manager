'use client';

import { ProConfigProvider } from '@ant-design/pro-components';
import React from 'react';

export const proComponentsConfig = {
  token: {
    // 主题配置
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
  // 布局配置
  layout: {
    title: '课堂任务评价板管理系统',
    logo: '/logo.png',
  },
  // 水印配置
  waterMark: {
    content: '课堂任务评价板管理系统',
  },
};

export const ProComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProConfigProvider
      {...proComponentsConfig}
    >
      {children}
    </ProConfigProvider>
  );
}; 