import { Component } from "react";
import { View, Input } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtDivider } from "taro-ui";
import taro from "@tarojs/taro";
import GoodsListCard from "./components/goodsListCard/index";
import FloatCartButton from "./components/floatCartButton";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentTab: 0,
      tabList: [],
      goodsList: [],
      isLoading: false,
      goodsNum: 0,
      shopName: '',
      searchParam: ''
    };
  }

  componentDidShow(){
    this.getTabList();
    this.getGoodsList();
    this.getGoodsNum();
    this.getCurrentLocation()
  }

  handelTabsClick = i => {
    this.setState(
      {
        currentTab: i,
        searchParam: ''
      },
      () => {
        this.getGoodsList();
      }
    );
  };

  getGoodsList = async () => {
    await taro.showLoading({ title: "加载中" });
    this.setState({
      isLoading: true
    });
    try {
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/goods/queryGoodsList",
        method: "GET",
        data: {
          typeId: this.state.currentTab
        },
        header: {
          "content-type": "application/json"
        }
      });
      this.setState(
        {
          goodsList: data.goodsList,
          isLoading: false
        },
        () => {
          taro.hideLoading();
        }
      );
    } catch (e) {
      taro.hideLoading();
      taro.showToast({
        title: "加载失败",
        duration: 2000,
        icon: "none"
      });
    }
  };

  getGoodsNum = async () => {
    let allGoodsNum = 0
    try {
      const { user_id } = taro.getStorageSync("userInfo");
      const { data } = await taro.request({
        url: "http://47.106.202.197:3000/shoppingCart/query",
        method: "GET",
        data: {
          user_id
        },
        header:{
          'content-type': 'application/json'
        }
      });
      data.shoppingCartList.forEach(item => {
        allGoodsNum += item.num 
      })
      this.setState({
        goodsNum: allGoodsNum
      })
    } catch (e) {
        console.log(e)
    }
  };

  getTabList = async () => {
    const { data } = await taro.request({
      url: "http://47.106.202.197:3000/goods/queryTabList",
      method: "GET",
      header: {
        "content-type": "application/json"
      }
    });
    this.setState({
      tabList: data.goodsTabsList
    });
  };

  gotoChangeLocation = () => {
    taro.navigateTo({
      url:'/pages/current-location/index'
    })
  }

  getCurrentLocation = async () => {
    const { user_id } = getUserIdFromStorage()
    const { data } = await taro.request({
      url: 'http://47.106.202.197:3000/location/getCurrentLocation',
      data:{
        user_id
      },
      method: 'GET',
      header: {
        "content-type": "application/json"
      }
    })
    this.setState({
      shopName: data.currentLocationInfo.shop_name
    })
  }

  fuzzyQueryGoods = async () => {
    const { data } = await taro.request({
      url: 'http://47.106.202.197:3000/goods/queryGoodsList',
      data: {
        typeId: this.state.currentTab,
        goodsName: this.state.searchParam
      },
      method: 'GET',
      header:{
        'content-typ': 'application/json'
      }
    })
    this.setState({
      goodsList: data.goodsList
    })
  }

  changeSearchParam = (e) => {
    this.setState({
      searchParam: e.detail.value
    })
  }

  render() {
    const { currentTab, tabList, goodsList, isLoading, goodsNum, shopName, searchParam } = this.state;
    return (
      <View
        className={
          goodsList.length > 2
            ? "home-page-container home-page-container-full-height"
            : "home-page-container"
        }
      >
        <FloatCartButton goodsNum={goodsNum}></FloatCartButton>
        <View className='pick-up-address' onClick={this.gotoChangeLocation}>
          <View className='at-icon at-icon-map-pin'></View>
          <View className='pick-up-address-text'>
            自提点：{shopName}
          </View>
          <View className='split'></View>
          <View className='change-address'>
            切换
            <View className='at-icon at-icon-chevron-right'></View>
          </View>
        </View>
        <View className='search-product'>
          <View className='at-icon at-icon-search icon-position'></View>
          <Input className='search' placeholder='请输入商品名称' value={searchParam} onInput={this.changeSearchParam} maxlength={15} />
          <View className='search-click' onClick={this.fuzzyQueryGoods}>搜索</View>
        </View>
        <View className='tabs-container'>
          <AtTabs
            current={currentTab}
            scroll
            tabList={tabList}
            onClick={this.handelTabsClick}
          >
            {tabList.map((item, index) => {
              return (
                <AtTabsPane
                  current={currentTab}
                  index={item.type_id}
                  key={item.type_id}
                >
                  {!isLoading && (
                    <View className='goods-list'>
                      <GoodsListCard goodsList={this.state.goodsList} getGoodsNum={this.getGoodsNum} />
                      <AtDivider content='没有更多了' />
                    </View>
                  )}
                </AtTabsPane>
              );
            })}
          </AtTabs>
        </View>
      </View>
    );
  }
}
