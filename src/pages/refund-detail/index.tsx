import { View, Image, Text } from "@tarojs/components";
import { AtSteps } from "taro-ui";
import { useState, useEffect } from "react";
import taro, { getCurrentInstance } from "@tarojs/taro";
import parseDate from "@/pages/common/parseDate";

import "./index.scss";

export default function RefundDetail() {
  const $instance = getCurrentInstance();
  const { goodsId, refundId } = $instance.router.params;
  const [current, setCurrent] = useState(1);
  const [refundOrderDetail, setRefundOrderDetail] = useState({});
  const [statusList, setStatusList] = useState([
    {
      title: "提交申请",
      status: "success"
    },
    {
      title: "团长审核",
      icon: {
        value: "search",
        activeColor: "#fff",
        inactiveColor: "#78A4FA",
        size: "14"
      }
    },
    {
      title: "退款到账",
      icon: {
        value: "check",
        activeColor: "#fff",
        inactiveColor: "#78A4FA",
        size: "14"
      }
    }
  ]);

  const getRefundOrderDetail = async () => {
    const { data } = await taro.request({
      url: "http://82.157.235.2:3000/order/queryRefundDetail",
      data: {
        goodsId,
        refundId
      },
      method: 'GET',
      header: {
        "content-type": "application/json"
      }
    });
    setRefundOrderDetail(data.refundOrderDetail);
    if (data.refundOrderDetail.refund_status === 1) {
      setCurrent(2);
      const newStautsList = statusList.map(item => {
        item.status = "success";
        return item;
      });
      setStatusList(newStautsList);
    }
  };

  useEffect(() => {
    getRefundOrderDetail();
  }, []);

  return (
    <View className='refund-order-detail'>
      <AtSteps items={statusList} current={current} onChange={() => {}} />
      <View className='status-detail'>
        <View className='title'>退款成功</View>
        <View className='contant'>
          成功退款<Text>{refundOrderDetail.refund_price}</Text>
          元，已原路退还值您的支付账户
        </View>
        <View className='date-time'>
          {parseDate(new Date(refundOrderDetail.apply_time))}
        </View>
      </View>
      <View className='refund-price'>
        <View className='price-box'>
          <View className='title'>退款金额</View>
          <View className='price'>￥{refundOrderDetail.refund_price}</View>
        </View>
        <View className='explain'>已退回您的支付账户</View>
      </View>
      <View className='refund-order-info'>
        <View className='option'>
          <View className='title'>订单编号</View>
          <View className='contant'>{refundOrderDetail.order_id}</View>
        </View>
        <View className='option'>
          <View className='title'>订单数量</View>
          <View className='contant'>{refundOrderDetail.goods_num}</View>
        </View>
        <View className='option'>
          <View className='title'>申请金额</View>
          <View className='contant'>￥{refundOrderDetail.refund_price}</View>
        </View>
        <View className='option'>
          <View className='title'>退款去向</View>
          <View className='contant'>商品金额已退回支付账户</View>
        </View>
        <View className='option'>
          <View className='title'>退款原因</View>
          <View className='contant'>{refundOrderDetail.refund_reason}</View>
        </View>
        <View className='option'>
          <View className='title'>退款说明</View>
          <View className='contant'>
            {refundOrderDetail.refund_explain || "无"}
          </View>
        </View>
      </View>
      <View className='goods-info'>
        <View className='goods-cover'>
          <Image src={refundOrderDetail.goods_cover} />
        </View>
        <View className='goods-num-name'>
          <View className='name'>{refundOrderDetail.goods_name}</View>
          <View className='surplus-num'>
            退款数量：{refundOrderDetail.refund_num}
          </View>
        </View>
      </View>
    </View>
  );
}
