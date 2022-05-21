import { Component } from "react";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtGrid } from "taro-ui";
import taro from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      orderStateList: [
        { label: "待发货", iconURL: "wait-for-evaluate", operate: 'wait-for-evaluate' },
        { label: "待取货", iconURL: "wait-for-receive", operate: 'wait-for-receive' },
        { label: "退款/售后", iconURL: "after-service", operate: 'after-service' },
        { label: "全部订单", iconURL: "all-order", operate: 'all-order' }
      ],
      userOperateList: [
        {
          value: "自提管理",
          image:
            "http://82.157.235.2:3000/image/icon/taking-goods-address.svg"
        },
        {
          value: "联系客服",
          image: "http://82.157.235.2:3000/image/icon/call-service.svg"
        },
        {
          value: "设置",
          image: "http://82.157.235.2:3000/image/icon/setting.svg"
        },
        {
          value: "钱包",
          image: "http://82.157.235.2:3000/image/icon/wallet.svg"
        },
        {
          value: "意见反馈",
          image: "http://82.157.235.2:3000/image/icon/feedback.svg"
        },
        {
          value: "更多",
          image: "http://82.157.235.2:3000/image/icon/more.svg"
        }
      ],
      userInfo: {}
    };
  }

  componentDidMount(): void {
    const userInfo = getUserIdFromStorage()
    this.setState({
      userInfo
    });
  }
  componentDidShow(){
    const userInfo = getUserIdFromStorage()
    this.setState({
      userInfo
    });
  }

  userLogin = () => {
    taro.getStorage({
      key: "session_key",
      fail: async () => {
        const { userInfo } = await taro.getUserProfile({
          desc: "获取用户头像、昵称等信息"
        });
        const { code } = await taro.login();
        const { data } = await taro.request({
          url: "http://82.157.235.2:3000/login",
          data: { code, userInfo },
          method: "GET",
          header: {
            "content-type": "application/json"
          }
        });
        if (data.meta.status === 200) {
          await taro.setStorage({
            key: "session_key",
            data: data.session_key
          });
          await taro.setStorage({
            key: "userInfo",
            data
          });
          this.setState({
            userInfo: data
          });
          taro.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  };

  operationSwitch = (item) => {
    switch(item.operate){
      case 'wait-for-evaluate':
        taro.navigateTo({
          url:`/pages/order-list/index?currentTab=1`
        })
        break;
      case 'wait-for-receive':
        taro.navigateTo({
          url:`/pages/order-list/index?currentTab=2`
        })
        break;
      case 'after-service':
        taro.navigateTo({
          url:`/pages/order-list/index?currentTab=3`
        })
        break;
      case 'all-order':
        taro.navigateTo({
          url:`/pages/order-list/index?user_id=${this.state.userInfo.user_id}`
        })
        break;
    }
  }

  orderStateClick = (item, index) => {
    switch(index){
      case 0:
        taro.navigateTo({
          url:`/pages/current-location/index`
        })
        break;
      case 1:
        taro.makePhoneCall({
          phoneNumber: '13697749577'
        })
        break;
      case 2:
        taro.navigateTo({
          url:`/pages/setting/index`
        })
        break;
      case 3:
        taro.navigateTo({
          url:`/pages/wallet/index`
        })
        break;
      case 4:
        taro.navigateTo({
          url:`/pages/current-location/index`
        })
        break;
      case 5:
        taro.navigateTo({
          url:`/pages/current-location/index`
        })
        break;
    }
  }

  render() {
    const { orderStateList, userOperateList, userInfo } = this.state;
    return (
      <View className='mine-page-container'>
        <View className='user-info'>
          <AtAvatar image={userInfo.avatar_url || ""} circle></AtAvatar>
          <View className='user-name' onClick={this.userLogin}>
            {userInfo.nick_name || "登录 / 注册"}
          </View>
        </View>
        <View className='order-state'>
          {orderStateList.map(item => {
            return (
              <View className='state-common' key={item.iconURL} onClick={()=>{this.operationSwitch(item)}}>
                <Image
                  src={`http://82.157.235.2:3000/image/icon/${item.iconURL}.svg`}
                ></Image>
                <Text className='state-text'>{item.label}</Text>
              </View>
            );
          })}
        </View>
        <View className='user-operate'>
          <AtGrid
            hasBorder={false}
            data={userOperateList}
            columnNum={5}
            onClick={this.orderStateClick}
          ></AtGrid>
        </View>
      </View>
    );
  }
}
