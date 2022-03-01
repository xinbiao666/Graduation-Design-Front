import { View, Text, Image, Checkbox } from "@tarojs/components";
import { AtInputNumber } from "taro-ui";
import taro from "@tarojs/taro";

import "./index.scss";

function GoodsInfoDetailList(props) {
  const goodsList = props.shoppingCartList

  const changeSelectStatus = async (item) => {
    item.status = !item.status ? 1 : 0;
    const { data } = await taro.getStorage({
      key: "userInfo"
    });
    await taro.request({
      url: "http://47.106.202.197:3000/shoppingCart/changeSelectStatus",
      method: "POST",
      data: {
        status: item.status,
        goods_id: item.goods_id,
        user_id: data.user_id
      },
      header: {
        "content-type": "application/json"
      }
    });
    props.isSelectAll();
    props.getShoppingCartList();
  };

  const goodsNumChange = async (item, newVal) => {
    const { data } = await taro.getStorage({
      key: "userInfo"
    });
    if(newVal === 0){
      await taro.request({
        url: "http://47.106.202.197:3000/shoppingCart/deleteGoods",
        method: "POST",
        data: {
          user_id: data.user_id,
          goods_id: item.goods_id
        },
        header: {
          "content-type": "application/json"
        }
      });
    }else {
      await taro.request({
        url: "http://47.106.202.197:3000/shoppingCart/changeGoodsNum",
        method: "POST",
        data: {
          user_id: data.user_id,
          goods_num: newVal,
          goods_id: item.goods_id
        },
        header: {
          "content-type": "application/json"
        }
      });
    }
    props.getShoppingCartList();
  };

  return (
    <>
      {goodsList.map((item, index) => {
        return (
          <View className='goods-info-detail-list' key={index}>
            {props.page === "shopping-cart" ? (
              <View className='checkbox'>
                <Checkbox
                  value='status'
                  checked={item.status ? true : false}
                  onClick={() => {
                    changeSelectStatus(item);
                  }}
                ></Checkbox>
              </View>
            ) : (
              ""
            )}
            <View className='goods-info-image'>
              <Image src={item.goods_cover}></Image>
            </View>
            <View className='goods-info-shape'>
              <View className='goods-name'>{item.goods_name}</View>
              <View className='goods-shape-detail'>
                <Text className='goods-type'>套装1</Text>
                <Text className='goods-color'>白色</Text>
              </View>
              <View className='goods-price-number'>
                <View className='goods-price'>￥{item.goods_price}</View>
                <View className='goods-number'>
                  {props.page === "shopping-cart" ? (
                    <AtInputNumber
                      type='number'
                      min={0}
                      max={100}
                      step={1}
                      value={item.num}
                      onChange={num => {
                        goodsNumChange(item, num);
                      }}
                    />
                  ) : '×'+ item.num}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
}

export default GoodsInfoDetailList