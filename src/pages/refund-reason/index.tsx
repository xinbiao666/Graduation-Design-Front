import { Component } from "react";
import {
  View,
  Image,
  Text,
  Checkbox,
  ScrollView,
  Button
} from "@tarojs/components";
import taro, { getCurrentInstance } from "@tarojs/taro";
import { AtRadio, AtTextarea } from "taro-ui";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class RefundReason extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      refundReasonList: [
        { label: "买贵了", value: "买贵了" },
        { label: "买错了买多了", value: "买错了买多了" },
        { label: "优惠未享受", value: "优惠未享受" },
        {
          label: "临时有事无法取货",
          value: "临时有事无法取货",
          checked: false
        },
        { label: "下错门店", value: "下错门店" }
      ],
      reason: "",
      refundExplain: '',
      receivedRefundReason: [
        { label: "实物与商品描述不符", value: "实物与商品描述不符" },
        { label: "个人原因退款", value: "个人原因退款" },
        { label: "商品质量问题", value: "商品质量问题" },
        { label: "缺少此商品", value: "缺少此商品" }
      ]
    };
  }

  $instance = getCurrentInstance();

  reasonCheck = values => {
    this.setState({
      reason: values
    });
  };

  sendApply = async orderDetailInfo => {
    if (!this.state.reason) {
      taro.showToast({
        title: "请选择退款原因",
        icon: "none",
        duration: 2000
      });
      return;
    }
    const { user_id } = getUserIdFromStorage();
    const { data } = await taro.request({
      url: "http://localhost:3000/refund/cancelOrder",
      data: {
        order_id: orderDetailInfo.order_id,
        user_id,
        refund_reason: this.state.reason
      },
      method: "POST",
      header: {
        "content-type": "application/json"
      }
    });
    taro.showToast({
      title: data.meta.msg,
      icon: "none",
      duration: 2000
    });
    if (data.meta.status === 200) {
      taro.reLaunch({ url: "/pages/order-list/index" });
    }
  };

  render() {
    const orderDetailInfo = JSON.parse(
      this.$instance.router.params.orderDetailInfo
    );
    return (
      <ScrollView className='refund-reason-container'>
        <View className='refund-goods'>
          <View className='title'>退款商品</View>
          {orderDetailInfo.goodsList.map(item => {
            return (
              <View className='goods-info-container' key={item.goods_id}>
                <View className='goods-info'>
                  <View className='goods-cover'>
                    <Image src={item.goods_cover} />
                  </View>
                  <View className='goods-name'>
                    <View className='name'>{item.goods_name}</View>
                    <View className='num'>数量：{item.goods_num}</View>
                  </View>
                </View>
                <View className='goods-price'>单价￥{item.goods_price}</View>
              </View>
            );
          })}
        </View>
        <View className='refund-price-container'>
          <View className='title'>退款金额</View>
          <View className='price'>￥{orderDetailInfo.total_real_cost}</View>
        </View>
        <View className='reason-container'>
          <View className='refund-reason-title'>
            取消原因<Text>*</Text>
          </View>
          <AtRadio
            options={
              orderDetailInfo.is_delivery === 1 &&
              orderDetailInfo.order_status === 1
                ? this.state.receivedRefundReason
                : this.state.refundReasonList
            }
            value={this.state.reason}
            onClick={this.reasonCheck}
          ></AtRadio>
        </View>
        <View className='confirm-btn'>
          <View className='btn'>
            <Button
              onClick={() => {
                this.sendApply(orderDetailInfo);
              }}
            >
              提交申请
            </Button>
          </View>
        </View>
        <View className='refund-explain'>
          <View className='title'>退款说明</View>
          <AtTextarea
            value={this.state.refundExplain}
            onChange={(value)=>{ this.setState( { refundExplain: value  } ) }}
            maxLength={200}
            placeholder='请输入退款说明'
          />
        </View>
      </ScrollView>
    );
  }
}
