"use client";

import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
  LogoutOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'antd';
import defaultProps from './_defaultProps';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState('/dashboard/students');
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  if (typeof document === 'undefined') {
    return <div />;
  }

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        siderWidth={216}
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        {...defaultProps}
        location={{
          pathname,
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          title: '管理员',
          size: 'small',
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => {
                        localStorage.removeItem('token');
                        router.push('/');
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />,
          ];
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              setPathname(item.path || '/welcome');
              router.push(item.path || '/welcome');
            }}
          >
            {dom}
          </div>
        )}
      >
        <PageContainer>
          <ProCard
            style={{
              height: '100vh',
              minHeight: 800,
            }}
          >
            {children}
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
} 