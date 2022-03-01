import { View, Image, Button } from "@tarojs/components";
import taro from "@tarojs/taro";
import { AtFloatLayout, AtInputNumber } from "taro-ui";
import { useState } from 'react'

import "./index.scss";

export default function SlidePopWindow(props) {
  const { goodsInfo } = props
  const [goodsNum, setGoodsNum] = useState(1)

  const close = () => {
    props.hideSlidePop();
  };

  const confirmOrder = () => {
    goodsInfo.num = goodsNum
    const goodsInfoList = JSON.stringify([goodsInfo])
    taro.navigateTo({
      url:`/pages/comfirm-order/index?goodsInfoList=${goodsInfoList}`
    })
  }

  const goodsNumChange = (val) => {
    setGoodsNum(val)
  }
  
  return (
    <AtFloatLayout isOpened={props.isSlidePop} onClose={close}>
      <View className='check-buy-container'>
        <View className='goods-payment-info'>
          <View className='goods-image'>
            <Image src={goodsInfo.goods_cover}></Image>
          </View>
          <View className='goods-price-num'>
            <View className='price'>￥{goodsInfo.goods_price}</View>
            <View className='num'>剩余：{goodsInfo.stock}份</View>
          </View>
        </View>
        <View className='goods-buy-num'>
          <View className='num-text'>数量</View>
          <View className='buy-num'>
            <AtInputNumber
              type='number'
              min={1}
              max={100}
              step={1}
              width={100}
              value={goodsNum}
              onChange={goodsNumChange}
            ></AtInputNumber>
          </View>
        </View>
        <View className='mode-info'>
          <View className='mode-text'>配送方式</View>
          <View className='mode'>自提</View>
        </View>
        <View className='mode-info'>
          <View className='mode-text'>支付方式</View>
          <View className='mode'>余额</View>
        </View>
        <View className='comfirm-btn'>
          <Button onClick={confirmOrder}>确定</Button>
        </View>
      </View>
    </AtFloatLayout>
  );
}
