import { Component } from "react";
import { View } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtDivider } from "taro-ui";
import taro, { getCurrentInstance } from "@tarojs/taro";
import OrderInfoCard from "./components/orderInfoCard";
import getUserIdFromStorage from "../common/getUserIdFromStorage";
import RefundOrderInfoCard from "./components/refundOrderInfoCard";

import "./index.scss";

export default class OrderList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tabList: [
        { id: 0, title: "全部" },
        { id: 1, title: "待发货" },
        { id: 2, title: "待取货" },
        { id: 3, title: "退款售后" }
      ],
      currentTab: 0,
      orderList: []
    };
  }

  componentDidMount(): void {
    const currentTab = this.$instance.router.params.currentTab
    if(currentTab){
      this.setState({
        currentTab: parseInt(currentTab)
      },() => {
        this.getOrderList();
      })
    }else {
      this.getOrderList();
    }
  }

  $instance = getCurrentInstance();

  getOrderList = async () => {
    const userInfo = getUserIdFromStorage();
    const { currentTab } = this.state;
    let order_status = "";
    switch (currentTab) {
      case 0:
        order_status = "all";
        break;
      case 1:
        order_status = "wait-send";
        break;
      case 2:
        order_status = "wait-receive";
        break;
      case 3:
        order_status = "refund";
        break;
    }
    await taro.showLoading({ title: "加载中" });
    const { data } = await taro.request({
      url: "http://47.106.202.197:3000/order/query",
      data: {
        user_id: userInfo.user_id,
        order_status
      },
      method: "GET",
      header: {
        "content-type": "application/json"
      }
    });
    this.setState(
      {
        orderList: data.orderList
      },
      () => {
        taro.hideLoading();
      }
    );
  };

  switchTabs = tabIndex => {
    this.setState(
      {
        currentTab: tabIndex,
        orderList: []
      },
      () => {
        this.getOrderList();
      }
    );
  };

  render() {
    const { tabList, currentTab, orderList } = this.state;
    return (
      <View>
        <View className='switch-tabs'>
          <AtTabs
            current={currentTab}
            tabList={tabList}
            onClick={this.switchTabs}
          >
            {tabList.map(item => {
              return (
                <AtTabsPane current={currentTab} index={item.id} key={item.id}>
                  <View className='goods-list-container'>
                    {orderList.map(orderListItem => {
                      if (currentTab !== 3) {
                        return (
                          <OrderInfoCard
                            key={orderListItem.order_id}
                            orderInfo={orderListItem}
                          />
                        );
                      } else {
                        return (
                          <RefundOrderInfoCard
                            key={orderListItem.refund_id}
                            orderInfo={orderListItem}
                          />
                        );
                      }
                    })}
                    <AtDivider content='暂无更多' />
                  </View>
                </AtTabsPane>
              );
            })}
          </AtTabs>
        </View>
      </View>
    );
  }
}
