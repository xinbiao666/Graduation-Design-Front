import { Component } from "react";
import { View, Text, Button } from "@tarojs/components";
import taro from "@tarojs/taro";

import "./index.scss";

export default class OrderButton extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  confirmPayment = () => {
    taro.showModal({
      title: "确认支付",
      content: "确认提交订单并支付？",
      success: async (res) => {
        if (res.confirm) {
          const orderInfo = JSON.stringify(await this.props.orderConfirm())
          taro.reLaunch({ url: `/pages/payment-success/index?orderInfo=${orderInfo}` })
        } else if (res.cancel) {
          this.props.orderCancel()
        }
      }
    });
  };

  render() {
    return (
      <View className='total-price-payment'>
        {this.props.totalPayment ? (
          <View className='total-price-integral-container'>
            <View className='total-text'>合计：</View>
            <View className='total-price-integral'>
              ￥<Text>{this.props.totalPayment}</Text>
            </View>
          </View>
        ) : (
          ""
        )}
        <Button
          className={
            this.props.totalPayment
              ? "order-payment"
              : "order-payment only-button"
          }
          onClick={this.confirmPayment}
        >
          {this.props.buttonText}
        </Button>
      </View>
    );
  }
}
