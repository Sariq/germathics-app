import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { toBase64, fromBase64 } from '../../helpers/convert-base64'
import { ORDER_API, GEO_API } from "../../consts/api";
import Constants from "expo-constants";
import * as Device from 'expo-device';
import i18n from "../../translations/index-x";
import { axiosInstance } from "../../utils/http-interceptor";
import { getCurrentLang } from "../../translations/i18n";
import { Platform } from "react-native";
import { bcoindId } from "../../consts/shared";
var hash = require('object-hash');

export type TOrderSubmitResponse = {
  has_err: boolean;
  code: number;
  order_id: number;
  status: string;
  salt: string;
}

export type TUpdateCCPaymentRequest = {
  order_id: number;
  creditcard_ReferenceNumber: string;
  datetime: Date;
}
type TOrderHistory = {
  phoneNumber: string;
  ordersList: TCart[];
}
type TGradiants = {
  id: number;
  name: string;
  value: any;
}
type TProduct = {
  item_id: number;
  qty: number;
  price: number;
  notes: string;
  data: TGradiants[];
}
type TOrder = {
  payment_method: 'CREDITCARD' | 'CASH';
  receipt_method: 'DELIVERY' | 'TAKEAWAY';
  creditcard_ReferenceNumber?: string;
  geo_positioning?: string;
  items: TProduct[];
}

type TCart = {
  order: TOrder;
  total: number;
  app_language: '0' | '1',
  device_os: string,
  app_version: string,
  unique_hash?: string;
  datetime: Date,
  orderDate: any;
}


const prodcutExtrasAdapter = (extras) => {
  let productExtras = [];
  if (!extras) {
    return productExtras;
  }
  Object.keys(extras).map((key) => {
    if (key !== 'orderList') {
      return (
        extras[key].map((extra) => {
          if (extra.available_on_app) {
            if (extra.type === "CHOICE" && !extra.multiple_choice) {
              if (extra.value !== false) {
                productExtras.push({ id: extra.id, name: extra.name, value: extra.value });
              }
            }
            if (extra.type === "COUNTER") {
              if (extra.counter_init_value !== extra.value) {
                productExtras.push({ id: extra.id, name: extra.name, value: extra.value });
              }
            }
            if (extra.type === "CHOICE" && extra.multiple_choice) {
              if (extra.isdefault !== extra.value) {
                productExtras.push({ id: extra.id, name: extra.name, value: extra.value });
              }
            }
          }
        })
      )
    }
  })
  return productExtras;
}
const getPriceBySize = (product) =>{
  return product.data.extras.size.options[product.data.extras.size.value].price;

  const size = product.data.extras.size.options?.filter((size)=>size.title === product.data.extras.size.value)[0];
  return size?.price;
}
const produtsAdapter = (order) => {
  let finalProducts = [];
  order.products.map((product) => {
    const finalProduct = {
      item_id: product.data._id,
      name: product.data.nameHE,
      qty: product.data.extras.counter.value,
      size: product.data.extras.size.value,
      clienImage: product.data.extras.image?.value,
      price: getPriceBySize(product) || product.data.price,
      data: prodcutExtrasAdapter(product.extras)
    }
    finalProducts.push(finalProduct);
  })
  return finalProducts;
}

class CartStore {
  cartItems = [];

  isEnabled = false;

  constructor() {
    makeAutoObservable(this);
    this.getDefaultValue();
  }
  getDefaultValue = async () => {
    const jsonValue = await AsyncStorage.getItem("@storage_cartItems");
    const value = jsonValue != null ? JSON.parse(jsonValue) : [];
    this.setDefaultValue(value);
  };

  setDefaultValue = (value) => {
    this.cartItems = value;
  };

  updateLocalStorage = async () => {
    try {
      const jsonValue = JSON.stringify(this.cartItems);
      await AsyncStorage.setItem("@storage_cartItems", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  addProductToCart = async (product, isBcoin = false) => {
    if (this.cartItems.length === 0) {
      const storage_cartCreatedDate = {
        date: new Date()
      }
      await AsyncStorage.setItem("@storage_cartCreatedDate", JSON.stringify(storage_cartCreatedDate));
    }
    if (isBcoin) {
      this.cartItems.unshift(product);

    } else {
      this.cartItems.push(product);
    }
    this.updateLocalStorage();
  };

  removeProduct = (productId) => {
    this.cartItems = this.cartItems.filter(
      (item, index) => item.data._id.toString() + index !== productId
    );
    this.updateLocalStorage();
  };

  updateCartProduct = (index, product) => {
    this.cartItems[index] = { ...product };
  };

  getProductByIndex = (index) => {
    return JSON.parse(JSON.stringify(this.cartItems[index]));
  };

  updateProductCount = (productId, count) => {

    this.cartItems = this.cartItems.map((item, index) => {
      if (item.data._id.toString() + index === productId) {
        // item.data.price = item.data.price + ((count - item.data.extras.counter.value) * (item.data.price / item.data.extras.counter.value));
        item.data.extras.counter.value = count;
      }
      return item;
    });
    this.updateLocalStorage();
  }

  getProductsCount = () => {
    let count = 0;
    this.cartItems.forEach((product) => {
      if (product) {
        count += product?.others?.count;
      }
    })
    return count;
  };

  generateUniqueHash = (value: any) => {
    var hash = 0,
      i, chr;
    if (value.length === 0) return hash;
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  getHashKey = async (finalOrder: any) => {
    const cartCreatedDate = await AsyncStorage.getItem("@storage_cartCreatedDate");
    const cartCreatedDateValue = JSON.parse(cartCreatedDate);
    const hashObject = {
      finalOrder,
      cartCreatedDateValue: cartCreatedDateValue.date
    };
    return hash(hashObject);
  }

  getCartData = async (order: any) => {
    let finalOrder: TOrder = {
      payment_method: order.paymentMthod,
      receipt_method: order.shippingMethod,
      geo_positioning: order.geo_positioning,
      items: produtsAdapter(order),
    }
    const version = Constants.nativeAppVersion;
    const hashKey = await this.getHashKey(finalOrder);

    const cartData: TCart = {
      order: finalOrder,
      total: order.totalPrice,
      app_language: getCurrentLang() === "ar" ? '0' : '1',
      device_os: Platform.OS === "android" ? "Android" : "iOS",
      app_version: version,
      unique_hash: hashKey,
      datetime: new Date(),
      orderDate: order.orderDate
    }
    return cartData;
  }

  resetCart = () => {
    this.cartItems = [];
    this.updateLocalStorage();
  }

  getProductsImages = (cartData) => {
    const imagesListTemp = cartData.order.items.map((item)=>item.clienImage);
    const imagesList = imagesListTemp.filter(item=>item);
    return imagesList;
  }

  submitOrder = async (order: any): Promise<TOrderSubmitResponse | string> => {
    const cartData = await this.getCartData(order);
      await AsyncStorage.setItem("@storage_orderHashKey", JSON.stringify(cartData.unique_hash));
      const orderBase64 = toBase64(cartData).toString();
      const imagesList = this.getProductsImages(cartData);
      let formData = new FormData();
      const body = cartData;
      formData.append("body", JSON.stringify(body));
      // formData.append("images", JSON.stringify(imagesList));
      imagesList.forEach((image) => {
        const imageObj = {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        };
        formData.append("img", imageObj);
      });
      return axiosInstance
        .post(
          `${ORDER_API.CONTROLLER}/${ORDER_API.SUBMIT_ORDER_API}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then(function (response: any) {
          // const jsonValue: any = JSON.parse(fromBase64(response.data));
          console.log("responseDDD",response)

          // const data: TOrderSubmitResponse = {
          //   has_err: jsonValue.has_err,
          //   order_id: jsonValue.order_id,
          //   salt: jsonValue.salt,
          //   status: jsonValue.status,
          //   code: jsonValue.code,
          // }
          return response;
        })
        .catch(function (error) {
          const data: TOrderSubmitResponse = { has_err: true, order_id: 0, salt: "", status: "", code: 0 }
          return data;
        });

  };

  UpdateCCPayment = ({ order_id, creditcard_ReferenceNumber, datetime }: TUpdateCCPaymentRequest) => {
    const body: TUpdateCCPaymentRequest = {
      order_id,
      creditcard_ReferenceNumber,
      datetime
    }
    return axiosInstance
      .post(
        `${ORDER_API.CONTROLLER}/${ORDER_API.UPDATE_CCPAYMENT_API}`,
        toBase64(body),
      )
      .then(function (response) {
        return JSON.parse(fromBase64(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  isValidGeo = (latitude: number, longitude: number) => {
    const body = {
      latitude,
      longitude,
    }
    return axiosInstance
      .post(
        `${GEO_API.CONTROLLER}/${GEO_API.IS_VALID_GEO_API}`,
        body,
      )
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export const cartStore = new CartStore();
