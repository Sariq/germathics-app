import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { ORDER_API, CUSTOMER_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";
import { orderBy } from "lodash";
export const inProgressStatuses = ["SENT", "APPROVED"];

class OrdersStore {
  ordersList = null;
  orderType = null;

  constructor() {
    makeAutoObservable(this);
  }

  getOrdersFromServer = async (isAdmin?: boolean) => {
    const api = isAdmin
      ? `${ORDER_API.CONTROLLER}/${ORDER_API.GET_ADMIN_ORDERS_API}`
      : `${CUSTOMER_API.CONTROLLER}/${CUSTOMER_API.GET_CUSTOMER_ORDERS_API}`;

    return axiosInstance
      .get(
        api
      )
      .then(function (response: any) {
        return response;
      });
  };

  getOrders = (isAdmin?: boolean) => {
    return this.getOrdersFromServer(isAdmin).then((res) => {
      // const orderedList = orderBy(res.orders, ["created_at"], ["desc"]);
      runInAction(() => {
        this.ordersList = res;
      });
      return res;
    });
  };


  updateOrderStatusServer = async (status: string,orderId: string) => {
    const api =  `${ORDER_API.CONTROLLER}/${ORDER_API.UPDATE_ADMIN_ORDERS_API}`
    const body = {
      status,
      orderId
    };
    return axiosInstance
      .post(
        api,
        body
      )
      .then(function (response: any) {
        // const res = JSON.parse(fromBase64(response.data));
        return response;
      });
  };

  downloadImage = (url: string)=>{
    return axiosInstance
      .get(
        url
      )
      .then(function (response: any) {
        return response;
      });
  }

  updateOrderStatus = async (order:any) => {
    switch(order.status){
      case "1":
        await this.updateOrderStatusServer("2", order._id);
        break;
      case "2":
      case "3":
        await this.updateOrderStatusServer("4", order._id);
        break;
      default:
        return;
    }
    this.getOrders(true);
  }

  updateOrderPrintedServer = async (orderId: string) => {
    const api =  `${ORDER_API.CONTROLLER}/${ORDER_API.PRINTED_ADMIN_ORDERS_API}`
    const body = {
      orderId
    };
    return axiosInstance
      .post(
        api,
        body
      )
      .then(function (response: any) {
        // const res = JSON.parse(fromBase64(response.data));
        return response;
      });
  };

  updateOrderPrinted = async (orderId:any) => {
    await this.updateOrderPrintedServer(orderId);
    this.getOrders(true);
  }

  isActiveOrders = () => {
    const founded = this.ordersList?.find((order) => {
      if (inProgressStatuses.indexOf(order.status) > -1) {
        return true;
      }
    });
    return !!founded;
  };

  resetOrdersList = () => {
    this.ordersList = [];
  };

  setOrderType = (orderType) => {
    this.orderType = orderType;
  };
}

export const ordersStore = new OrdersStore();
