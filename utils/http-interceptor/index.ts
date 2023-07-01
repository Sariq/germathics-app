import axios from "axios";
import { BASE_URL } from "../../consts/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fromBase64 } from "../../helpers/convert-base64";
import { DeviceEventEmitter } from "react-native";

const general_errors_codes = ['-400','-6','-7','-10','-11','-401'];
const TOKEN_NOT_VALID = -12;
export const axiosInstance = axios.create({
    baseURL: BASE_URL + '/',
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const token = await AsyncStorage.getItem("@storage_userToken");
        if (token) {
            config.headers['Authorization'] = 'Token ' + token;
        }
        if( config.headers['Content-Type'] !== 'multipart/form-data'){
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response: any) {
        if(response.has_err && general_errors_codes.indexOf(response.error_code) > -1){
            //DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
        }
        // const jsonValue:any = JSON.parse(fromBase64(response.data));
        // if(response.has_err && general_errors_codes.indexOf(response.error_code) > -1){
        //     DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
        // }
        // if(jsonValue.has_err && jsonValue.code === TOKEN_NOT_VALID){
        //     DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
        // }            
        return response.data;
    },
    function (error) {

        DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, { show: true, isSignOut: true });
        // console.log(error)
        return Promise.reject(error);
    }
);