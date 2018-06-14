import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Notify from '../views/notify/notify.vue'
import RecordChart from '../views/record/chart.vue'
import RecordList from '../views/record/record.vue'
import Config from '../views/config/config.vue'
import Secret from '../views/record/secret.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '告警记录',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/record/chart', component: RecordChart, name: '告警图表' },
            { path: '/record/list', component: RecordList, name: '告警列表' },
        ]
    },
    {
      path: '/config',
      component: Home,
      name: '告警配置',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/config', component: Config, name: '告警配置' },
      ]
    },
    {
      path: '/notify',
      
      component: Home,
      name: '告警通知',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/notify', component: Notify, name: '通知人员' },
      ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;