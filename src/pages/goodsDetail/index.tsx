import { Component } from "react";
import taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem, Text, Button } from "@tarojs/components";
import  SlidePopWindow  from './components/slidePopWindow/index'
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class GoodsDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      goodsSwiperImg: [],
      goodsInfo: {},
      isSlidePop: false,
      cartGoodsNum: 0,
      locationDetail: ''
    };
    this.getGoodsInfo();
    this.getCartGoodsNum();
    this.getCurrentLocation();
  }

  $instance = getCurrentInstance()

  getGoodsInfo = async () =>{
    const id = this.$instance.router.params.goodsId
    const { data } = await taro.request({
      method:'GET',
      url:'http://47.106.202.197:3000/goods/query',
      data:{ id },
      header:{
        'content-type': 'application/json'
      }
    })
    this.setState({
      goodsInfo: data.goodsInfo[0],
      goodsSwiperImg: data.goodsSwiperImg
    })
  }

  hideSlidePop = ()=>{
    this.setState({
        isSlidePop: !this.state.isSlidePop
    })
  }

  getCartGoodsNum = async () => {
    const userInfo = getUserIdFromStorage()
    const { data } = await taro.request({
      url:'http://47.106.202.197:3000/shoppingCart/query',
      data:{
        user_id: userInfo.user_id
      },
      method:'GET',
      header:{
        'content-type': 'application/json'
      }
    })
    let cartGoodsNum = 0
    data.shoppingCartList.map(item => {
      cartGoodsNum += item.num
    })
    this.setState({
      cartGoodsNum
    })
  }

  addShoppingCart = async () => {
    const userInfo = getUserIdFromStorage()
    await taro.request({
      url: 'http://47.106.202.197:3000/shoppingCart/add',
      method: 'GET',
      data: {
        goods_id: this.$instance.router.params.goodsId,
        user_id: userInfo.user_id
      },
      header:{
        'content-type': 'application/json'
      }
    })
    this.getCartGoodsNum()
    taro.showToast({
      title: '已添加至购物车',
      icon: 'success',
      duration: 2000
    })
  }

  toShoppingCartTabBar = () => {
    taro.switchTab({
      url: "/pages/shoppingCart/index"
    });
  }

  getCurrentLocation = async () => {
    const { user_id } = getUserIdFromStorage()
    const { data } = await taro.request({
      url: 'http://47.106.202.197:3000/location/getCurrentLocation',
      data:{
        user_id
      },
      method: 'GET',
      header: {
        "content-type": "application/json"
      }
    })
    this.setState({
      locationDetail: data.currentLocationInfo.location_detail
    })
  }

  render() {
    const { goodsInfo, goodsSwiperImg, cartGoodsNum, locationDetail } = this.state
    return (
      <View className='goods-detail-container'>
        <Swiper
          className='goods-image-swiper'
          indicatorColor='#fff'
          indicatorActiveColor='#e36939'
          circular
          indicatorDots
          autoplay
        >
          {goodsSwiperImg.map(item => {
            return (
              <SwiperItem key={item.id}>
                <View className='goods-image'>
                  <Image src={item.url}></Image>
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View className='goods-price-contianer'>
          <View className='group-buy-price'>
            <Text className='group-buy-title'>团购价</Text>
            <Text className='price-text-style'>￥{goodsInfo.goods_price}</Text>
          </View>
          <View className='other-price'>
            <Text className='other-title'>其他参考价</Text>
            <Text className='price-text-style'>￥{goodsInfo.goods_reference_price}</Text>
          </View>
        </View>
        <View className='goods-title-container'>
          <View className='goods-title'>
            <View className='goods-platform'>团购尊享</View>
            {goodsInfo.goods_name}
          </View>
          <View className='goods-native'>
            <View className='at-icon at-icon-map-pin'></View>
            <Text className='native'>{goodsInfo.goods_producing_area}</Text>
          </View>
        </View>
        <View className='distribution-container'>
          <View className='distribution'>
            <Text className='title'>配送方式</Text>
            <Text className='mode'>上门自提</Text>
          </View>
          <View className='mention'>
            <Text className='title'>自提信息</Text>
            <Text className='address'>{locationDetail}</Text>
          </View>
        </View>
        <View className='goods-information-container'>
          <View className='title'>
            <View className='title-line-style'></View>
            商品详情
          </View>
          {goodsSwiperImg.map(item => {
            return <Image src={item.url} key={item.id} mode='widthFix'></Image>;
          })}
        </View>
        <View className='fixed-box'>
          <View className='shopping-cart-icon' onClick={this.toShoppingCartTabBar}>
            <View className='at-icon at-icon-shopping-cart'></View>
            {cartGoodsNum ? (<View className='goods-number'>{cartGoodsNum}</View>) : ''}
            <View className='text'>购物车</View>
          </View>
          <View className='button-container'>
              <Button className='btn-common add-shopping-cart' onClick={this.addShoppingCart}>加入购物车</Button>
              <Button className='btn-common go-to-pay' onClick={this.hideSlidePop}>立即购买</Button>
          </View>
        </View>
        <SlidePopWindow isSlidePop={this.state.isSlidePop} hideSlidePop={this.hideSlidePop} goodsInfo={goodsInfo} />
      </View>
    );
  }
}
