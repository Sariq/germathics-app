import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import {
  STORE_API,
  CALANDER_API,
  TRANSLATIONS_API,
  COURSES_API,
  STUDENTS_API,
} from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class StudentsStore {
  studentsList = [];
  studentsPayDelay = [];

  constructor() {
    makeAutoObservable(this);
  }

  getStudentsPayDelayFromServer = async (ids: any) => {
    return axiosInstance
      .post(`${STUDENTS_API.ADMIN_GET_STUDENTS_PAY_DELAY_API}`, { ids: ids })
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getStudentsPayDelay = (ids?: any) => {
    return this.getStudentsPayDelayFromServer(ids).then((res: any) => {
      runInAction(() => {
        this.studentsPayDelay = res;
      });
      return res;
    });
  };

  getStudentsFromServer = async (ids: any) => {
    return axiosInstance
      .post(`${STUDENTS_API.ADMIN_GET_STUDENTS_LIST_API}`, { ids: ids })
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getStudents = (ids?: any) => {
    return this.getStudentsFromServer(ids).then((res: any) => {
      runInAction(() => {
        this.studentsList = res;
      });
      return res;
    });
  };

  updateStudentsFromServer = async (data: any) => {
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

  updateStudents = (data: any) => {
    return this.updateStudentsFromServer(data).then((res: any) => {
      runInAction(() => {
        this.studentsList = res;
      });
      return res;
    });
  };

  addStudentsFromServer = async (data: any, isEditMode?: boolean) => {
    return axiosInstance
      .post(
        `${
          isEditMode
            ? STUDENTS_API.ADMIN_UPDATE_STUDENT_API
            : STUDENTS_API.ADMIN_ADD_STUDENT_API
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

  addStudents = (data: any, isEditMode?: boolean) => {
    return this.addStudentsFromServer(data, isEditMode).then((res: any) => {
      runInAction(() => {
        this.studentsList = res;
      });
      return res;
    });
  };

  addPackageFromServer = async (data: any, isEditMode?: boolean) => {
    return axiosInstance
      .post(
        `${
          isEditMode
            ? STUDENTS_API.ADMIN_UPDATE_STUDENT_API
            : STUDENTS_API.ADMIN_ADD_PACKAGE_API
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

  addPackage = (studentId: any, studentPackage: any, isEditMode?: boolean) => {
    return this.addPackageFromServer(
      { studentId, studentPackage },
      isEditMode
    ).then((res: any) => {
      runInAction(() => {
        this.studentsList = res;
      });
      return res;
    });
  };

  printRecipetFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${
     STUDENTS_API.ADMIN_PRINT_RECIEPT
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

  printRecipet = (paymentData) => {
    return this.printRecipetFromServer(
      paymentData,
    ).then((res: any) => {
      // runInAction(() => {
      //   this.studentsList = res;
      // });
      return res;
    });
  };

  deleteStudentsFromServer = async (data: any) => {
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

  deleteStudents = (data: any) => {
    return this.deleteStudentsFromServer(data).then((res: any) => {
      runInAction(() => {
        this.studentsList = res;
      });
      return res;
    });
  };
  
  sendPaymentReportFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${STUDENTS_API.SEND_PAYMENT_REPORT}`,
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
      //   this.studentsList = res;
      // });
      return res;
    });
  };

  resetStudentsList = () =>{
    this.studentsList = [];
  }
}
export const studentsStore = new StudentsStore();
