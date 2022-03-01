import { Component } from "react";
import { Map, View, Button, ScrollView } from "@tarojs/components";
import taro from "@tarojs/taro";
import "../../static/markers-icons/Marker1_Activated@3x.png";
import getUserIdFromStorage from "../common/getUserIdFromStorage";

import "./index.scss";

export default class GoodsTakeLocation extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      mapLatitude: 0,
      mapLongitude: 0,
      mapMarkers: [],
      initMarkers: [],
      mapShow: false
    };
  }

  componentDidMount(): void {
    this.getLocation();
  }

  getLocation = async () => {
    const res = await taro.getLocation({ type: "gcj02" });
    this.setState(
      {
        mapLatitude: res.latitude,
        mapLongitude: res.longitude
      },
      () => {
        this.getNearbyShop();
      }
    );
  };

  getNearbyShop = async () => {
    await taro.showLoading({ title: "加载中" });
    const { data } = await taro.request({
      url: "http://localhost:3000/location/queryNearbyShop",
      data: {
        latitude: this.state.mapLatitude,
        longitude: this.state.mapLongitude
      },
      method: "POST",
      header: {
        "content-type": "application/json"
      }
    });
    this.setState({
      mapMarkers: data.nearbyShopList,
      initMarkers: data.nearbyShopList,
      mapShow: true
    });
    taro.hideLoading();
  };

  markerClick = e => {
    const { markerId } = e.detail;
    this.setState(
      {
        mapMarkers: this.state.initMarkers
      },
      () => {
        const activeMarker = this.state.mapMarkers.map(item => {
          if (item.id === markerId) {
            return {
              ...item,
              width: 40,
              height: 40,
              callout: {
                content: item.shop_name,
                fontSize: 12,
                borderRadius: 10,
                bgColor: "#fff",
                padding: 5,
                display: "ALWAYS",
                textAlign: "center"
              }
            };
          } else {
            return item;
          }
        });
        this.setState({
          mapMarkers: activeMarker
        });
      }
    );
  };

  changeCurrentLocation = async item => {
    const { user_id } = getUserIdFromStorage()
    try{
      await taro.request({
        url: "http://localhost:3000/location/changeCurrentLocation",
        data: {
          user_id,
          current_location_id: item.id
        },
        method: 'POST',
        header: {
          "content-type": "application/json"
        }
      });
      taro.showToast({
        title: '选择成功',
        icon: 'none',
        duration: 2000
      })
    }catch(e) {
      taro.showToast({
        title: '选择失败',
        icon: 'none',
        duration: 2000
      })
    }
  };

  render() {
    return (
      <View className='location-select-container'>
        <View className='map-container'>
          {this.state.mapShow && (
            <Map
              markers={this.state.mapMarkers}
              latitude={this.state.mapLatitude}
              longitude={this.state.mapLongitude}
              style={{ height: "50vh", width: "100vw" }}
              scale={17}
              showLocation
              onMarkerTap={this.markerClick}
            />
          )}
        </View>
        {this.state.mapMarkers.length ? (
          <ScrollView scrollY className='nearby-shop-list'>
            {this.state.mapMarkers.map(item => {
              return (
                <View className='shop-card' key={item.id}>
                  <View className='location-info'>
                    <View className='shop-name'>{item.shop_name}</View>
                    <View className='location-detail'>
                      {item.location_detail}
                    </View>
                  </View>
                  <View className='select-btn'>
                    <View>
                      <Button onClick={()=>{this.changeCurrentLocation(item)}}>选这个</Button>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View className='no-shop'>
            <View className='contant'>附近暂无自提点，去其他地方看看吧~</View>
          </View>
        )}
      </View>
    );
  }
}
