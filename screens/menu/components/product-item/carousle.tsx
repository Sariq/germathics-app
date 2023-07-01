import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../../../stores";
import { ScrollView } from "react-native-gesture-handler";
import Text from "../../../../components/controls/Text";
import themeStyle from "../../../../styles/theme.style";
import { getCurrentLang } from "../../../../translations/i18n";
import * as Haptics from "expo-haptics";
import Button from "../../../../components/controls/button/button";
import { cdnUrl, ORDER_TYPE } from "../../../../consts/shared";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Icon from "../../../../components/icon";

export type TProps = {
  item: any;
  onItemSelect: (item: any) => void;
  onDeleteProduct: (item: any) => void;
  onEditProduct: (item: any) => void;
};
const ProductCarousleItem = ({
  item,
  onItemSelect,
  onDeleteProduct,
  onEditProduct,
}: TProps) => {
  const { t } = useTranslation();

  const {
    userDetailsStore,
    languageStore,
    cartStore,
    ordersStore,
  } = useContext(StoreContext);

  const isDisabled = (item) => {
    return !userDetailsStore.isAdmin() && item.count == 0;
  };
  const isInStore = (item) => {
    return (
      (item.isInStore && item.extras.size.options.large.count > 0) ||
      item.extras.size.options.medium.count > 0
    );
  };

  const getPriceBySize = (product) => {
    return product.extras.size.options[product.extras.size.value].price;
    const size = product.extras.size.options?.filter(
      (size) => size.title === product.extras.size.value
    )[0];
    return size.price;
  };

  const onAddToCart = (prodcut) => {
    // DeviceEventEmitter.emit(`add-to-cart-animate`, {
    //   imgUrl: meal.data.img,
    // });
    // cartStore.resetCart();
    let tmpProduct: any = {};
    tmpProduct.others = { count: 1, note: "" };
    tmpProduct.data = prodcut;
    cartStore.addProductToCart(tmpProduct);
  };

  const handleOnItemsSelect = (item) => {
    if (!isInStore(item)) {
      return;
    }
    // onAddToCart(item)
    onItemSelect(item);
  };

  return (
    <View
      style={{
        height: "85%",
        width: "100%",
        borderRadius: 30,
        marginTop: -40,
      }}
    >
      <TouchableOpacity
        style={[
          {
            borderRadius: 50,
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
            height: 80,
            width: 80,
            alignSelf: "center",
            position: "absolute",
            zIndex: 2,
            marginTop: -40,
          },
        ]}
        onPress={() => handleOnItemsSelect(item)}
      >
        <LinearGradient
          colors={[
            "rgba(198, 202, 207,1)",
            "rgba(236, 238, 239,1)",

            "rgba(255, 255, 255,1)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.background]}
        />
        <Icon
          icon={"shopping-bag"}
          style={{ color: themeStyle.PRIMARY_COLOR }}
          size={45}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleOnItemsSelect(item)}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        activeOpacity={1}
      >
        <View
          style={{
            position: "absolute",
            borderRadius: 30,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <ImageBackground
            source={{ uri: `${cdnUrl}${item.img[0].uri}` }}
            style={{ height: "100%", width: "100%", borderRadius: 30 }}
          >
            <View style={{height:"100%", width:"100%",  alignItems: "center", justifyContent: "center", zIndex:-1 }}>
              <ActivityIndicator size='large' />
            </View>
            <View
              style={{ position: "relative", borderRadius: 30, marginTop: 40}}
            >
              {/* <LinearGradient
                colors={[
                  "rgba(207, 207, 207, 0.4)",
                  "rgba(232, 232, 230, 0.4)",
                  "rgba(232, 232, 230, 0.4)",
                  "rgba(232, 232, 230, 0.4)",
                  "rgba(207, 207, 207, 0.4)",
                ]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background]}
              /> */}
              <Text style={{ textAlign: "center", fontSize: 35 }}>
                {languageStore.selectedLang === "ar"
                  ? item.nameAR
                  : item.nameHE}
              </Text>
              {/* <Text style={{ textAlign: "center", fontSize: 25 }}>
                ₪{getPriceBySize(item) || item.price}
              </Text> */}
            </View>

            {userDetailsStore.isAdmin() && (
              <View
                style={{
                  flexDirection: "column",
                  flex: 5,
                  position: "absolute",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 15,
                    position: "absolute",
                    top: 20,
                    zIndex: 1,
                    right: 0,
                    width: 200,
                  }}
                >
                  <Button
                    bgColor={themeStyle.ERROR_COLOR}
                    text={t("delete")}
                    fontSize={25}
                    onClickFn={() => onDeleteProduct(item)}
                    textPadding={0}
                    marginH={0}
                    textColor={themeStyle.WHITE_COLOR}
                    icon="trash"
                    iconSize={25}
                    iconMargin={5}
                  />
                  <View style={{ marginTop: 20 }}>
                    <Button
                      bgColor={themeStyle.ORANGE_COLOR}
                      text={t("edit")}
                      fontSize={25}
                      onClickFn={() => onEditProduct(item)}
                      textPadding={0}
                      marginH={0}
                      textColor={themeStyle.WHITE_COLOR}
                      icon="pencil"
                      iconSize={25}
                      iconMargin={5}
                    />
                  </View>
                </View>
              </View>
            )}
            {!isInStore(item) && ordersStore.orderType === ORDER_TYPE.now && (
              <View
                style={{ position: "absolute", bottom: "50%", width: "100%" }}
              >
                <LinearGradient
                  colors={[
                    "rgba(207, 207, 207, 0.9)",
                    "rgba(232, 232, 230, 0.9)",
                    "rgba(232, 232, 230, 0.9)",
                    "rgba(232, 232, 230, 0.9)",
                    "rgba(207, 207, 207, 0.9)",
                  ]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.background, { borderRadius: 0 }]}
                />
                <Text
                  style={{
                    color: themeStyle.GRAY_700,
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 40,
                    alignSelf: "center",
                  }}
                >
                  {t("out-of-stock")}
                </Text>
              </View>
            )}
            {userDetailsStore.isAdmin() && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  padding: 10,
                }}
              >
                <LinearGradient
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
                />
                <Text
                  style={{
                    color: themeStyle.GRAY_700,
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 30,
                    alignSelf: "center",
                  }}
                >
                  {t("count-medium")}:{" "}
                  {item.extras.size.options["medium"].count}
                  {"       "}
                  {t("count-large")}: {item.extras.size.options["large"].count}
                </Text>
              </View>
            )}
          </ImageBackground>
        </View>
        <View style={[styles.banner, { alignItems: "center" }]}>
          <LinearGradient
            colors={[
              "rgba(183, 133, 77, 1)",
              "rgba(198, 143, 81, 1)",
              "rgba(215, 156, 86, 1)",
              "rgba(220, 160, 88, 1)",
              "rgba(222, 161, 88, 1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.bannerLinear]}
          />
          <Text
            style={{
              color: "white",
              alignItems: "center",
              fontSize: 30,
              fontFamily: "Rubik-Light",
            }}
          >
            ₪ {getPriceBySize(item) || item.price}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default observer(ProductCarousleItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    // backgroundColor:"#857C74",
    // height:"100%"
  },
  categoryItem: {
    width: "95%",
    //height: 280,
    borderRadius: 30,
    // backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    shadowColor: "#C19A6B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 8,
    paddingBottom: 15,
    alignSelf: "center", // backgroundColor:"#857C74",
  },
  iconContainer: {
    width: "100%",
    height: 150,
  },
  square: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 4,
    height: 150,
    shadowColor: "black",
    width: 150,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 50,
  },
  bannerLinear: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  banner: {
    position: "absolute",
    left: -45,
    top: 20,
    width: 180,
    transform: [{ rotate: "45deg" }],
    // backgroundColor: themeStyle.PRIMARY_COLOR,
    color: "white",
    padding: 8,
    textAlign: "center",
  },
});
