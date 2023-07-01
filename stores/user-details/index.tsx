import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { AUTH_API, CUSTOMER_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";
import { menuStore } from "../menu";

type TUserDetails = {
  name: string;
  phone: string;
  isAdmin: boolean;
};

class UserDetailsStore {
  userDetails: TUserDetails = null;
  isAcceptedTerms: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  setIsAcceptedTerms = (flag: boolean) =>{
    this.isAcceptedTerms = flag;
  }

  getUserDetailsFromServer = () => {
    return axiosInstance
      .get(
        `${CUSTOMER_API.CONTROLLER}/${CUSTOMER_API.GET_USER_DETAILS}`,
      )
      .then(function (response) {
        //const res = JSON.parse(fromBase64(response.data));
        return response.data;
      });
  };

  getUserDetails = () => {
    return this.getUserDetailsFromServer().then((res: any)=>{
      const userDetailsTmp: TUserDetails = {
        name: res.fullName,
        phone: res.phone,
        isAdmin: res.isAdmin,
      }
      runInAction(() => {
        this.userDetails = userDetailsTmp;
        //menuStore.updateBcoinPrice();
      });
    })
  };

  isAdmin = () => {
    return this.userDetails?.isAdmin;
  }

  resetUser = () => {
    this.userDetails = null;
  }

}

export const userDetailsStore = new UserDetailsStore();
