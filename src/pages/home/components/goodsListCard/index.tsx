import { Component } from "react";
import { View, Image } from "@tarojs/components";
import taro from "@tarojs/taro";

import "./index.scss";

export default class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  toGoodsDetail = (item) => {
    taro.navigateTo({
      url: `/pages/goodsDetail/index?goodsId=${item.goods_id}`
    })
  }
  addToshoppingCart = async (item) => {
    const { data } = await taro.getStorage({key:'userInfo'})
    await taro.request({
      url: 'http://47.106.202.197:3000/shoppingCart/add',
      method: 'GET',
      data: {
        goods_id: item.goods_id,
        user_id: data.user_id
      },
      header:{
        'content-type': 'application/json'
      }
    })
    taro.showToast({
      title: '已添加至购物车',
      icon: 'success',
      duration: 2000
    })
    this.props.getGoodsNum()
  }
  render() {
    return this.props.goodsList.map(item => {
      return (
        <View className='goods-card-container' key={item.goods_id}>
          <View className='goods-image'  onClick={()=>{this.toGoodsDetail(item)}}>
            <Image
              src={item.goods_cover}
            ></Image>
          </View>
          <View className='goods-title'>{item.goods_name}</View>
          <View className='goods-price'>
            <View className='price'>￥{item.goods_price}</View>
            <View className='add-shopping-cart' onClick={()=>{this.addToshoppingCart(item)}}>加入购物车</View>
          </View>
        </View>
      );
    });
  }
}
