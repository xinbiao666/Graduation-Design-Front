import { Component } from "react";
import { View } from "@tarojs/components";
import taro from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class Wallet extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
        balance: 0
    };
  }

  componentDidMount(){
    const { user_id } = getUserIdFromStorage()
    taro.request({
        url:`http://82.157.235.2:3000/wallet?user_id=${user_id}`,
        data:{
            user_id
        },
        method:'GET',
        header: {
            'content-type':'application/json'
        },
        success: (res)=>{
            this.setState({
                balance: res.data.data.balance
            })
        },
        fail: (err)=>{
            taro.showToast({
                title: '查询失败',
                icon: 'none',
                duration: 2000
            })
        }
    })
  }

  render() {
    return (
        <View className='wallet-container'>
            <View className='wallet-menu'>
                <View>余额</View>
                <View className='balance'>{this.state.balance}</View>
            </View>
        </View> 
    );
  }
}
