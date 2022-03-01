import { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import taro, { hideToast } from "@tarojs/taro";
import OrderButton from "./components/orderButton";
import GoodsInfoDetailList from "../components/goodsInfoDetailList";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      shoppingCartList: [],
      isSelectAll: false,
      totalPrice: 0,
      totalGoodsNum: 0,
      orderGoodsList: [],
      shopName: ''
    };
    this.getShoppingCartList()
  }

  getShoppingCartList = async () => {
    try {
      const { user_id } = taro.getStorageSync("userInfo");
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/shoppingCart/query",
        method: "GET",
        data: {
          user_id
        },
        header: {
          "content-type": "application/json"
        }
      });
      this.setState({
        shoppingCartList: data.shoppingCartList
      },() => {
        this.computeTotalPrice()
        this.computeTotalGoodsNum()
        this.filterOrderGoods()
      });
    } catch (e) {}
  };

  isSelectAll = async () => {
    try {
      const { user_id } = taro.getStorageSync("userInfo");
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/shoppingCart/isSelectAll",
        method: "GET",
        data: {
          user_id
        },
        header: {
          "content-type": "application/json"
        }
      });
      this.setState({
        isSelectAll: data.isSelectAll
      });
    } catch (e) {
      console.log(e);
    }
  };

  computeTotalPrice = () => {
    let totalPrice = 0
    this.state.shoppingCartList.forEach(item => {
      if(item.status){
        totalPrice += (item.goods_price*item.num)
      }
    })
    this.setState({
      totalPrice: totalPrice.toFixed(2)
    })
  }

  computeTotalGoodsNum = () => {
    let totelNum = 0
    this.state.shoppingCartList.forEach(item => {
      if(item.status){
        totelNum += item.num
      }
    })
    this.setState({
      totalGoodsNum: totelNum
    })
  }

  filterOrderGoods = () => {
    let orderGoodsList = []
    this.state.shoppingCartList.forEach(item => {
      if(item.status){
        orderGoodsList.push(item)
      }
    })
    this.setState({
      orderGoodsList
    })
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
      shopName: data.currentLocationInfo.shop_name
    })
  }

  gotoChangeLocation = () => {
    taro.navigateTo({
      url:'/pages/current-location/index'
    })
  }

  componentDidShow() {
    this.getShoppingCartList();
    this.isSelectAll();
    this.filterOrderGoods();
    this.getCurrentLocation()
  }

  render() {
    const { shoppingCartList, isSelectAll, totalPrice, totalGoodsNum, orderGoodsList, shopName } = this.state
    return (
      <View className={shoppingCartList.length > 4 ? 'shopping-cart-container' : 'shopping-cart-container full-height'}>
        <View className='edit-take-goods-point'>
          <View className='address'>
            <View className='at-icon at-icon-map-pin'></View>
            <Text className='address-text'>{shopName}</Text>
          </View>
          <View className='edit' onClick={this.gotoChangeLocation}>编辑</View>
        </View>
        {shoppingCartList.length ? (
          <View className='goods-list'>
            <GoodsInfoDetailList
              page='shopping-cart'
              shoppingCartList={shoppingCartList}
              getShoppingCartList={this.getShoppingCartList}
              isSelectAll={this.isSelectAll}
            />
          </View>
        ) : (
          <View className='cart-empty'>
            <Image src='http://47.106.202.197:3000/image/icon/shopping-cart-empty.svg'></Image>
            <View>购物车空空的，快去逛逛吧~</View>
          </View>
        )}
        <OrderButton
          totalPrice={totalPrice}
          buttonText={`结算(${totalGoodsNum})`}
          getShoppingCartList={this.getShoppingCartList}
          isSelectAll={isSelectAll}
          isSelectAllFn={this.isSelectAll}
          shoppingCartList={orderGoodsList}
        />
      </View>
    );
  }
}
