import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/controls/button/button";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { interpolate, withTiming } from "react-native-reanimated";

/* styles */

import { useEffect, useState, useContext, useCallback } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { SITE_URL } from "../../consts/api";
import { getCurrentLang } from "../../translations/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { ORDER_TYPE, cdnUrl } from "../../consts/shared";
import Icon from "../../components/icon";
import PickImagedDialog from "../../components/dialogs/pick-image";

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [homeSlides, setHomeSlides] = useState();
  const [isActiveOrder, setIsActiveOrder] = useState(false);
  const [isHideScreen, setIsHideScreen] = useState(false);
  let {
    userDetailsStore,
    menuStore,
    ordersStore,
    authStore,
    storeDataStore,
  } = useContext(StoreContext);

  const displayTemrsAndConditions = async () => {
    if (!userDetailsStore.isAcceptedTerms) {
      setTimeout(() => {
        navigation.navigate("terms-and-conditions");
      }, 0);
    }
    setIsAppReady(true);
  };
  const goToAdminDashboard = async () => {
    if (userDetailsStore.isAdmin()) {
      setTimeout(() => {
        navigation.navigate("admin-dashboard");
      }, 0);
    }
    setIsAppReady(true);
  };

  useEffect(() => {
    goToAdminDashboard();
    displayTemrsAndConditions();
    const imagesList = storeDataStore.storeData.home_sliders.map(
      (img) => `${img}`
    );
    setHomeSlides(imagesList);
  }, [storeDataStore.storeData]);

  // const getOrders = () => {
  //   if (authStore.isLoggedIn()) {
  //     ordersStore.getOrders(userDetailsStore.isAdmin());
  //   }
  // };

  // useEffect(() => {
  //   if (authStore.isLoggedIn()) {
  //     getOrders();
  //     setTimeout(() => {
  //       getOrders();
  //     }, 15 * 1000);
  //     const interval = setInterval(() => {
  //       getOrders();
  //     }, 60 * 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [authStore.userToken]);

  useEffect(() => {
    if (ordersStore.ordersList) {
      setIsActiveOrder(ordersStore.isActiveOrders());
    }
  }, [ordersStore.ordersList]);

  const onOrderTypeSelect = async (orderType: string) => {
    ordersStore.setOrderType(orderType);
    setIsHideScreen(true);
    navigation.navigate("menuScreen");
    setTimeout(() => {
      setIsHideScreen(false);
    }, 1000);
  };

  const goToNewOrder = () => {
    navigation.navigate("menuScreen");
  };
  const goToOrdersStatus = () => {
    navigation.navigate("orders-status");
  };
  const handleProfileClick = () => {
    if (authStore.isLoggedIn()) {
      navigation.navigate("profile");
    } else {
      navigation.navigate("login");
    }
  };


  const handleSettingsClick = () => {
    navigation.navigate("admin-dashboard");
};

  const animationStyle: any = useCallback((value: number) => {
    "worklet";

    const zIndex = withTiming(interpolate(value, [-1, 0, 1], [10, 20, 30]));
    // const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
    const opacity = withTiming(interpolate(value, [-0.75, 0, 1], [0, 1, 0]), {
      duration: 0,
    });

    return {
      // transform: [{ scale }],
      zIndex,
      opacity,
    };
  }, []);

  if (!isAppReady || !homeSlides) {
    return;
  }
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "transparent",
        display: isHideScreen ? "none" : "flex",
      }}
    >
      <View
        style={{
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 20,

          // backgroundColor: "rgba(255,255,255,0.6)",
        }}
      >
        {userDetailsStore.isAdmin() ? (
          <TouchableOpacity
            onPress={handleSettingsClick}
            style={{
              position: "absolute",
              top: 20,
              zIndex: 10,
              marginTop: 10,
              right:20,
              borderRadius: 30,
              padding: 5,
            }}
          >
              <Icon
            icon="cog"
            size={35}
            style={{ color: themeStyle.PRIMARY_COLOR }}
          />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleProfileClick}
            style={{
              position: "absolute",
              top: -20,
              zIndex: 10,
              marginTop: 10,
              right: -10,
              borderRadius: 30,
              padding: 5,
            }}
          >
            <Image
              source={require("../../assets/pngs/profile.png")}
              style={{ width: 65, height: 65 }}
            />
          </TouchableOpacity>
        )}

        <View style={{ width: "70%", marginTop: 30 }}>
          <Image
            source={require("../../assets/store-logo.png")}
            style={{ width: "100%" }}
            resizeMode="contain"
          />
        </View>
        {/* <View style={{marginTop:15}}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              color: themeStyle.PRIMARY_COLOR,

            }}
          >
تم تحضير المنتج مع الكثير من الشغف والإتقان.. بأيد إحترافية وبأ          </Text>
        </View> */}
        <View
          style={{
            marginTop: 0,
            alignItems: "center",
            width: "100%",
            marginHorizontal: -50,
          }}
        >
          <Image
            source={require("../../assets/home/text.png")}
            resizeMode="contain"
            style={{ width: "100%" }}
          />
          {/* <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              color: "#3c1d12",
              fontFamily: `${getCurrentLang()}-Arslan`,
              maxWidth: 290
            }}
          >
            يتم تحضير المنتج مع الكثير من الشغف والإتقان.. بأيد إحترافية وبأجود
            المواد الخام ، لتستمتعوا أنتم وضيوفكم بمذاق خاص وفريد
          </Text> */}
        </View>
      </View>
      <View style={{ position: "absolute", zIndex: -1, height: "100%" }}>
        <Carousel
          loop
          width={Dimensions.get("window").width}
          height={Dimensions.get("window").height}
          autoPlay={true}
          data={homeSlides}
          scrollAnimationDuration={3000}
          autoPlayInterval={3000}
          customAnimation={animationStyle}
          // mode="parallax"
          renderItem={({ index }) => (
            <View>
              <ImageBackground
                source={{ uri: `${homeSlides[index]}` }}
                style={styles.image}
              />
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                {homeSlides[index].name}
              </Text>
            </View>
          )}
        />
      </View>
      <View
        style={{
          // backgroundColor: "#d6d4d2",
          bottom: 0,
          position: "absolute",
          width: "100%",
          // opacity: 0.9,
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,

          overflow: "hidden",
        }}
      >
        {/* <LinearGradient
          colors={[
            "rgba(207, 207, 207, 0.7)",
            "rgba(232, 232, 230, 0.7)",
            "rgba(232, 232, 230, 0.7)",
            "rgba(232, 232, 230, 0.7)",
            "rgba(207, 207, 207, 0.7)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.background]}
        /> */}

        <ImageBackground
          source={require("../../assets/home/first-page.png")}
          style={{
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            paddingVertical: 20,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/home/signutare.png")}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: 18,
              width: "100%",
              paddingHorizontal: 5,
            }}
          >
            <View style={{ flexBasis: "47%" }}>
              <Button
                text={t("order-now")}
                fontSize={14}
                onClickFn={() => onOrderTypeSelect(ORDER_TYPE.now)}
                // isLoading={isLoading}
                // disabled={isLoading}
                textColor={themeStyle.TEXT_PRIMARY_COLOR}
                bgColor={"transparent"}
              />
            </View>
            <View style={{ flexBasis: "47%" }}>
              <Button
                text={t("order-later")}
                fontSize={14}
                onClickFn={() => onOrderTypeSelect(ORDER_TYPE.later)}
                // isLoading={isLoading}
                // disabled={isLoading}
                textColor={themeStyle.TEXT_PRIMARY_COLOR}
                bgColor={"transparent"}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20 / -2,
  },
  bottomView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
    marginBottom: 60,
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    // paddingRight: 15,
    // paddingTop: 5
    marginHorizontal: 40 / 2,
  },
  image: {
    height: "93%",
    width: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
