import { Component } from "react";
import { Checkbox, View, Button, ScrollView } from "@tarojs/components";
import taro from "@tarojs/taro";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class ChangeConsignee extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    
  }


  render() {
    return (
        <View className='consignee-list-container'>
            <ScrollView scrollY className='consignee-list'>
                <View className='consignee-info-card'>
                    <View className='current-check-box'>
                        <Checkbox checked value='current-consignee' disabled></Checkbox>
                    </View>
                    <View className='info-box'>
                        <View className='consignee-name-phone'>
                            <View className='name'>江江江</View>
                            <View className='phone'>123332244565</View>
                        </View>
                        <View className='edit'>编辑</View>
                    </View>
                </View>
            </ScrollView>
            <View className='add-consignee'>
                <View className='add-consignee-btn'><Button>添加提货人</Button></View>
            </View>
        </View>
    );
  }
}
