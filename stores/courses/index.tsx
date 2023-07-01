import { makeAutoObservable, runInAction } from "mobx";
import { axiosInstance } from "../../utils/http-interceptor";
import { STORE_API, CALANDER_API, TRANSLATIONS_API, COURSES_API } from "../../consts/api";
import { fromBase64, toBase64 } from "../../helpers/convert-base64";

class CoursesStore {
  coursesList = null;

  constructor() {
    makeAutoObservable(this);
  }

  getCoursesFromServer = async () => {
    return axiosInstance
      .get(
        `${COURSES_API.ADMIN_GET_COURSE_LIST_API}`,
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCourses = () => {
    return this.getCoursesFromServer().then((res:any) => {
      runInAction(() => {
        this.coursesList = res;
      })
      return res;
    })
  };

  getCoursesByIds = (ids) => {
      const courses = this.coursesList.filter((course)=> ids.indexOf(course._id)>-1)
      return courses;
  };

  updateCoursesFromServer = async (data: any) => {
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

  updateCourses = (data: any) => {
    return this.updateCoursesFromServer(data).then((res:any) => {
      runInAction(() => {
        this.coursesList = res;
      })
      return res;
    })
  };
  
  updateStudentAppearanceFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${COURSES_API.ADMIN_UPDATE_STUDENT_APPEARNCE}`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateStudentAppearance = (data: any) => {
    return this.updateStudentAppearanceFromServer(data).then((res:any) => {
      runInAction(() => {
        this.coursesList = res;
      })
      return res;
    })
  };

  addCoursesFromServer = async (data: any) => {
    return axiosInstance
      .post(
        `${TRANSLATIONS_API.CONTROLLER}/${TRANSLATIONS_API.ADD_TRANSLATIONS}`,
        data
      )
      .then(function (response) {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addCourses = (data: any) => {
    return this.addCoursesFromServer(data).then((res:any) => {
      runInAction(() => {
        this.coursesList = res;
      })
      return res;
    })
  };

  deleteCoursesFromServer = async (data: any) => {
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

  deleteCourses = (data: any) => {
    return this.deleteCoursesFromServer(data).then((res:any) => {
      runInAction(() => {
        this.coursesList = res;
      })
      return res;
    })
  };
}
export const coursesStore = new CoursesStore();
