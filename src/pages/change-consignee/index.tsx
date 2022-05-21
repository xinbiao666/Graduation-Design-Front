import { Component } from "react";
import { Checkbox, View, Button, ScrollView } from "@tarojs/components";
import taro from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class ChangeConsignee extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      consigneeList: []
    };
  }

  componentDidMount(): void {
    this.getConsigneeList();
  }

  userInfo  = getUserIdFromStorage();

  getConsigneeList = async () => {
    const { user_id } = getUserIdFromStorage();
    const { data } = await taro.request({
      url: "http://82.157.235.2:3000/consignee/query",
      data: { user_id },
      method: "GET",
      header: {
        "content-type": "application/json"
      }
    });
    this.setState({
      consigneeList: data.consigneeList
    });
  };

  changeConsignee = async (item) => {
    taro.showLoading()
    await taro.request({
      url: "http://82.157.235.2:3000/consignee/update",
      data: { user_id: this.userInfo.user_id, consignee_id: item.consignee_id },
      method: "POST",
      header: {
        "content-type": "application/json"
      }
    })
    this.getConsigneeList()
    taro.hideLoading()
  }

  gotoAddConsignee = async () => {
    taro.navigateTo({ url: '/pages/add-consignee/index' })
  }

  deleteConsignee = async (item) => {
    const { data } = await taro.request({
      url: "http://82.157.235.2:3000/consignee/delete",
      data: { consignee_id: item.consignee_id },
      method: "POST",
      header: {
        "content-type": "application/json"
      }
    });
    if(data.meta.status === 200){
      taro.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      this.getConsigneeList()
    }else {
      taro.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      })
    }
  }

  render() {
    return (
      <View className='consignee-list-container'>
        <ScrollView scrollY className='consignee-list'>
          {this.state.consigneeList.map(item => {
            return (
              <View className='consignee-info-card' key={item.consignee_id}>
                <View className='current-check-box'>
                  <Checkbox
                    checked={item.is_default ? true : false}
                    value='current-consignee'
                    onClick={()=>{this.changeConsignee(item)}}
                  ></Checkbox>
                </View>
                <View className='info-box'>
                  <View className='consignee-name-phone'>
                    <View className='name'>{item.consignee_name}</View>
                    <View className='phone'>{item.consignee_phone}</View>
                  </View>
                  <View className='edit' onClick={()=>{this.deleteConsignee(item)}}>删除</View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View className='add-consignee'>
          <View className='add-consignee-btn'>
            <Button onClick={this.gotoAddConsignee}>添加提货人</Button>
          </View>
        </View>
      </View>
    );
  }
}
