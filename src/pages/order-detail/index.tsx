import { Component } from "react";
import { View, Image, Button } from "@tarojs/components";
import taro, { getCurrentInstance } from "@tarojs/taro";
import parseDate from "@/pages/common/parseDate";
import { AtSteps } from "taro-ui";
import "./index.scss";

export default class OrderDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      orderDetailInfo: {},
      orderGoodsList: [],
      transportInfo: [
        {
          title: "已发货",
          desc: "订单商品已经分拣出库，等待送达",
          status: "success"
        },
        { title: "已送达", desc: "商品已到达自提点，请前往自提", status: "" }
      ],
      current: 1
    };
  }

  componentDidMount(): void {
    this.getOrderDetail();
  }

  $instance = getCurrentInstance();

  getOrderDetail = async () => {
    const { data } = await taro.request({
      url: "http://47.106.202.197:3000/order/queryOrderDetail",
      data: {
        order_id: this.$instance.router.params.order_id
      },
      method: "GET",
      header: {
        "content-type": "application/json"
      }
    });
    let changeTransportInfo = this.state.transportInfo;
    if (data.orderDetail.is_delivery) {
      changeTransportInfo = changeTransportInfo.map((item, index) => {
        if (index) {
          item.status = "success";
          return item;
        } else {
          return item;
        }
      });
    }
    this.setState({
      orderDetailInfo: data.orderDetail,
      orderGoodsList: data.orderDetail.goodsList,
      transportInfo: changeTransportInfo
    });
  };

  applyRefund = async goodsInfo => {
    const orderDetailInfo = JSON.parse(
      JSON.stringify(this.state.orderDetailInfo)
    );
    if (orderDetailInfo.is_delivery !== 0) {
      orderDetailInfo.goodsList = [goodsInfo];
      const param = JSON.stringify(orderDetailInfo);
      taro.navigateTo({
        url: `/pages/refund-reason/index?orderDetailInfo=${param}`
      });
    } else {
      taro.showToast({
        title: "该正在运输中,请待商品送达自提点后发起退款申请",
        icon: "none",
        duration: 2000
      });
    }
  };

  checkOrderGoodsStatus = orderDetailInfo => {
    for (let item of orderDetailInfo.goodsList) {
      if (item.is_refund) {
        return true;
      }
    }
    return false;
  };

  cancelOrder = () => {
    const { orderDetailInfo } = this.state;
    if (this.checkOrderGoodsStatus(orderDetailInfo)) {
      taro.showToast({
        title: "该订单已存在退款商品，请点击单个商品进行退款",
        icon: "none",
        duration: 2000
      });
      return
    }
    if (orderDetailInfo.order_status === 0) {
      const param = JSON.stringify(orderDetailInfo);
      taro.navigateTo({
        url: `/pages/refund-reason/index?orderDetailInfo=${param}`
      });
    } else if (orderDetailInfo.order_status === 1) {
      if (orderDetailInfo.is_delivery === 0) {
        taro.showToast({
          title: "该正在运输中,请待商品送达自提点后发起退款申请",
          icon: "none",
          duration: 2000
        });
      } else if (orderDetailInfo.is_delivery === 1) {
        const param = JSON.stringify(orderDetailInfo);
        taro.navigateTo({
          url: `/pages/refund-reason/index?orderDetailInfo=${param}`
        });
      } else {
        taro.showToast({
          title: "数据错误,请联系客服",
          icon: "none",
          duration: 2000
        });
      }
    }
  };

  statusText = item => {
    if (item.is_refund === 1 && item.refund_status === 0) {
      return "已申请退款";
    } else if (item.is_refund === 1 && item.refund_status === 1) {
      return "已退款";
    } else {
      return "退款失败";
    }
  };

  render() {
    const { orderDetailInfo, orderGoodsList, transportInfo } = this.state;
    return (
      <View className='order-detail-container'>
        <View className='user-info-container'>
          <View className='user-name-phone'>
            <View className='icon'>
              <Image src='http://47.106.202.197:3000/image/icon/my-info.svg'></Image>
            </View>
            <View className='user'>江星标 13697749577</View>
          </View>
          <View className='receive-code'>自提码</View>
        </View>
        <View className='receive-location'>
          <View className='icon'>
            <Image src='http://47.106.202.197:3000/image/icon/shop.png'></Image>
          </View>
          <View className='location-info'>
            <View className='location-name'>自提点：江星标的家</View>
            <View className='location-detail'>
              梅州市梅江区坝南路23号a栋302房
            </View>
          </View>
        </View>
        {orderDetailInfo.order_status ? (
          <AtSteps
            items={transportInfo}
            current={this.state.current}
            onChange={() => {}}
          />
        ) : (
          ""
        )}
        {orderGoodsList.map(item => {
          return (
            <View className='goods-info-container' key={item.goods_id}>
              <View className='good-detail'>
                <View className='goods-cover'>
                  <Image src={item.goods_cover} />
                </View>
                <View className='goods-info'>
                  <View className='goods-name'>{item.goods_name}</View>
                  <View className='goods-price-num'>
                    ￥{item.goods_price}/件 共{item.goods_num}件
                  </View>
                </View>
              </View>
              <View className='goods-price'>
                <View className='price'>
                  ￥{parseFloat((item.goods_price * item.goods_num).toFixed(2))}
                </View>
                {orderDetailInfo.order_status &&
                orderDetailInfo.order_status !== 3 ? (
                  <View className='refund-btn'>
                    {item.is_refund ? (
                      <View className='status-text'>
                        {this.statusText(item)}
                      </View>
                    ) : (
                      <Button
                        onClick={() => {
                          this.applyRefund(item);
                        }}
                      >
                        申请退款
                      </Button>
                    )}
                  </View>
                ) : (
                  ""
                )}
              </View>
            </View>
          );
        })}
        <View className='goods-total-price'>
          <View className='title'>商品总额</View>
          <View className='total-price'>
            ￥{orderDetailInfo.goods_total_price}
          </View>
        </View>
        <View className='total-real-cost'>
          <View className='title'>合计实付</View>
          <View className='price'>￥{orderDetailInfo.total_real_cost}</View>
        </View>
        <View className='order-info'>
          <View className='order-info-title'>订单信息</View>
          <View className='order-id'>
            <View className='title'>订单编号</View>
            <View className='contant'>{orderDetailInfo.order_id}</View>
          </View>
          <View className='confirm-time'>
            <View className='title'>下单时间</View>
            <View className='contant'>
              {parseDate(new Date(orderDetailInfo.order_confirm_time))}
            </View>
          </View>
        </View>
        <View className='cancel-order-btn'>
          <View>
            <Button onClick={this.cancelOrder}>取消订单</Button>
          </View>
        </View>
      </View>
    );
  }
}
