import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Animated,
  Platform,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import themeStyle from "../../../styles/theme.style";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import { StoreContext } from "../../../stores";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const hideHHeaderScreens = ["homeScreen", "login", "verify-code"];

const yellowBgScreens = ["homeScreen", "terms-and-conditions"];
const hideProfile = ["terms-and-conditions"];
const hideProfileScreens = ["terms-and-conditions"];
const hideLanguageScreens = ["terms-and-conditions"];
const hideCartScreens = ["terms-and-conditions"];
const Header = () => {
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);
  const { cartStore, authStore, userDetailsStore } = useContext(StoreContext);
  const [cartItemsLenght, setCartItemsLength] = useState();
  const [bgColor, setBgColor] = useState(themeStyle.PRIMARY_COLOR);

  useEffect(() => {
    if (
      cartItemsLenght === undefined ||
      cartItemsLenght === cartStore.cartItems.length
    ) {
      setCartItemsLength(cartStore.cartItems.length);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleAnimation();
    setTimeout(() => {
      handleAnimation();
    }, 700);
    setCartItemsLength(cartStore.cartItems.length);
  }, [cartStore.cartItems.length]);

  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    // @ts-ignore
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start(() => {
      rotateAnimation.setValue(0);
    });
  };
  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const interpolateRotating2 = rotateAnimation.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
  });

  const animatedStyle = {
    opacity: interpolateRotating,
    color: themeStyle.PRIMARY_COLOR,
    transform: [{ scale: interpolateRotating2 }],
  };

  useEffect(() => {
    if (
      navigation?.getCurrentRoute()?.name === undefined ||
      yellowBgScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1
    ) {
      setBgColor(themeStyle.PRIMARY_COLOR);
    } else {
      setBgColor(themeStyle.PRIMARY_COLOR);
    }
  }, [routeState]);

  const handleCartClick = () => {
    if (authStore.isLoggedIn()) {
      if (cartStore.getProductsCount() > 0) {
        navigation.navigate("cart");
      }
    } else {
      navigation.navigate("login");
    }
  };
  const handleSideMenuClick = () => {
    if (authStore.isLoggedIn()) {
      if (cartStore.getProductsCount() > 0) {
        navigation.navigate("cart");
      }
    } else {
      navigation.navigate("admin-orders");
    }
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

  const onLogoClick = () => {
    if (navigation?.getCurrentRoute()?.name === "terms-and-conditions") {
      return;
    }
    if (userDetailsStore.isAdmin()) {
      navigation.navigate("admin-dashboard");
    } else {
      navigation.navigate("admin-dashboard");
    }
  };

  const handleLanguageClick = () => {
    navigation.navigate("language");
  };

  const isHideProfile = () => {
    return hideProfileScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1;
  };
  const isHideLanguage = () => {
    return (
      hideLanguageScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1
    );
  };
  const isHideCart = () => {
    return hideCartScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1;
  };

  if (hideHHeaderScreens.indexOf(navigation?.getCurrentRoute()?.name) > -1) {
    return null;
  }
  return (
    <View style={{ ...styles.container }}>
      {/* <LinearGradient
        colors={[
          "rgba(239, 238, 238, 0.9)",
          "rgba(239, 238, 238, 0.8)",
          "rgba(239, 238, 238, 0.8)",
          "rgba(239, 238, 238, 0.8)",
          "rgba(239, 238, 238, 0.8)",
          "rgba(239, 238, 238, 0.9)",
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={[styles.background]}
      /> */}

      <View
        style={{ ...styles.headerItem, }}
      >
        <TouchableOpacity
          onPress={onLogoClick}
        >
          {/* <Icon
            icon="buffalo_icon"
            size={30}
            style={{ color: theme.GRAY_700,  width:100 }}
          /> */}
          <Image
            style={{ width:60, height: "100%" }}
            source={require("../../../assets/germathics-logo.png")}
          />
        </TouchableOpacity>
      </View>
      {/* <Animated.View style={[styles.headerItem, animatedStyle]}>
        <TouchableOpacity
          style={[styles.buttonContainer, { opacity: isHideCart() ? 0 : 1,  alignItems:"center" }]}
          onPress={handleSideMenuClick}
        >
                    <Image
            style={{ width: 80, height: 60,  position: "absolute", left:-26 }}
            source={require("../../../assets/pngs/bag-on.png")}
          />
          <Text style={styles.cartCount}>{cartStore.getProductsCount()}</Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  );
};

export default observer(Header);

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems:"center",
    backgroundColor: themeStyle.WHITE_COLOR
  },
  headerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  cartCount: {
    position: "absolute",
    top: Platform.OS === "ios" ? 2 : 3,
    // fontFamily: "Rubik-Bold",
    // color: themeStyle.BROWN_700,
    left:4,
     fontSize: 15,
      alignSelf:"center",
      width:20, 
      alignItems:"center",
       justifyContent:"center",
      textAlign:"center"
  },
  buttonContainer: {
    padding: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
