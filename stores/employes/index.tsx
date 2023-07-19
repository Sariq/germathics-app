import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import {
  STORE_API,
  CALANDER_API,
  TRANSLATIONS_API,
  COURSES_API,
  EMPLOYES_API,
} from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class EmployesStore {
  employesList = [];

  constructor() {
    makeAutoObservable(this);
  }

  getEmployesFromServer = async (ids: any) => {
    return axiosInstance
      .post(`${EMPLOYES_API.ADMIN_GET_EMPLOYES_LIST_API}`, { ids: ids })
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getEmployes = (ids?: any) => {
    return this.getEmployesFromServer(ids).then((res: any) => {
      runInAction(() => {
        console.log("RRRRRRESSS", res);
        this.employesList = res;
      });
      return res;
    });
  };

  updateEmployesFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${TRANSLATIONS_API.CONTROLLER}/${TRANSLATIONS_API.UPDATE_TRANSLATIONS}`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateEmployes = (data: any) => {
    return this.updateEmployesFromServer(data).then((res: any) => {
      runInAction(() => {
        this.employesList = res;
      });
      return res;
    });
  };

  addEmployesFromServer = async (data: any, isEditMode?: boolean) => {
    return axiosInstance
      .post(
        `${
          isEditMode
            ? EMPLOYES_API.ADMIN_UPDATE_EMPLOYE_API
            : EMPLOYES_API.ADMIN_ADD_EMPLOYE_API
        }`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addEmployes = (data: any, isEditMode?: boolean) => {
    return this.addEmployesFromServer(data, isEditMode).then((res: any) => {
      runInAction(() => {
        //this.employesList = res;
      });
      return res;
    });
  };

  addPackageFromServer = async (data: any, isEditMode?: boolean) => {
    return axiosInstance
      .post(
        `${
          isEditMode
            ? EMPLOYES_API.ADMIN_UPDATE_STUDENT_API
            : EMPLOYES_API.ADMIN_ADD_PACKAGE_API
        }`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addPackage = (employeId: any, employePackage: any, isEditMode?: boolean) => {
    return this.addPackageFromServer(
      { employeId, employePackage },
      isEditMode
    ).then((res: any) => {
      runInAction(() => {
        this.employesList = res;
      });
      return res;
    });
  };

  printRecipetFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${
     EMPLOYES_API.ADMIN_PRINT_RECIEPT
        }`,
        data
      )
      .then(function (response) {
        console.log("RRRRRWW", response)
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  printRecipet = (paymentData) => {
    return this.printRecipetFromServer(
      paymentData,
    ).then((res: any) => {
      // runInAction(() => {
      //   this.employesList = res;
      // });
      return res;
    });
  };

  deleteEmployesFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${TRANSLATIONS_API.CONTROLLER}/${TRANSLATIONS_API.DELETE_TRANSLATIONS}`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteEmployes = (data: any) => {
    return this.deleteEmployesFromServer(data).then((res: any) => {
      runInAction(() => {
        this.employesList = res;
      });
      return res;
    });
  };
  
  sendPaymentReportFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${EMPLOYES_API.SEND_PAYMENT_REPORT}`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendPaymentReport = (data: any) => {
    return this.sendPaymentReportFromServer(data).then((res: any) => {
      // runInAction(() => {
      //   this.employesList = res;
      // });
      return res;
    });
  };
}
export const employesStore = new EmployesStore();
