import { View } from "@tarojs/components";
import taro from "@tarojs/taro";

import "./index.scss";

const toShoppingCart = () => {
  taro.switchTab({
    url: "/pages/shoppingCart/index"
  });
};

export default function FloatCartButton(props) {
  return (
    <View className='float-cart-container' onClick={toShoppingCart}>
      <View className='goods-num'>{props.goodsNum}</View>
      <View className='float-cart-button'>
        <View className='at-icon at-icon-shopping-cart'></View>
      </View>
    </View>
  );
}
