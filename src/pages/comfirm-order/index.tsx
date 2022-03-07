import { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import taro, { getCurrentInstance } from "@tarojs/taro";
import GoodsInfoDetailList from "../components/goodsInfoDetailList";
import OrderButton from "./components/orderButton";
import getUserIdFromStorage from "../common/getUserIdFromStorage";
import "./index.scss";

export default class ComfirmOrder extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      goodsInfoList: [],
      orderInfo: {},
      isShoppingCart: false,
      consignee:{
        name: '',
        phoneNumber: ''
      },
      selfTakeLocationInfo:{
        shopName: '',
        locationDetail: ''
      }
    };
  }

  componentDidMount(): void {
    this.getOrderInfo();
    this.getSelfLocationInfo();
    this.getConsigneeInfo();
  }

  getConsigneeInfo = async () => {
    const { user_id } = getUserIdFromStorage()
    const { data } = await taro.request({
      url: 'http://localhost:3000/order/queryCurrentPicker',
      data: {
        user_id
      },
      method: 'GET',
      header: {
        'contant-type': 'application/json'
      }
    })
    this.setState({
      consignee: {
        name: data.pickerInfo.consignee_name,
        phoneNumber:  data.pickerInfo.consignee_phone
      }
    })
  }

  getSelfLocationInfo = async () => {
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
      selfTakeLocationInfo: {
        shopName: data.currentLocationInfo.shop_name,
        locationDetail:  data.currentLocationInfo.location_detail
      }
    })
  }

  getOrderInfo = () => {
    const goodsInfoList = JSON.parse(
      this.$instance.router.params.goodsInfoList
    );
    const isShoppingCart = JSON.parse(
      this.$instance.router.params.shoppingCart || 'false'
    );
    const orderInfo = {
      originPrice: 0,
      freight: 0,
      discount: 0,
      totalCount: 0
    };
    if (goodsInfoList[0].goods_producing_area) {
      orderInfo.originPrice = parseFloat((goodsInfoList[0].goods_price * goodsInfoList[0].num).toFixed(2));
      orderInfo.freight = 0;
      orderInfo.discount = 0;
      orderInfo.totalCount = orderInfo.originPrice - orderInfo.discount;
    } else {
      let originPrice = 0;
      goodsInfoList.forEach(item => {
        originPrice += item.goods_price * item.num;
      });
      orderInfo.originPrice = parseFloat(originPrice.toFixed(2));
      orderInfo.freight = 0;
      orderInfo.discount = 0;
      orderInfo.totalCount = orderInfo.originPrice - orderInfo.discount;
    }
    this.setState({
      goodsInfoList,
      orderInfo,
      isShoppingCart
    });
  };

  orderConfirm = async () => {
    const { user_id } = getUserIdFromStorage();
    if (this.state.isShoppingCart) {
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/order/generateOrder",
        method: "POST",
        data: {
          user_id
        },
        header: {
          "content-type": "application/json"
        }
      });
      return data
    } else {
      const goods_num = this.state.goodsInfoList[0].num
      const goods_id = this.state.goodsInfoList[0].goods_id
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/order/generateOrder",
        method: "POST",
        data: {
          user_id,
          goods_num,
          goods_id
        },
        header: {
          "content-type": "application/json"
        }
      });
      return data
    }
  };

  orderCancel = () => {
    taro.showToast({
      title: "支付已取消",
      icon: "none",
      duration: 2000
    });
  };

  $instance = getCurrentInstance();

  render() {
    const { goodsInfoList, orderInfo, consignee, selfTakeLocationInfo } = this.state;
    return (
      <View className='comfirm-order-container'>
        <View className='take-goods-info'>
          <View className='consignee-info'>
          <View className='consignee'>提货人：{consignee.name || ''} {consignee.phoneNumber || ''}</View>
            <View>
              编辑<View className='at-icon at-icon-chevron-right'></View>
            </View>
          </View>
          <View className='take-goods-point'>
          <View className='address'>自提点：{selfTakeLocationInfo.shopName || ''}</View>
            <View className='detail-address-container'>
              <View className='detail-address'>
                {selfTakeLocationInfo.locationDetail || ''}
              </View>
              <View>
                切换<View className='at-icon at-icon-chevron-right'></View>
              </View>
            </View>
          </View>
          <View className='promot'>
            <View>下单后如有问题，可联系团长为您解决。</View>
            <View>建议自备购物袋提货，共同助力环保~</View>
          </View>
        </View>
        <View className='order-info-container'>
          <View className='goods-shop-name'>
            <Image src='http://47.106.202.197:3000/image/icon/order.png'></Image>
            <Text className='goods-shop-name-text'>订单商品</Text>
          </View>
          <GoodsInfoDetailList shoppingCartList={goodsInfoList} />
          <View className='payment-remark'>
            <Text className='payment-remark-text'>备注</Text>
            <Text className='payment-remark-warning'>
              建议留言前先与商家沟通确认
            </Text>
          </View>
          <View className='goods-info-common-line goods-origin-price'>
            <View className='goods-origin-price-text'>商品原价</View>
            <View className='goods-cash'>
              现金：<Text>￥{orderInfo.originPrice}</Text>
            </View>
          </View>
          <View className='goods-info-common-noline'>
            运费<Text>{orderInfo.freight}</Text>
          </View>
          <View className='goods-info-common-noline'>
            平台优惠<Text>-￥{orderInfo.discount}</Text>
          </View>
          <View className='goods-info-common-noline'>
            小计<Text>￥{orderInfo.totalCount}</Text>
          </View>
        </View>
        <OrderButton
          totalPayment={orderInfo.totalCount}
          buttonText='确认支付'
          orderConfirm={this.orderConfirm}
          orderCancel={this.orderCancel}
        />
      </View>
    );
  }
}
