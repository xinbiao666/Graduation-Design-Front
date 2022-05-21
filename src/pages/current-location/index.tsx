import { View, Button, Checkbox } from "@tarojs/components";
import { useEffect, useState } from "react"; 
import taro, { useDidShow } from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default function CurrentLocation() {

  const [ currentLocationInfo, setcurrentLocationInfo ] = useState({})

  const gotoSelectOtherLocation = () => {
    taro.navigateTo({ url: "/pages/goods-take-location/index" });
  };

  const getCurrentLocation = async () => {
    const { user_id } = getUserIdFromStorage()
    const { data } = await taro.request({
      url: 'http://82.157.235.2:3000/location/getCurrentLocation',
      data:{
        user_id
      },
      method: 'GET',
      header: {
        "content-type": "application/json"
      }
    })
    setcurrentLocationInfo(data.currentLocationInfo)
  }

  useEffect(()=>{
    getCurrentLocation()
  },[])

  useDidShow(()=>{
    getCurrentLocation()
  })

  return (
    <View className='current-location-container'>
      <View className='title'>当前自提点</View>
      <View className='current-location'>
        <View className='current-location-card'>
          <View className='location-info'>
            <View className='shop-name'>{currentLocationInfo.shop_name}</View>
            <View className='location-detail'>{currentLocationInfo.location_detail}</View>
          </View>
          <View className='checkbox'>
            <Checkbox checked value='currentLocation' disabled></Checkbox>
          </View>
        </View>
      </View>
      <View className='select-other-location'>
        <View className='select-btn'>
          <Button onClick={gotoSelectOtherLocation}>选择其他自提点</Button>
        </View>
      </View>
    </View>
  );
}
