import { Component } from "react";
import { View } from "@tarojs/components";
import taro from "@tarojs/taro";

import "./index.scss";

export default class Setting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  deleteUserInfo = () => {
    try{
      taro.clearStorage()
      taro.switchTab({ url: '/pages/mine/index' })
    }catch(e) {
      console.log(e)
      taro.showToast({
        title: e,
        icon: 'none',
        duration: 2000
      })
    }
  }

  render() {
    return (
        <View className='setting-container'>
            <View className='setting-menu' onClick={this.deleteUserInfo}>
                <View>退出登录</View>
                <View><View className='at-icon at-icon-chevron-right'></View></View>
            </View>
        </View> 
    );
  }
}
