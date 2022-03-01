export default {
  pages: [
    'pages/home/index',
    'pages/mine/index',
    'pages/shoppingCart/index',
    'pages/goodsDetail/index',
    'pages/comfirm-order/index',
    'pages/payment-success/index',
    'pages/order-list/index',
    'pages/order-detail/index',
    'pages/goods-take-location/index',
    'pages/current-location/index',
    'pages/refund-detail/index',
    'pages/refund-reason/index',
    'pages/setting/index',
    'pages/wallet/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '社区团购',
    navigationBarTextStyle: 'black',
  },
  tabBar:{
    position: 'bottom',
    selectedColor: '#ec893c',
    list: [
      { pagePath: 'pages/home/index', text:'首页', iconPath:'./static/img/home.png', selectedIconPath:'./static/img/home-fill.png'},
      { pagePath: 'pages/shoppingCart/index', text:'购物车', iconPath:'./static/img/shopping-cart.png', selectedIconPath:'./static/img/shopping-cart-fill.png'},
      { pagePath: 'pages/mine/index', text:'我的', iconPath:'./static/img/mine.png', selectedIconPath:'./static/img/mine_fill.png' },
    ]
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
