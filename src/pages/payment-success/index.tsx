import { View, Image, Button } from "@tarojs/components";
import { Component, ReactNode } from "react";
import taro, { getCurrentInstance } from "@tarojs/taro";

import "./index.scss";

export default class PaymentSuccess extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      countDown: 3,
      interval: null
    };
  }

  componentDidMount(): void {
    this.gotoHomeInterval();
  }

  $instance = getCurrentInstance();

  gotoHomeInterval = () => {
    let interval = setInterval(() => {
      if (!this.state.countDown) {
        clearInterval(interval);
        this.gotoHome()
      } else {
        this.setState({
          countDown: this.state.countDown - 1
        });
      }
    }, 1000)
    this.setState({
      interval: interval
    })
  };

  gotoHome = () => {
    clearInterval(this.state.interval)
    taro.switchTab({ url: '/pages/home/index'})
  }

  gotoOrderDetail = () => {
    const orderInfo = JSON.parse(this.$instance.router.params.orderInfo)
    taro.reLaunch({ url: `/pages/order-detail/index?order_id=${orderInfo.order_id}` })
  }

  render(): ReactNode {
    return (
      <View className='payment-success-container'>
        <View className='icon-text-container'>
          <View className='icon'>
            <Image src='http://82.157.235.2:3000/image/icon/payment-success.svg'></Image>
          </View>
          <View className='text'>支付成功</View>
        </View>
        <View className='prompt'>明天下午16点可前往自提点自提</View>
        <View className='operat-btn'>
          <Button className='continue' onClick={this.gotoHome}>继续购物({this.state.countDown})</Button>
          <Button className='check-order' onClick={this.gotoOrderDetail}>查看订单</Button>
        </View>
      </View>
    );
  }
}
