import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { STORE_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StoreDataStore {
  paymentCredentials = null;
  storeData = null;

  constructor() {
    makeAutoObservable(this);

  }

  getStoreDataFromServer = async () => {
    return axiosInstance
      .get(
        `${STORE_API.GET_STORE_API}`,
      )
      .then(function (response) {
        const res = response.data;
        return res;
      }).catch((error) => {
        console.log(error);
      })
  };

  getStoreData = () => {
    return this.getStoreDataFromServer().then((res:any) => {
      runInAction(() => {
        // this.storeData = res[0];
        // console.log(this.storeData)
        // this.paymentCredentials = res[0].credentials;
      })
      //return res[0];
      return {};
    })
  };
}

export const storeDataStore = new StoreDataStore();
