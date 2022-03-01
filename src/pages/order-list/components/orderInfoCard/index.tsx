import { Component } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import taro from "@tarojs/taro";
import parseDate from "@/pages/common/parseDate";

import "./index.scss";

export default class OrderInfoCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  gotoOrderDetail = order_id => {
    taro.navigateTo({
      url: `/pages/order-detail/index?order_id=${order_id}`
    });
  };

  orderStatus = status => {
    switch (status) {
      case 0:
        return "待发货";
      case 1:
        return "待收货";
      case 2:
        return "已完成";
      case 3:
        return "已取消";
    }
  };

  checkOrderGoodsStatus = orderDetailInfo => {
    for (let item of orderDetailInfo.orderGoodsList) {
      if (item.is_refund) {
        return true;
      }
    }
    return false;
  };

  confirmReceive = () => {
    if(this.props.orderInfo.order_status === 3){
      taro.showToast({
        title: "该订单已取消",
        icon: "none",
        duration: 2000
      });
      return
    }
    if(this.checkOrderGoodsStatus(this.props.orderInfo)){
      taro.showToast({
        title: "该订单已存在退款商品，暂时无法确认收货",
        icon: "none",
        duration: 2000
      });
      return
    }
    if (
      this.props.orderInfo.order_status !== 0 &&
      this.props.orderInfo.is_delivery !== 0
    ) {
      taro.showModal({
        title: "是否确认收货？",
        content: "由于商品性质,确认收货后，暂不支持发起退款申请",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    } else{
      taro.showToast({
        title: '该商品暂未发货或正在运输中',
        icon: 'none',
        duration: 2000
      })
    }
  };

  render() {
    const { orderInfo } = this.props;
    return (
      <View className='order-info-card-container'>
        <View className='order-date-status'>
          <View className='date'>
            {parseDate(new Date(orderInfo.order_confirm_time))}
          </View>
          <View className='status'>
            {this.orderStatus(orderInfo.order_status)}
          </View>
        </View>
        {orderInfo.orderGoodsList?.map(item => {
          return (
            <View
              className='order-info'
              key={item.goods_id}
              onClick={() => {
                this.gotoOrderDetail(item.order_id);
              }}
            >
              <View className='order-image-name'>
                <View>
                  <Image src={item.goods_cover}></Image>
                </View>
                <View className='good-name'>{item.goods_name}</View>
              </View>
              <View className='order-price-num'>
                <View className='price'>￥{item.goods_price}</View>
                <View className='num'>共{item.goods_num}件</View>
              </View>
            </View>
          );
        })}
        <View className='total-real-payment'>
          合计实付：<Text>￥{orderInfo.total_real_cost}</Text>
        </View>
        <View className='refund-btn'>
          <View className='confirm-receive'>
            <Button onClick={this.confirmReceive}>确认收货</Button>
          </View>
          <View>
            <Button
              onClick={() => {
                this.gotoOrderDetail(orderInfo.order_id);
              }}
            >
              申请退款
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
