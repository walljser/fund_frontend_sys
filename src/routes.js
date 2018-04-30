// import NotFound from '@/views/404.vue'
import home from '@/views/home/home.vue'
import index from '@/views/index'
import signin from '@/views/sign/signin.vue'
import signup from '@/views/sign/signup.vue'
import financial from '@/views/financial'
import transRecord from '@/views/center/transRecord'
import bill from '@/views/center/bill'
import userCenter from '@/views/center/userCenter'
import userInfo from '@/views/center/userInfo'
import recharge from '@/views/center/recharge'
import withdraw from '@/views/center/withdraw'
import transfer from '@/views/center/transfer'
import setting from '@/views/center/setting'
import fundInfo from '@/views/product/fundInfo'
import holdingInfo from '@/views/product/holdingInfo'

let routes = [{
  path: '/signin',
  name: 'signin',
  component: signin
}, {
  path: '/',
  name: 'index',
  component: index,
  redirect: 'home',
  children: [{
    path: '/home',
    name: 'home',
    component: home
  }, {
    path: '/userCenter',
    name: 'userCenter',
    component: userCenter,
    redirect: '/userCenter/userInfo',
    children: [{
      path: '/userCenter/userInfo',
      name: 'userInfo',
      component: userInfo
    },{
      path: '/userCenter/recharge',
      name: 'recharge',
      component: recharge
    }, {
      path: '/userCenter/withdraw',
      name: 'withdraw',
      component: withdraw
    }, {
      path: '/userCenter/transfer',
      name: 'transfer',
      component: transfer
    }, {
      path: '/userCenter/setting',
      name: 'setting',
      component: setting
    }, {
      path: '/userCenter/transRecord',
      name: 'transRecord',
      component: transRecord
    }, {
      path: '/userCenter/bill',
      name: 'bill',
      component: bill
    }]
  }, {
    path: '/fundInfo/:id',
    name: 'fundInfo',
    component: fundInfo
  }, {
    path: '/holdingInfo/:id',
    name: 'holdingInfo',
    component: holdingInfo
  }]
}, {
  path: '/signup',
  name: 'signup',
  component: signup
}]
// let routes = [{
//     path: '/login',
//     component: Login,
//     name: '',
//     hidden: true
//   }, {
//     path: '/404',
//     component: NotFound,
//     name: '',
//     hidden: true
//   },
//   //{ path: '/main', component: Main },
//   {
//     path: '/',
//     component: Home,
//     name: '基金管理',
//     iconCls: 'el-icon-message', //图标样式class
//     children: [{
//       path: '/main',
//       component: Main,
//       name: 'home',
//       hidden: true
//     }, {
//       path: '/table',
//       component: Table,
//       name: '基金列表'
//     }, {
//       path: '/form',
//       component: Form,
//       name: '基金列表'
//     }, {
//       path: '/user',
//       component: user,
//       name: '列表'
//     }, ]
//   }, {
//   //   path: '/',
//   //   component: Home,
//   //   name: '客户管理',
//   //   iconCls: 'fa fa-id-card-o',
//   //   children: [{
//   //     path: '/page4',
//   //     component: Page4,
//   //     name: '页面4'
//   //   }, {
//   //     path: '/page5',
//   //     component: Page5,
//   //     name: '页面5'
//   //   }]
//   // }, {
//     path: '/',
//     component: Home,
//     name: '',
//     iconCls: 'fa fa-address-card',
//     leaf: true, //只有一个节点
//     children: [{
//       path: '/page6',
//       component: Page6,
//       name: '客户管理'
//     }]
//   }, {
//     path: '/',
//     component: Home,
//     name: 'Charts',
//     iconCls: 'fa fa-bar-chart',
//     children: [{
//       path: '/echarts',
//       component: echarts,
//       name: 'echarts'
//     }]
//   }, {
//     path: '*',
//     hidden: true,
//     redirect: {
//       path: '/404'
//     }
//   }
// ];

export default routes;
