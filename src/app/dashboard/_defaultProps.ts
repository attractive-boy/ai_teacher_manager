export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard/students',
        name: '学生管理',
        icon: 'UserOutlined',
      },
      {
        path: '/dashboard/classes',
        name: '班级管理',
        icon: 'TeamOutlined',
      },
      {
        path: '/dashboard/tasks',
        name: '课堂任务',
        icon: 'FileTextOutlined',
      },
      {
        path: '/dashboard/evaluations',
        name: '评价管理',
        icon: 'StarOutlined',
      },
      {
        path: '/dashboard/settings',
        name: '系统设置',
        icon: 'SettingOutlined',
      },
    ],
  },
  location: {
    pathname: '/',
  },
}; 