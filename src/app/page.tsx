"use client";

import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Divider, Space, message, theme, Modal } from 'antd';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Page = () => {
  const { token } = theme.useToken();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 处理忘记密码点击
  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 检查自动登录
  useEffect(() => {
    const checkAutoLogin = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const autoLogin = localStorage.getItem('autoLogin') === 'true';

      if (savedToken && savedUser && autoLogin) {
        try {
          // 验证 token 是否有效
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const user = JSON.parse(savedUser);
            message.success('自动登录成功');
            router.push('/dashboard');
          } else {
            // token 无效，清除存储的信息
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('autoLogin');
          }
        } catch (error) {
          console.error('自动登录验证失败:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('autoLogin');
        }
      }
    };

    checkAutoLogin();
  }, [router]);

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      // 保存 token 和用户信息到 localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 保存自动登录设置
      if (values.autoLogin) {
        localStorage.setItem('autoLogin', 'true');
      } else {
        localStorage.removeItem('autoLogin');
      }

      message.success('登录成功');
      router.push('/dashboard/students');
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试');
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://pic1.zhimg.com/v2-2200ec4bbdf9d645831e08dc42320676_1440w.jpg"
        logo="https://github.githubassets.com/favicons/favicon.png"
        backgroundVideoUrl="https://pic1.zhimg.com/v2-2200ec4bbdf9d645831e08dc42320676_1440w.jpg"
        title="课堂任务评价板管理系统"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="智能教学管理平台"
        onFinish={handleSubmit}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: (
              <UserOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: (
              <LockOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
            onClick={handleForgotPassword}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>

      <Modal
        title="忘记密码"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        centered
      >
        <p>请联系系统管理员重置密码！</p>
      </Modal>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};
