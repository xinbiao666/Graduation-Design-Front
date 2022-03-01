import { Component, ReactNode } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import taro from "@tarojs/taro";
import parseDate from "@/pages/common/parseDate";

import "./index.scss";

export default class RefundOrderInfoCard extends Component<any, any> {

  statusContant = (item) => {
    if(item.refund_status === 0){
      return '退款中'
    }else if(item.refund_status === 1){
      return '退款成功'
    }else if(item.refund_status === 2){
      return '退款失败'
    }else if(item.refund_status === 3){
      return '已取消'
    }
  }

  statusClass = (item) => {
    if(item.refund_status === 1){
      return 'refund-status success'
    }else {
      return 'refund-status cancel-fail-wait'
    }
  }

  refundDetail = (param) => {
    taro.navigateTo({url: `/pages/refund-detail/index?refundId=${param.refund_id}&goodsId=${param.goods_id}`})
  }

  render(): ReactNode {
    const { orderInfo } = this.props;
    return (
      <View className='refund-order-card-container'>
        <View className='refund-total-price'>
          <View>
            退款总金额：<Text>￥{orderInfo.refundTotalPrice}</Text>
          </View>
        </View>
        <View className='order-info'>
          <Text className='order-price'>
            订单金额:￥{orderInfo.orderTotalRealCost}
          </Text>
          <Text className='order-id'>订单编号:{orderInfo.order_id}</Text>
        </View>
        {orderInfo.refundGoodsList?.map(item => {
          return (
            <View className='refund-goods-info' key={item.order_id}>
              <View className='goods-info'>
                <View className='goods-cover'>
                  <Image src={item.goods_cover}></Image>
                  <View className={this.statusClass(item)}>{this.statusContant(item)}</View>
                </View>
                <View className='price-and-time'>
                  <View className='refund-price'>退款金额：￥{item.goods_price}</View>
                  <View className='apply-time'>
                    申请时间：{parseDate(new Date(item.apply_time))}
                  </View>
                </View>
              </View>
              <View className='refund-detail-btn'>
                <View className='btn'>
                  <Button onClick={()=>{this.refundDetail(item)}}>退款详情</Button>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
