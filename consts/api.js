export const SITE_URL = "https://api.buffaloburger.co.il/";

// //PROD
// export const BASE_URL = "https://creme-caramel-app-t5725.ondigitalocean.app/api";
// export const WS_URL = "wss://creme-caramel-app-t5725.ondigitalocean.app";

//DEV
export const BASE_URL = "http://192.168.1.234:1111/api";
export const WS_URL = "ws://192.168.1.234:1111";

// export const BASE_URL = "http://10.0.0.24:1111/api";
// export const WS_URL = "ws://10.0.0.24:1111";

// export const BASE_URL = "http://172.20.10.3:1111/api";
// export const WS_URL = "ws://1172.20.10.3:1111";



export const AUTH_API = {
    CONTROLLER: "Authenticator",
    AUTHINTICATE_API : "Authenticate",
    VERIFY_API : "Verify",
    UPDATE_CUSTOMER_NAME_API : "UpdateCustomerName",
    GET_USER_DETAILS: "GetCustomerInfo",
    LOGOUT_API: "Logout",
    DELETE_ACOOUNT_API: "DeleteAccount"
};
export const CUSTOMER_API = {
    CONTROLLER: "customer",
    CUSTOMER_CREATE_API : "`create",
    VERIFY_API : "validateAuthCode",
    GET_CUSTOMER_ORDERS_API: "orders",
    UPDATE_CUSTOMER_NAME_API : "update-name",
    GET_USER_DETAILS: "details",
    LOGOUT_API: "logout",
    DELETE_ACOOUNT_API: "DeleteAccount"
};
export const COURSES_API = {
    ADMIN_GET_COURSE_LIST_API : "admin/categories",
    ADMIN_GET_COURSE_STUDENTS_LIST_API : "admin/categories",
    ADMIN_ADD_COURSE_API : "admin/categories/add",
    ADMIN_UPDATE_COURSE_API : "admin/categories/update",
    ADMIN_UPDATE_STUDENT_APPEARNCE : "admin/categories/lecture/apperance",
}
export const STUDENTS_API = {
    ADMIN_GET_STUDENTS_LIST_API : "admin/students/",
    ADMIN_ADD_STUDENT_API : "admin/students/add",
    ADMIN_UPDATE_STUDENT_API : "admin/students/update",
    ADMIN_UPDATE_COURSE_API : "admin/categories/update",
}
export const MENU_API = {
    CONTROLLER: "config",
    GET_MENU_API : "menu",
    GET_SLIDER_API : "getAppSliderGallery",
    ADMIN_UPLOAD_IMAGES_API : "admin/images/upload",
    ADMIN_ADD_PRODUCT_API : "admin/product/insert",
    ADMIN_UPDATE_PRODUCT_API : "admin/product/update",
    ADMIN_DELETE_PRODUCT_API : "admin/product/delete",
    GET_IMAGES_BY_CATEGORY : "images",

};
export const ORDER_API = {
    CONTROLLER: "order",
    SUBMIT_ORDER_API : "create",
    GET_ADMIN_ORDERS_API: "admin/orders",
    UPDATE_ADMIN_ORDERS_API: "update",
    PRINTED_ADMIN_ORDERS_API: "printed",
    UPDATE_CCPAYMENT_API: "UpdateCCPayment",
    GET_ORDERS_API : "getorders",
};
export const GEO_API = {
    CONTROLLER: "geo",
    IS_VALID_GEO_API: "isValidGeo",
};
export const STORE_API = {
    CONTROLLER: "Stores",
    GET_STORE_API : "store",
};
export const TRANSLATIONS_API = {
    CONTROLLER: "translations",
    GET_TRANSLATIONS : "getTranslations",
    UPDATE_TRANSLATIONS : "update",
    DELETE_TRANSLATIONS : "delete",
    ADD_TRANSLATIONS : "add",
};
export const CALANDER_API = {
    CONTROLLER: "calander",
    GET_DISABLED_HOURS_BY_DATE_API : "admin/calander/disabled/hours",
    ENABLE_DISABLED_HOUR_API : "admin/calander/enable/hour",
    INSERT_DISABLE_HOUR : "admin/calander/disable/hour/insert",
};

export const UTILITIES_API = {
    CONTROLLER: "Utilities",
    GET_ORDERS_API : "getOrders",
}
