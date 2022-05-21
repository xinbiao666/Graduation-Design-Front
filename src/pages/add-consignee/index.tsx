import { Component } from "react";
import { View, Button, Input } from "@tarojs/components";
import { AtForm, AtInput } from "taro-ui";
import taro from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class AddConsignee extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phoneNumber: ""
    };
  }

  componentDidMount(): void {}

  submit = async () => {
    if (!this.state.name || !this.state.phoneNumber) {
      taro.showToast({
        title: "请输入相关信息",
        icon: "none",
        duration: 2000
      });
      return;
    } else {
      const { user_id } = getUserIdFromStorage();
      const { name: consignee_name, phoneNumber: consignee_phone } = this.state;
      const { data } = await taro.request({
        url: "http://82.157.235.2:3000/consignee/insert",
        data: { user_id, consignee_name, consignee_phone },
        method: "POST",
        header: {
          "content-type": "application/json"
        }
      });
      if (data.meta.status === 200) {
        taro.showToast({
          title: data.meta.msg,
          icon: "success",
          duration: 2000,
          success: () => {
            taro.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        taro.showToast({
          title: data.meta.msg,
          icon: "none",
          duration: 2000
        });
      }
    }
  };

  nameChange = val => {
    this.setState({
      name: val
    });
    return val;
  };

  phoneChange = val => {
    this.setState({
      phoneNumber: val
    });
    return val;
  };

  render() {
    return (
      <View className='add-consignee-container'>
        <View>
          <AtForm>
            <AtInput
              name='name'
              required
              border={false}
              title='提货人'
              type='text'
              placeholder='请输入姓名'
              value={this.state.name}
              onChange={this.nameChange}
            />
            <AtInput
              name='phoneNumber'
              required
              border={false}
              title='手机号'
              type='phone'
              placeholder='请输入手机号'
              value={this.state.phoneNumber}
              onChange={this.phoneChange}
            />
          </AtForm>
        </View>
        <View className='add-consignee'>
          <View className='add-consignee-btn'>
            <Button onClick={this.submit}>保存</Button>
          </View>
        </View>
      </View>
    );
  }
}
