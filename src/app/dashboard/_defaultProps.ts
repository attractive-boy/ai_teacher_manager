export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard/students',
        name: '学生管理',
      },
      {
        path: '/dashboard/classes',
        name: '班级管理',
      },
      {
        path: '/dashboard/tasks',
        name: '课堂任务',
      },
      {
        path: '/dashboard/evaluations',
        name: '评价管理',
      },
      {
        path: '/dashboard/settings',
        name: '系统设置',
      },
    ],
  },
  location: {
    pathname: '/',
  },
}; 