import taro from '@tarojs/taro'

export default function getUserIdFromStorage(){
    try{
        const userInfo = taro.getStorageSync('userInfo')
        return userInfo
    }catch(e) {
        console.log(e)
        return e
    }
}