import { View, Text, Button, Checkbox } from "@tarojs/components";
import taro from "@tarojs/taro";

import "./index.scss";

export default function OrderButton(props) {
  const { isSelectAll, totalPrice, buttonText, shoppingCartList } = props;

  const selectAll = async () => {
    try {
      const { user_id } = taro.getStorageSync("userInfo");
      await taro.request({
        url: "http://82.157.235.2:3000/shoppingCart/changeSelectStatus",
        method: "POST",
        data: {
          user_id,
          checkAll: !isSelectAll ? 1 : 0,
          selectAll: "selectAll"
        },
        header: {
          "content-type": "application/json"
        }
      });
      props.getShoppingCartList();
      props.isSelectAllFn();
    } catch (e) {
      console.log(e);
    }
  };

  const confirmOrder = async () => {
    const { user_id } = taro.getStorageSync("userInfo");
    const { data } = await taro.request({
      url: "http://82.157.235.2:3000/shoppingCart/query",
      method: "GET",
      data: {
        user_id
      },
      header: {
        "content-type": "application/json"
      }
    });
    const selectionList = data.shoppingCartList.filter(i => i.status === 1)
    if(!selectionList.length){
      return;
    }
    const goodsInfoList = JSON.stringify(shoppingCartList);
    taro.navigateTo({
      url: `/pages/comfirm-order/index?goodsInfoList=${goodsInfoList}&shoppingCart=true`
    });
  };

  return (
    <View className='total-price-payment'>
      <View className='check-all'>
        <Checkbox
          checked={isSelectAll}
          onClick={selectAll}
          value='selectAll'
        ></Checkbox>
        全选
      </View>
      <View className='total-payment'>
        <View className='total'>
          合计：
          <Text>￥{totalPrice}</Text>
        </View>
        <Button className='order-payment' onClick={confirmOrder}>
          {buttonText}
        </Button>
      </View>
    </View>
  );
}
