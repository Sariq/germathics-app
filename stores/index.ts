import { createContext } from "react";
import { cartStore } from "./cart";
import { authStore } from "./auth";
import { menuStore } from "./menu";
import { languageStore } from "./language";
import { storeDataStore } from "./store";
import { userDetailsStore } from "./user-details";
import { ordersStore } from "./orders";
import { calanderStore } from "./calander";
import { translationsStore } from "./translations";
import { coursesStore } from "./courses";
import { studentsStore } from "./students";
import { employesStore } from "./employes";

export const StoreContext = createContext({ 
    cartStore: cartStore, 
    authStore: authStore, 
    menuStore: menuStore, 
    coursesStore: coursesStore, 
    studentsStore: studentsStore, 
    userDetailsStore: userDetailsStore,
    languageStore: languageStore, 
    storeDataStore: storeDataStore,
    ordersStore: ordersStore,
    calanderStore: calanderStore,
    translationsStore: translationsStore,
    employesStore: employesStore,
});