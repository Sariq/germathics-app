import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
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
import { cdnUrl, ORDER_TYPE, devicesType } from "../../../../consts/shared";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import _useDeviceType from "../../../../hooks/use-device-type";

export type TProps = {
  item: any;
  onItemSelect: (item: any) => void;
  onDeleteProduct: (item: any) => void;
  onEditProduct: (item: any) => void;
};
const ProductItem = ({
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
  const { deviceType } = _useDeviceType();

  const isDisabled = (item) => {
    return !userDetailsStore.isAdmin() && item.count == 0;
  };
  const isInStore = (item) => {
    return item.isInStore;
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

  return (
    <View
      style={{
        height: deviceType === devicesType.tablet ? 420 : 250,
        borderRadius: 30,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        style={[styles.categoryItem, { opacity: isDisabled(item) ? 0.4 : 1 }]}
        delayPressIn={0}
        onPress={() => {
          onItemSelect(item);
        }}
        key={item.id}
        disabled={isDisabled(item)}
      >
        <ImageBackground
          source={{ uri: `${cdnUrl}${item.img[0].uri}` }}
          style={{ height: deviceType === devicesType.tablet ? 350 : 250 }}
          resizeMode={"cover"}
        >
          <View
            style={{
              backgroundColor: "rgba(247,247,247,0.6)",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text
              style={{
                color: themeStyle.GRAY_700,
                marginTop: 5,
                fontSize: 18,
                fontFamily: `${getCurrentLang()}-SemiBold`,
                textAlign: "center",
              }}
            >
              {languageStore.selectedLang === "ar" ? item.nameAR : item.nameHE}
            </Text>
          </View>
          {/* <LinearGradient
          colors={["rgba(250, 249, 248,1)", "rgba(250, 249, 248,1)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.background]}
        /> */}

          {/* <View style={[styles.iconContainer]}>
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
            source={{ uri: `${cdnUrl}${item.img[0].uri}` }}
            resizeMode="stretch"
          />
        </View> */}

          <View
            style={{
              flexDirection: "row",
              marginTop: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8 / -2,
            }}
          >
            {/* <View style={{ paddingHorizontal: 8 / 2 }}>
            <Text
              style={{
                color: themeStyle.GRAY_700,
                fontFamily: `${getCurrentLang()}-SemiBold`,
                fontSize: 20,
              }}
            >
              ₪{item.price}
            </Text>
          </View> */}
            {userDetailsStore.isAdmin() && item.count > 0 && (
              <View style={{ paddingHorizontal: 8 / 2 }}>
                <Text
                  style={{
                    color: themeStyle.GRAY_700,
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 20,
                  }}
                >
                  כמות: {item.count}
                </Text>
              </View>
            )}

            {/* {isInStore(item) && (
            <View>
              {!userDetailsStore.isAdmin() && (
                <Button
                  bgColor={themeStyle.PRIMARY_COLOR}
                  text={"اضف للسله"}
                  fontSize={14}
                  onClickFn={() => onAddToCart(item)}
                  textPadding={0}
                  marginH={0}
                  textColor={themeStyle.WHITE_COLOR}
                  icon="cart_icon"
                  iconSize={15}
                  iconMargin={5}
                />
              )}
            </View>
          )} */}
          </View>
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
                  fontSize: 20,
                  alignSelf: "center",
                }}
              >
                {t("out-of-stock")}
              </Text>
            </View>
          )}
          {userDetailsStore.isAdmin() && (
            <View style={{ flexDirection: "column", flex: 5 }}>
              <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                <Button
                    bgColor={themeStyle.ORANGE_COLOR}
                    text={"edit"}
                  fontSize={14}
                  onClickFn={() => onEditProduct(item)}
                  textPadding={0}
                  marginH={0}
                  textColor={themeStyle.WHITE_COLOR}
                  icon="cart_icon"
                  iconSize={15}
                  iconMargin={5}
                />
              </View>
              <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                <Button
                  bgColor={"red"}
                  text={"delete"}
                  fontSize={14}
                  onClickFn={() => onDeleteProduct(item)}
                  textPadding={0}
                  marginH={0}
                  textColor={themeStyle.WHITE_COLOR}
                  icon="cart_icon"
                  iconSize={15}
                  iconMargin={5}
                />
              </View>
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
                    fontSize: 20,
                    alignSelf: "center",
                  }}
                >
                  כמות רגיל: {item.extras.size.options["medium"].count}
                  {"       "}
                  כמות גדול: {item.extras.size.options["large"].count}
                </Text>
              </View>
            )}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default observer(ProductItem);

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
    overflow: "hidden",
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
    alignSelf: "center", // backgroundColor:"#857C74",
  },
  iconContainer: {
    width: "100%",
    height: "100%",
  },
  square: {
    alignSelf: "center",
    borderRadius: 4,
    height: "100%",
    shadowColor: "black",
    width: 150,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 30,
  },
});
