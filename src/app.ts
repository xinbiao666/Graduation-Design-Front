import { Component } from "react";
// import taro from "@tarojs/taro";
import "./app.scss";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   taro.addInterceptor(async chain => {
  //     if(chain.requestParams.url.split('47.106.202.197:3000')[1] === '/login') return chain.proceed(chain.requestParams);
  //     try {
  //       const accessToken = taro.getStorageSync("session_key");
  //       if (accessToken) {
  //         chain.requestParams.header.access_token = accessToken;
  //       } else {
  //         taro.showToast({
  //           title: "请先登录",
  //           icon: "none",
  //           duration: 2000
  //         });
  //       }
  //     } catch (e) {}
  //     return chain.proceed(chain.requestParams);
  //   });
  // }

  render() {
    return this.props.children;
  }
}

export default App;
