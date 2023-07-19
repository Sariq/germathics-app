import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import "./translations/i18n";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import * as Notifications from "expo-notifications";

import * as Font from "expo-font";
import Constants from "expo-constants";
import RNRestart from "react-native-restart";
import {
  View,
  I18nManager,
  ImageBackground,
  Image,
  DeviceEventEmitter,
  Text,
  Linking,
} from "react-native";
import RootNavigator from "./navigation";
import NetInfo from "@react-native-community/netinfo";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
/* stores*/

import ExpiryDate from "./components/expiry-date";
import Icon from "./components/icon";
import GeneralServerErrorDialog from "./components/dialogs/general-server-error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { observer } from "mobx-react";
import { StoreContext } from "./stores";
import { ordersStore } from "./stores/orders";
import { calanderStore } from "./stores/calander";
import { employesStore } from "./stores/employes";
import { translationsStore } from "./stores/translations";
import InterntConnectionDialog from "./components/dialogs/internet-connection";
import UpdateVersion from "./components/dialogs/update-app-version";
import { SITE_URL, WS_URL } from "./consts/api";
import themeStyle from "./styles/theme.style";
import { isLatestGreaterThanCurrent } from "./helpers/check-version";
import moment from "moment";
import "moment/locale/ar"; // without this line it didn't work
import useWebSocket, { ReadyState } from "react-use-websocket";
import { setTranslations } from "./translations/i18n";
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "./utils/notification";
import { testPrint } from "./helpers/printer/print";
import { cdnUrl } from "./consts/shared";
import _useAppCurrentState from "./hooks/use-app-current-state";

moment.locale("en");

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();
let customARFonts = {
  "ar-Black": require(`./assets/fonts/ar/Black.ttf`),
  "ar-GS-Black-Bold": require(`./assets/fonts/ar/GESSUniqueBold-Bold.otf`),
  "ar-GS-Black-Light": require(`./assets/fonts/ar/GESSUniqueLight-Light.otf`),
  "ar-Bold": require(`./assets/fonts/ar/Bold.otf`),
  "ar-ExtraBold": require(`./assets/fonts/ar/ExtraBold.ttf`),
  "ar-Light": require(`./assets/fonts/ar/Light.otf`),
  "ar-Medium": require(`./assets/fonts/ar/Medium.ttf`),
  "ar-Regular": require(`./assets/fonts/ar/Regular.ttf`),
  "ar-SemiBold": require(`./assets/fonts/ar/Medium.ttf`),
  "ar-Arslan": require(`./assets/fonts/ar/Arslan.ttf`),

  "he-Black": require(`./assets/fonts/he/Black.ttf`),
  "he-Bold": require(`./assets/fonts/he/Bold.ttf`),
  "he-ExtraBold": require(`./assets/fonts/he/ExtraBold.ttf`),
  "he-Light": require(`./assets/fonts/he/Light.ttf`),
  "he-Medium": require(`./assets/fonts/he/Medium.ttf`),
  "he-Regular": require(`./assets/fonts/he/Regular.ttf`),
  "he-SemiBold": require(`./assets/fonts/he/SemiBold.ttf`),
  "he-Arslan": require(`./assets/fonts/ar/Arslan.ttf`),

  "Poppins-Regular": require(`./assets/fonts/shared/Poppins-Regular.ttf`),
  "Rubik-Regular": require(`./assets/fonts/shared/Rubik-Regular.ttf`),
  "Rubik-Medium": require(`./assets/fonts/shared/Rubik-Medium.ttf`),
  "Rubik-Bold": require(`./assets/fonts/shared/Rubik-Bold.ttf`),
  "Rubik-Light": require(`./assets/fonts/shared/Rubik-Light.ttf`),
};

const App = () => {
  const {
    authStore,
    cartStore,
    userDetailsStore,
    menuStore,
    storeDataStore,
    languageStore,
    coursesStore,
    studentsStore
  } = useContext(StoreContext);

  const [assetsIsReady, setAssetsIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isExtraLoadFinished, setIsExtraLoadFinished] = useState(false);
  const [isFontReady, setIsFontReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("123");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [
    isOpenInternetConnectionDialog,
    setIsOpenInternetConnectionDialog,
  ] = useState(false);
  const [isOpenUpdateVersionDialog, setIsOpenUpdateVersionDialog] = useState(
    false
  );

  const getUUID = () => new Date("2011-11-01").getTime();
  const { readyState } = useWebSocket(WS_URL, {
    onOpen: (data) => {
      console.log("connected", data);
    },
    // shouldReconnect: (closeEvent) => true,
    onClose: () => {
      console.log("closed websocket");
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (userDetailsStore.isAdmin()) {
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );

      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          setNotification(notification);
        }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {}
      );

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [userDetailsStore.userDetails]);
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });
  useEffect(() => {
    if (
      lastJsonMessage &&
      lastJsonMessage.type === "new order" &&
      userDetailsStore.isAdmin()
    ) {
      schedulePushNotification({
        data: {
          orderId: 1,
        },
      });
      testPrint([lastJsonMessage.data]);
      ordersStore.updateOrderPrinted(lastJsonMessage.data._id);
      menuStore.getMenu();
    }
  }, [lastJsonMessage, userDetailsStore.userDetails]);

  const printNotPrinted = async () => {
    ordersStore.getOrders(userDetailsStore.isAdmin()).then(async (res) => {
      const notPrintedOrderds = res.filter((order) => !order.isPrinted);
      notPrintedOrderds.forEach((order) => {
        schedulePushNotification({
          data: {
            orderId: 1,
          },
        });
        ordersStore.updateOrderPrinted(order._id);
      });
      if (notPrintedOrderds.length > 0) {
        testPrint(notPrintedOrderds);
      }
    });
  };

  const { currentAppState } = _useAppCurrentState();
  useEffect(() => {
    if (currentAppState === "active" && userDetailsStore.isAdmin()) {
      printNotPrinted();
    }
  }, [currentAppState, userDetailsStore.userDetails]);

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    }
  }, []);

  const cacheImages = (images) => {
    return new Promise((resolve) => {
      const tempImages = images.map(async (image) => {
        if (typeof image === "string") {
          await Image.prefetch(image);
        } else {
          await Asset.fromModule(image).downloadAsync();
        }
      });
      resolve(true);
    });
  };
  const cacheImages2 = (images) => {
    return new Promise(async (resolve) => {
      for (let index = 0; index < images.length; index++) {
        const res = await Image.prefetch(images[index]);
      }
      resolve(true);
    });
  };

  const deleteCreditCardData = async (appversion: string) => {
    const data = await AsyncStorage.getItem("@storage_CCData");
    const ccDetails = JSON.parse(data);
    if (ccDetails && !ccDetails?.cvv) {
      await AsyncStorage.removeItem("@storage_CCData");
    }
  };

  const handleV02 = async (appversion: string) => {
    if (
      appversion === "1.0.0" ||
      appversion === "1.0.1" ||
      appversion === "1.0.2"
    ) {
      setIsOpenUpdateVersionDialog(true);
      return true;
    }
    return false;
  };

  const handleVersions = async () => {
    const appVersion = Constants.nativeAppVersion;
    const currentVersion = await AsyncStorage.getItem("@storage_version");
    deleteCreditCardData(appVersion);
    const flag = await handleV02(appVersion);
    if (flag) {
      return;
    }
    if (
      !currentVersion ||
      isLatestGreaterThanCurrent(appVersion, currentVersion)
    ) {
      await AsyncStorage.setItem("@storage_version", appVersion?.toString());
      return;
    }
  };

  const handleUpdateVersionDialogAnswer = () => {
    Linking.openURL("https://onelink.to/zky772");
  };

  async function prepare() {
    try {
      //authStore.resetAppState()
      // handleVersions();
      // Pre-load fonts, make any API calls you need to do here
      await Font.loadAsync(customARFonts);
      setIsFontReady(true);
 

      //const fetchMenu = menuStore.getMenu();
      //const fetchHomeSlides = menuStore.getSlides();
      //const fetchStoreDataStore = storeDataStore.getStoreData();
      //const fetchTranslations = translationsStore.getTranslations();
      const fetchCourses = coursesStore.getCourses();

      Promise.all([fetchCourses]).then(
        async (responses) => {
          // const tempHomeSlides = storeDataStore.storeData.home_sliders.map(
          //   (slide) => {
          //     return `${cdnUrl}${slide}`;
          //   }
          // );

          // const imageAssets = await cacheImages(tempHomeSlides);

          // if (authStore.isLoggedIn()) {
          //   const fetchUserDetails = userDetailsStore.getUserDetails();
          //   //const fetchOrders = ordersStore.getOrders(userDetailsStore.isAdmin());
          //   userDetailsStore.setIsAcceptedTerms(true);
          //   Promise.all([
          //     fetchUserDetails,
          //     // fetchOrders,
          //   ]).then((res) => {
          //     setAppIsReady(true);
          //     setTimeout(() => {
          //       setIsExtraLoadFinished(true);
          //     }, 400);
          //   });
          //   const imageAssets3 = await cacheImages2(menuStore.categoriesImages["1"]);

          // } else {
          //   setTimeout(async ()=>{
          //  //console.log("categoriesImages",menuStore.categoriesImages["1"])
          //     const imageAssets3 = await cacheImages2(menuStore.categoriesImages["1"]);
          //   //  console.log("Dooooooone")
          //  },1500)

            const data = await AsyncStorage.getItem("@storage_terms_accepted");
            userDetailsStore.setIsAcceptedTerms(JSON.parse(data));
            setAppIsReady(true);
            setTimeout(() => {
              setIsExtraLoadFinished(true);
            }, 400);
          }

   
        // }
      );
      // Artificially delay for two seconds to simulate a slow loading
      // experience. Please remove this if you copy and paste the code!
    } catch (e) {
      console.warn(e);
    } finally {
      // Tell the application to render
      setAssetsIsReady(true);
    }
  }
  useEffect(() => {
    //setTranslations([]);
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOpenInternetConnectionDialog(!state.isConnected);
      if (!state.isConnected) {
        prepare();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    const ExpDatePicjkerChange = DeviceEventEmitter.addListener(
      `PREPARE_APP`,
      prepare
    );
    return () => {
      ExpDatePicjkerChange.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      //await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const loadingPage = () => {
    const version = Constants.nativeAppVersion;
    return (
      <ImageBackground
        source={require("./assets/splash-screen-1.jpeg")}
        resizeMode="stretch"
        style={{ height: "100%", backgroundColor: "white" }}
      >
        <View
          style={{
            bottom: 50,
            flexDirection: "row",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 40,
              marginBottom: 20,
              flexDirection: "row",
            }}
          ></View>

          <Text
            style={{
              position: "absolute",
              bottom: 10,
              marginBottom: 42,
              fontSize: 20,
              color: themeStyle.BROWN_700,
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
              {/* <Icon style={{ width: 80, height: 21 }} icon="moveit" /> */}
            </View>
          </Text>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              marginBottom: 15,
              flexDirection: "row-reverse",
              paddingLeft: 10,
            }}
          >
            {/* <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: themeStyle.BROWN_700,
              }}
            >
              Sari Qashuw{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: themeStyle.BROWN_700,
              }}
            >
              | Sabri Qashuw
            </Text> */}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              marginBottom: 0,
            }}
          >
            {/* <Text style={{ textAlign: "center", color: themeStyle.BROWN_700 }}>
              {version}
            </Text> */}
          </View>
        </View>
        <GeneralServerErrorDialog />
        <InterntConnectionDialog isOpen={isOpenInternetConnectionDialog} />
      </ImageBackground>
    );
  };

  if (!appIsReady) {
    return loadingPage();
  }

  return (
    <View style={{ flex: 1 }}>
      {!isExtraLoadFinished && loadingPage()}
      <StoreContext.Provider
        value={{
          cartStore: cartStore,
          authStore: authStore,
          menuStore: menuStore,
          coursesStore: coursesStore,
          studentsStore: studentsStore,
          languageStore: languageStore,
          userDetailsStore: userDetailsStore,
          storeDataStore: storeDataStore,
          ordersStore: ordersStore,
          calanderStore: calanderStore,
          translationsStore: translationsStore,
          employesStore: employesStore,
        }}
      >
        <View style={{ height: "100%", backgroundColor: "#e0e0e1" }}>
          <RootNavigator />
        </View>
        <ExpiryDate />
        <GeneralServerErrorDialog />
        <InterntConnectionDialog isOpen={isOpenInternetConnectionDialog} />
        <UpdateVersion
          isOpen={isOpenUpdateVersionDialog}
          handleAnswer={handleUpdateVersionDialogAnswer}
        />
      </StoreContext.Provider>
    </View>
  );
};
export default observer(App);
