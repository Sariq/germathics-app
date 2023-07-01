import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { observer } from "mobx-react";
import {
  Image,
  View,
  StyleSheet,
  Linking,
  Platform,
  Animated,
  LayoutAnimation,
  DeviceEventEmitter,
  ImageBackground,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import DashedLine from "react-native-dashed-line";
import { LinearGradient } from "expo-linear-gradient";

/* styles */
import theme from "../../styles/theme.style";
import * as Location from "expo-location";
import { StoreContext } from "../../stores";
import Counter from "../../components/controls/counter";
import Text from "../../components/controls/Text";
import Icon from "../../components/icon";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import BackButton from "../../components/back-button";
import NewPaymentMethodDialog from "../../components/dialogs/new-credit-card";
import {
  TOrderSubmitResponse,
  TUpdateCCPaymentRequest,
} from "../../stores/cart";
import { TCCDetails } from "../../components/credit-card/api/validate-card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import chargeCreditCard, {
  TPaymentProps,
} from "../../components/credit-card/api/payment";
import Button from "../../components/controls/button/button";
import LocationIsDisabledDialog from "../../components/dialogs/location-is-disabled";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";
import themeStyle from "../../styles/theme.style";
import InvalidAddressdDialog from "../../components/dialogs/invalid-address";
import StoreIsCloseDialog from "../../components/dialogs/store-is-close";
import PaymentFailedDialog from "../../components/dialogs/payment-failed";
import { menuStore } from "../../stores/menu";
import BarcodeScannerCMP from "../../components/barcode-scanner";
import OpenBarcodeScannerdDialog from "../../components/dialogs/barcode-scanner/open-barcode-scannte";
import BarcodeScannedDialog from "../../components/dialogs/barcode-scanner/barcode-scanned";
import RecipetNotSupportedDialog from "../../components/dialogs/recipet-service/recipet-not-supported";
import StoreErrorMsgDialog from "../../components/dialogs/store-errot-msg";
import DeliveryMethodDialog from "../../components/dialogs/delivery-method";
import {
  SHIPPING_METHODS,
  bcoindId,
  cdnUrl,
  ORDER_TYPE,
} from "../../consts/shared";
import { ToggleButton } from "react-native-paper";
import { transparent } from "react-native-paper/lib/typescript/styles/colors";
import PickTimeDialog from "../../components/dialogs/pick-time";
import moment from "moment";
const barcodeString = "https://onelink.to/zky772";

const PAYMENT_METHODS = {
  creditCard: "CREDITCARD",
  cash: "CASH",
};
type TShippingMethod = {
  shipping: string;
  takAway: string;
};

const icons = {
  bagOff: require("../../assets/pngs/buy-off.png"),
  bagOn: require("../../assets/pngs/buy-on.png"),
  deliveryOff: require("../../assets/pngs/delivery-off.png"),
  deliveryOn: require("../../assets/pngs/delivery-on.png"),
  ccOn: require("../../assets/pngs/card-on.png"),
  ccOff: require("../../assets/pngs/card-off.png"),
};

const CartScreen = () => {
  const { t } = useTranslation();
  const {
    cartStore,
    authStore,
    languageStore,
    storeDataStore,
    userDetailsStore,
    ordersStore,
  } = useContext(StoreContext);
  const [
    locationPermissionStatus,
    requestPermission,
  ] = Location.useForegroundPermissions();
  const navigation = useNavigation();

  const [shippingMethod, setShippingMethod] = React.useState(
    SHIPPING_METHODS.takAway
  );
  const [paymentMthod, setPaymentMthod] = React.useState(PAYMENT_METHODS.cash);

  const [isShippingMethodAgrred, setIsShippingMethodAgrred] = React.useState(
    false
  );
  const [
    isOpenShippingMethodDialog,
    setIsOpenShippingMethodDialog,
  ] = React.useState(false);

  const [
    isOpenLocationIsDisabledDialog,
    setIsOpenLocationIsDisableDialog,
  ] = React.useState(false);
  const [
    isOpenNewCreditCardDialog,
    setOpenNewCreditCardDialog,
  ] = React.useState(false);

  const [ccData, setCCData] = React.useState<TCCDetails | undefined>();

  const [itemsPrice, setItemsPrice] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [bcoinUpdatePrice, setBcoinUpdatePrice] = React.useState(0);

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [showStoreIsCloseDialog, setShowStoreIsCloseDialog] = useState(false);
  const [selectedOrderDate, setSelectedOrderDate] = useState();
  const [showPickTimeDialog, setShowPickTimeDialog] = useState(false);
  const [showPaymentFailedDialog, setShowPaymentFailedDialog] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState();
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [isOpenBarcodeSacnnerDialog, stIsOpenBarcodeSacnnerDialog] = useState(
    false
  );
  const [isOpenBarcodeSacnnedDialog, stIsOpenBarcodeSacnnedDialog] = useState(
    false
  );
  const [
    isOpenRecipetNotSupportedDialog,
    setIOpenRecipetNotSupportedDialog,
  ] = useState(false);
  const [isOpenStoreErrorMsgDialog, setIsOpenStoreErrorMsgDialog] = useState(
    false
  );
  const [barcodeSacnnedDialogText, setBarcodeSacnnedDialogText] = useState("");
  const [recipetSupportText, setRecipetSupportText] = useState({
    text: "",
    icon: null,
  });
  const [storeErrorText, setStoreErrorText] = useState("");
  const [isLoadingOrderSent, setIsLoadingOrderSent] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isPickTime, setIsPickTime] = useState(false);
  const [
    isOpenInvalidAddressDialod,
    setIsOpenInvalidAddressDialod,
  ] = React.useState(false);

  useEffect(() => {
    //cartStore.resetCart();

    let bcoinPrice = 0;
    const shippingPrice =
      shippingMethod === SHIPPING_METHODS.shipping ? deliveryPrice : 0;
    setTotalPrice(shippingPrice + itemsPrice);
  }, [shippingMethod, itemsPrice]);

  useEffect(() => {
    if (shippingMethod === SHIPPING_METHODS.shipping) {
      askForLocation();
    }
  }, [shippingMethod]);

  useEffect(() => {
    if (paymentMthod === PAYMENT_METHODS.creditCard && !ccData) {
      setOpenNewCreditCardDialog(true);
    }
  }, [paymentMthod]);

  useEffect(() => {
    if (cartStore.cartItems.length === 0) {
      navigation.navigate("homeScreen");
      return;
    }
    if (cartStore.cartItems.length === 1 && isBcoinInCart()) {
      const bcoinMeal = {
        data: menuStore.categories["OTHER"][0],
        others: { count: 1, note: "" },
      };
      cartStore.removeProduct(getProductIndexId(bcoinMeal, 0));

      navigation.navigate("homeScreen");
      return;
    }
    let tmpOrderPrice = 0;
    cartStore.cartItems.forEach((item) => {
      if (item && item.data.id !== bcoindId) {
        tmpOrderPrice +=
          (getPriceBySize(item) || item.data.price) *
          item.data.extras.counter.value;
      }
    });
    setItemsPrice(tmpOrderPrice);
  }, [cartStore.cartItems]);

  const getCCData = async () => {
    //await AsyncStorage.setItem("@storage_CCData","");
    const data = await AsyncStorage.getItem("@storage_CCData");
    setCCData(JSON.parse(data));
  };

  useEffect(() => {
    getCCData();
  }, []);

  const [isloadingLocation, setIsloadingLocation] = useState(false);

  const askForLocation = async (isValidation?: boolean) => {
    // const res = await Location.hasServicesEnabledAsync();
    if (location) {
      return location;
    } else {
      isValidation && setIsloadingLocation(true);
      const permissionRes = requestPermission();
      const res = await Location.hasServicesEnabledAsync();
      if (res) {
        let tempLocation = await Location.getCurrentPositionAsync({
          accuracy:
            Platform.OS === "android"
              ? Location.Accuracy.Highest
              : Location.Accuracy.Highest,
          mayShowUserSettingsDialog: false,
        });
        if (tempLocation) {
          setLocation(tempLocation);
          setRegion({
            latitude: tempLocation.coords.latitude,
            latitudeDelta: 0.01,
            longitude: tempLocation.coords.longitude,
            longitudeDelta: 0.01,
          });
        }

        isValidation && setIsloadingLocation(false);
        return tempLocation;
      } else {
        return null;
      }
    }
  };

  const getProductIndexId = (product, index) => {
    if (product) {
      return product?.data._id.toString() + index;
    }
  };

  const onCounterChange = (product, index, value) => {
    cartStore.updateProductCount(getProductIndexId(product, index), value);
  };
  const itemRefs = useRef([]);

  const [itemToRemove, setItemToRemove] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const onRemoveProduct = (product, index) => {
    if (isAnimating) {
      return false;
    }
    setIsAnimating(true);
    setItemToRemove(getProductIndexId(product, index));

    handleAnimation();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      // Remove the item from the list
    });

    setTimeout(() => {
      cartStore.removeProduct(getProductIndexId(product, index));
      setIsAnimating(false);
    }, 600);
  };

  const isStoreSupport = (key: string) => {
    return storeDataStore.getStoreData().then((res) => {
      console.log(res)
      setDeliveryPrice(res.delivery_price);
      return res[key];
    });
  };

  const isStoreAvailable = () => {
    return storeDataStore.getStoreData().then((res) => {
      return {
        ar: res["invalid_message_ar"],
        he: res["invalid_message_he"],
        isOpen: res.alwaysOpen || res.isOpen,
        isBusy: false,
      };
    });
  };

  const isErrMessage = async () => {
    let data = await isStoreAvailable();
    if (data.ar || data.he) {
      setStoreErrorText(data[getCurrentLang()]);
      setIsOpenStoreErrorMsgDialog(true);
    }
    return data;
  };

  const validateAdress = async () => {
    return new Promise(async (resolve) => {
      const addressLocation = await askForLocation(true);
      if (addressLocation) {
        cartStore
          .isValidGeo(
            addressLocation.coords.latitude,
            addressLocation.coords.longitude
          )
          .then((res: any) => {
            if (res.data) {
              setIsValidAddress(res.data);
              setIsOpenInvalidAddressDialod(!res.data);
              resolve(res.data);
            }
          });
      } else {
        setIsOpenLocationIsDisableDialog(true);
        resolve(false);
      }
    });
  };
  const onPickTime = async () => {
    setShowPickTimeDialog(true);
  };
  const onSendCart = async () => {
    console.log("onSendCart");
    const isLoggedIn = authStore.isLoggedIn();
    if (true || isLoggedIn) {
      const data: any = {}; //await isErrMessage();
      if (true || !(data.ar || data.he)) {
        if (true || data.isOpen) {
          if (shippingMethod === SHIPPING_METHODS.shipping) {
            const isValid = await validateAdress();
            if (isValid) {
              if (!isShippingMethodAgrred) {
                setIsOpenShippingMethodDialog(true);
                return;
              } else {
                submitCart();
              }
            } else {
              setIsOpenInvalidAddressDialod(true);
            }
          } else {
            console.log("submitCartx");

            if (shippingMethod === SHIPPING_METHODS.takAway) {
              submitCart();

              //setIsOpenShippingMethodDialog(true);
            } else {
              if (shippingMethod === SHIPPING_METHODS.table) {
                setIsOpenShippingMethodDialog(true);
              } else {
                submitCart();
              }
            }
          }
        } else {
          setShowStoreIsCloseDialog(true);
        }
      }
    } else {
      navigation.navigate("login");
    }
  };

  const chargeOrder = (chargeData: TPaymentProps) => {
    chargeCreditCard(chargeData).then((resCharge) => {
      console.log("chargeCreditCardresCharge", resCharge);

      const updateCCData: TUpdateCCPaymentRequest = {
        order_id: chargeData.orderId,
        creditcard_ReferenceNumber: resCharge.ReferenceNumber,
        datetime: new Date(),
      };
      cartStore.UpdateCCPayment(updateCCData).then((res) => {
        if (resCharge.HasError) {
          console.log("resChargeHasError", resCharge);

          setPaymentErrorMessage(resCharge.ReturnMessage);
          setShowPaymentFailedDialog(true);
          setIsLoadingOrderSent(false);
          return;
        }
        if (res.has_err) {
          console.log("chargeOrderhas_err", res);

          setShowPaymentFailedDialog(true);
          return;
        }
        console.log("AAA");
        postChargeOrderActions();
      });
    });
  };

  const postChargeOrderActions = () => {
    console.log("postChargeOrderActions");

    setIsLoadingOrderSent(false);
    cartStore.resetCart();
    navigation.navigate("orders-status");
  };
  const postSubmitOrderActions = (orderData: TOrderSubmitResponse) => {
    console.log("postSubmitOrderActions");

    if (paymentMthod === PAYMENT_METHODS.creditCard) {
      // TODO handle credit card

      const chargeData: TPaymentProps = {
        token: ccData.ccToken,
        id: ccData.id,
        totalPrice: totalPrice,
        orderId: orderData.order_id,
        email: ccData?.email,
        cvv: ccData?.cvv,
        phone: userDetailsStore?.userDetails?.phone,
        userName: userDetailsStore?.userDetails?.name,
      };
      console.log("chargeData", chargeData);
      chargeOrder(chargeData);
    } else {
      postChargeOrderActions();
    }
  };
  const submitCart = () => {
    setIsLoadingOrderSent(true);
    const order: any = {
      paymentMthod,
      shippingMethod,
      totalPrice,
      products: cartStore.cartItems,
      bcoinUpdatePrice,
      orderDate: selectedOrderDate,
    };

    if (shippingMethod === SHIPPING_METHODS.shipping) {
      order.geo_positioning = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }
    //cartStore.addOrderToHistory(order,userDetailsStore.userDetails.phone);
    cartStore.submitOrder(order).then((res: TOrderSubmitResponse | any) => {
      console.log("submitOrder");
      if (res == "sameHashKey") {
        if (paymentMthod === PAYMENT_METHODS.creditCard) {
        }
      }
      if (res?.has_err) {
        DeviceEventEmitter.emit(`OPEN_GENERAL_SERVER_ERROR_DIALOG`, {
          show: true,
        });
      }
      postSubmitOrderActions(res);
    });
  };

  const onEditProduct = (index) => {
    navigation.navigate("meal", { index });
  };

  const handleLocationIsDiabledAnswer = (value: boolean) => {
    if (value) {
      Platform.OS === "android"
        ? Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS")
        : Linking.openURL("App-Prefs:Privacy&path=LOCATION");
    } else {
      setIsOpenLocationIsDisableDialog(false);
      setShippingMethod(SHIPPING_METHODS.takAway);
    }
    setIsloadingLocation(false);
  };
  const handleShippingMethoAnswer = (value: boolean) => {
    setIsOpenShippingMethodDialog(value);
    setIsShippingMethodAgrred(value);
    setIsLoadingOrderSent(value);
    if (value) {
      submitCart();
    }
  };
  const handleInvalidLocationAnswer = (value: boolean) => {
    setIsOpenInvalidAddressDialod(false);
  };
  const handleStoreIsCloseAnswer = (value: boolean) => {
    setShowStoreIsCloseDialog(false);
  };
  const handleTimeSelectedAnswer = (value: boolean) => {
    setSelectedOrderDate(value);
    setShowPickTimeDialog(false);
  };
  const handlePaymentFailedAnswer = (value: boolean) => {
    setShowPaymentFailedDialog(false);
    setIsLoadingOrderSent(false);
    setIsOpenShippingMethodDialog(false);
  };
  const handleNewPMAnswer = (value: any) => {
    if (value === "close") {
      setPaymentMthod(PAYMENT_METHODS.cash);
      setOpenNewCreditCardDialog(false);
      return;
    }
    setOpenNewCreditCardDialog(false);
    getCCData();
  };

  const replaceCreditCard = () => {
    setOpenNewCreditCardDialog(true);
  };

  const filterMealExtras = (extras) => {
    const filteredExtras = extras.filter((extra) => {
      if (extra.available_on_app) {
        if (extra.type === "CHOICE" && !extra.multiple_choice) {
          if (extra.value !== false && extra.value !== extra.isdefault) {
            return extra;
          }
          return false;
        }
        if (extra.type === "COUNTER") {
          if (extra.counter_init_value !== extra.value) {
            return extra;
          }
          return false;
        }
        if (extra.type === "CHOICE" && extra.multiple_choice) {
          if (
            extra.isdefault !== extra.value &&
            extra.value !== extra.isdefault
          ) {
            return extra;
          }
          return false;
        }
      }
    });

    return filteredExtras;
  };

  // extra.value &&
  // extra.isdefault != extra.value &&
  // extra.counter_init_value != extra.value
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const handleAnimation = () => {
    // @ts-ignore
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 1000,
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
    outputRange: [0, -6000],
  });

  const animatedStyle = {
    opacity: interpolateRotating,
    color: themeStyle.PRIMARY_COLOR,
    transform: [{ translateX: interpolateRotating2 }],
    borderRadius: 20,
  };

  const isBcoinProduct = (product) => {
    return product.data._id === bcoindId;
  };

  const isBcoinInCart = () => {
    const bcoinFound = cartStore.cartItems.find(
      (product) => product.data._id === bcoindId
    );
    return bcoinFound;
  };

  const renderExtras = (filteredExtras, extrasLength, key) => {
    return (
      <View>{renderFilteredExtras(filteredExtras, extrasLength, key)}</View>
    );
  };

  const handleBarcodeAnswer = (answer: string) => {
    setIsBarcodeOpen(false);
    if (answer === "canceled") {
      setBarcodeSacnnedDialogText("scann-canceled");
      setShippingMethod(SHIPPING_METHODS.takAway);
    } else {
      if (answer != barcodeString) {
        setBarcodeSacnnedDialogText("wrong-barcode");
        setShippingMethod(SHIPPING_METHODS.takAway);
      } else {
        setBarcodeSacnnedDialogText("scanned-succefully");
      }
    }
    stIsOpenBarcodeSacnnedDialog(true);
  };
  const handleOpenBarcodeScannerAnswer = (answer: string) => {
    setIsBarcodeOpen(true);
    stIsOpenBarcodeSacnnerDialog(false);
  };
  const handleOpenBarcodeScannedAnswer = (answer: string) => {
    stIsOpenBarcodeSacnnedDialog(false);
  };

  const handleDeliverySelect = async (value) => {
    console.log(value)
    if(value !== SHIPPING_METHODS.takAway){
      const isSupported = await isStoreSupport("delivery_support");
      if (!isSupported) {
        setRecipetSupportText({
          text: "shipping-not-supported",
          icon: "shipping_icon",
        });
        setIOpenRecipetNotSupportedDialog(true);
        setShippingMethod(SHIPPING_METHODS.takAway);
        return;
      }
      setShippingMethod(SHIPPING_METHODS.shipping);
    }else{
      setShippingMethod(SHIPPING_METHODS.takAway);
    }
  
  };
  const handleTableSelect = async () => {
    setIsBarcodeOpen(false);
    setShippingMethod(SHIPPING_METHODS.table);
    const isSupported = await isStoreSupport("table_support");
    if (!isSupported) {
      stIsOpenBarcodeSacnnerDialog(true);
    }
  };
  const handleCreditCardSelected = async () => {
    const isSupported = await isStoreSupport("creditcard_support");
    if (!isSupported) {
      setRecipetSupportText({
        text: "creditcard-not-supported",
        icon: "delivery-icon",
      });
      setIOpenRecipetNotSupportedDialog(true);
      setPaymentMthod(PAYMENT_METHODS.cash);
      return;
    }
    setPaymentMthod(PAYMENT_METHODS.creditCard);
  };

  const handleRecipetNotSupportedAnswer = () => {
    setIOpenRecipetNotSupportedDialog(false);
  };
  const handleStoreErrorMsgAnswer = () => {
    setIsOpenStoreErrorMsgDialog(false);
  };

  const removeCreditCard = async () => {
    await AsyncStorage.removeItem("@storage_CCData");
    setCCData(null);
    setPaymentMthod(PAYMENT_METHODS.cash);
  };

  const isPickTimeValid = () => {
    if (ordersStore.orderType === ORDER_TYPE.later) {
      return !selectedOrderDate;
    }
    return false;
  };

  const getPriceBySize = (product) => {
    return product.data.extras.size.options[product.data.extras.size.value]
      .price;

    const size = product.data.extras.size.options?.filter(
      (size) => size.title === product.data.extras.size.value
    )[0];
    return size?.price;
  };

  let extrasArray = [];
  const renderFilteredExtras = (filteredExtras, extrasLength, key) => {
    return filteredExtras.map((extra, tagIndex) => {
      extrasArray.push(extra.id);
      return (
        <View>
          {/* <View
              style={{
                borderWidth: 1,
                width: 1,
                height: 20,
                position: "absolute",
                top: 10,
                left: 3,
                borderColor: themeStyle.PRIMARY_COLOR,
              }}
            ></View> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                height: 8,
                width: 8,
                backgroundColor: themeStyle.PRIMARY_COLOR,
                borderRadius: 100,
                marginRight: 5,
              }}
            ></View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {extra.value === false && (
                <Text
                  style={{
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 14,
                    color: themeStyle.SUCCESS_COLOR,
                    marginRight: 2,
                  }}
                >
                  {t("without")}
                </Text>
              )}
              <Text
                style={{
                  textAlign: "left",
                  fontFamily: `${getCurrentLang()}-SemiBold`,
                  fontSize: 14,
                  color: themeStyle.SUCCESS_COLOR,
                }}
              >
                {menuStore.translate(extra.name)} {extra.value}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };
  const getCardIcon = (type: string) => {
    //mastercard
    // american-express
    // visa
  };
  return (
    <View style={{ position: "relative", height: "100%", flex: 1, bottom: 0 }}>
      {/* <LinearGradient
        colors={["#c1bab3", "#efebe5", "#d8d1ca", "#dcdcd4", "#ccccc4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.background]}
      /> */}
      <ScrollView style={{ height: "100%" }}>
        <View style={{ ...styles.container }}>
          <View style={{ paddingHorizontal: 20 }}>
            {/* <View style={styles.backContainer}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 10,
                  marginLeft: 10,
                }}
              >
                <BackButton />
              </View>
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {t("meals")} {cartStore.getProductsCount()}
                </Text>
              </View>
            </View> */}

            <View style={{ marginTop: 0 }}>
              {/* <LinearGradient
                colors={[
                  "rgba(239, 238, 238, 0)",
                  "rgba(239, 238, 238, 0.6)",

                  "rgba(239, 238, 238, 0.6)",
                  "rgba(239, 238, 238, 0.6)",

                  "rgba(239, 238, 238, 0)",
                ]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={[
                  styles.background,
                  { marginTop: 30, marginBottom: -30 },
                ]}
              /> */}
              {cartStore.cartItems.map(
                (product, index) =>
                  product && (
                    <View
                      style={{
                        borderRadius: 20,
                        marginTop: 25,
                        overflow:"hidden",
                      }}
                    >
                      <Animated.View
                        style={
                          getProductIndexId(product, index) === itemToRemove
                            ? animatedStyle
                            : null
                        }
                      >
                        <LinearGradient
                          colors={[
                            "rgba(207, 207, 207, 0.4)",
                            "rgba(246,246,247, 0.8)",
                            "rgba(246,246,247, 0.8)",
                
                            "rgba(207, 207, 207, 0.4)",
                          ]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.background]}
                        />
                        <View
                          ref={itemRefs[getProductIndexId(product, index)]}
                          style={{
                            // borderColor: "#707070",
                            // borderColor: "rgba(112,112,112,0.1)",
                            shadowColor: "#C19A6B",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 3.84,
                            elevation: 8,
                            borderRadius: 20,
                            overflow: "hidden",
                            // backgroundColor: "#c1bab3"
                            // "radial-gradient(circle, rgba(121,117,119,0.5) 100%, rgba(88,88,88,0.5) 100%)",
                          }}
                          key={getProductIndexId(product, index)}
                        >
                          {/* <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: "left",
                                      fontFamily: `${getCurrentLang()}-Bold`,
                                      fontSize: 20,
                                      marginLeft: isBcoinProduct(product)
                                        ? 10
                                        : 0,
                                      color: themeStyle.BROWN_700,
                                    }}
                                  >
                                    {
                                      product.data.name
                                    }
                                  </Text>
                                </View>
                              </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{ width: "100%", flexDirection: "row" }}
                            >
                              <View
                                style={{
                                  width: 130,
                                  height: 150,
                                }}
                              >
                                <Image
                                  style={{
                                    width: "90%",
                                    height: "100%",
                                    marginLeft: 0,
                                    borderRadius: 20,
                                  }}
                                  source={{
                                    uri: `${cdnUrl}${product.data.img[0].uri}`,
                                  }}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  padding: 15,
                                }}
                              >
                                <View
                                  style={{
                                    marginTop: -5,
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    flexBasis: "40%",
                                  }}
                                >
                                  <Text style={{ textAlign: "left", fontSize:18 }}>
                                    {languageStore.selectedLang === "ar"
                                      ? product.data.nameAR
                                      : product.data.nameHE}{" "}
                                    {product.data.extras.size.value === "medium"
                                      ? ""
                                      : `- ${t(
                                          product.data.extras.size.value
                                        )}`}
                                  </Text>

                                  <View style={{}}>
                                    <View style={{ flexDirection: "row" }}>
                                      <View style={{ flexBasis: "35%" }}>
                                        <Counter
                                          value={
                                            product.data.extras.counter.value
                                          }
                                          minValue={1}
                                          onCounterChange={(value) => {
                                            onCounterChange(
                                              product,
                                              index,
                                              value
                                            );
                                          }}
                                        />
                                      </View>
                                    </View>
                                  </View>

                                  {/* {product.extras &&
                                      Object.keys(product.extras).map(
                                        (key, extraIndex) => {
                                          if (key === "orderList") {
                                            return;
                                          }
                                          const filteredExtras = filterMealExtras(
                                            product.extras[key]
                                          );
                                          return (
                                            filteredExtras.length > 0 &&
                                            renderExtras(
                                              filteredExtras,
                                              Object.keys(product.extras)
                                                .length,
                                              key
                                            )
                                          );
                                        }
                                      )} */}
                                </View>
                                <View
                                  style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    marginTop: 0,
                                    flexBasis: "20%",
                                    alignItems: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 17,
                                        color: themeStyle.BROWN_700,
                                        fontFamily: "Rubik-Bold",
                                      }}
                                    >
                                      {(getPriceBySize(product) ||
                                        product.data.price) *
                                        product.data.extras.counter.value}
                                    </Text>
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 17,
                                        color: themeStyle.BROWN_700,
                                      }}
                                    >
                                      ₪
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <View
                                style={{
                                  position: "absolute",
                                  right: -10,
                                  top: -10,
                                }}
                              >
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: themeStyle.WHITE_COLOR,
                                      height: 45,
                                      borderRadius: 20,
                                      width: 50,
                                      alignItems: "flex-end",
                                    }}
                                    onPress={() => {
                                      onRemoveProduct(product, index);
                                    }}
                                  >
                                    {/* <Icon
                                      icon="trash"
                                      size={20}
                                      style={{
                                        right: 20,
                                        top: 17,
                                        color: "white",
                                      }}
                                    /> */}
                                    <Text
                                      style={{
                                        color: themeStyle.PRIMARY_COLOR,
                                        right: 23,
                                        top: 17,
                                        fontSize:20, fontWeight:'900',
                                        fontFamily: `${getCurrentLang()}-GS-Black-Bold`
                                      }}
                                    >
                                      X
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>

                              <View
                                style={{
                                  position: "absolute",
                                  right: -10,
                                  bottom: -12,
                                }}
                              >
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: themeStyle.WHITE_COLOR,
                                      height: 45,
                                      borderRadius: 20,
                                      width: 50,
                                      alignItems: "flex-end",
                                    }}
                                    onPress={() => {
                                      //onRemoveProduct(product, index);
                                      onEditProduct(index);
                                    }}
                                  >
                                    <Icon
                                      icon="pencil"
                                      size={18}
                                      style={{
                                        right: 20,
                                        top: 8,
                                        color: themeStyle.PRIMARY_COLOR,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                          {product.others.note && (
                            <View
                              style={{
                                flexDirection: "row",
                                paddingHorizontal: 15,
                                paddingTop: 5,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  paddingRight: 2,
                                  fontFamily: `${getCurrentLang()}-SemiBold`,
                                  color: themeStyle.SUCCESS_COLOR,
                                }}
                              >
                                {t("note")}:
                              </Text>
                              <Text
                                style={{
                                  fontFamily: `${getCurrentLang()}-SemiBold`,
                                  color: themeStyle.BROWN_700,
                                }}
                              >
                                {product.others.note}
                              </Text>
                            </View>
                          )}
                          {/* <View
                                style={{
                                  paddingHorizontal: 15,
                                  marginTop: 10,
                                }}
                              >
                                <DashedLine
                                  dashLength={5}
                                  dashThickness={1}
                                  dashGap={5}
                                  dashColor={themeStyle.GRAY_300}
                                />
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 10,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        marginRight: 15,
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          padding: 5,
                                        }}
                                        onPress={() => {
                                          onEditProduct(index);
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 20,
                                            fontFamily: `${getCurrentLang()}-SemiBold`,
                                            color: themeStyle.BROWN_700,
                                          }}
                                        >
                                          {t("edit")}
                                        </Text>
                                        <View>
                                          <Icon
                                            icon="edit"
                                            size={20}
                                            style={{ color: theme.GRAY_700 }}
                                          />
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          padding: 5,
                                        }}
                                        onPress={() => {
                                          onRemoveProduct(product, index);
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 20,
                                            fontFamily: `${getCurrentLang()}-SemiBold`,
                                            height: "100%",
                                            color: themeStyle.BROWN_700,
                                          }}
                                        >
                                          {t("delete")}
                                        </Text>

                                        <View style={{ top: -1 }}>
                                          <Icon icon="delete" size={20} />
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      marginTop: 0,
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 17,
                                        color: themeStyle.BROWN_700,
                                        fontFamily: "Rubik-Bold",
                                      }}
                                    >
                                      {product.data.price *
                                        product.data.extras.counter.value}
                                    </Text>
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: 17,
                                        color: themeStyle.BROWN_700,
                                      }}
                                    >
                                      ₪
                                    </Text>
                                  </View>
                                </View>
                              </View> */}
                        </View>
                      </Animated.View>
                    </View>
                  )
              )}
            </View>
          </View>

          <View>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 30,
                paddingHorizontal: 20,
                height: 125,
              }}
            >
              <View style={{ flexBasis: "32%", flexDirection: "column" }}>
                <Button
                  onClickFn={handleDeliverySelect}
                  text={t("delivery")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.shipping
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="shipping_icon"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
              <View style={{ flexBasis: "32%" }}>
                <Button
                  onClickFn={() => setShippingMethod(SHIPPING_METHODS.takAway)}
                  text={t("take-away")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.takAway
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="takeaway-icon"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
              <View style={{ flexBasis: "32%" }}>
                <Button
                  onClickFn={handleTableSelect}
                  text={t("table")}
                  bgColor={
                    shippingMethod === SHIPPING_METHODS.table
                      ? theme.PRIMARY_COLOR
                      : "white"
                  }
                  fontFamily={`${getCurrentLang()}-SemiBold`}
                  fontSize={20}
                  icon="table"
                  iconSize={50}
                  isFlexCol
                  borderRadious={15}
                  textColor={themeStyle.GRAY_700}
                />
              </View>
            </View> */}
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 10,
              }}
            >
              <ToggleButton.Row
                onValueChange={(value) => handleDeliverySelect(value)}
                value={shippingMethod}
                style={styles.togglleContainer}
              >
                <ToggleButton
                  style={{
                    ...styles.togglleCItem,
                    backgroundColor:
                      shippingMethod === SHIPPING_METHODS.shipping
                        ? theme.PRIMARY_COLOR
                        : "transparent",
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                  }}
                  icon={() => (
                    <View style={styles.togglleItemContentContainer}>
                      {shippingMethod === SHIPPING_METHODS.shipping && (
                        <LinearGradient
                          colors={["#eaaa5c", "#a77948"]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={[styles.background]}
                        />
                      )}
                      <Image
                        source={
                          shippingMethod === SHIPPING_METHODS.shipping
                            ? icons["deliveryOff"]
                            : icons["deliveryOn"]
                        }
                        style={{ height: 85, width: 50 }}
                      />

                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color:
                            shippingMethod === SHIPPING_METHODS.shipping
                              ? themeStyle.WHITE_COLOR
                              : themeStyle.TEXT_PRIMARY_COLOR,
                        }}
                      >
                        {" "}
                        {t("delivery")}
                      </Text>
                    </View>
                  )}
                  value={SHIPPING_METHODS.shipping}
                />
                <ToggleButton
                  style={{
                    ...styles.togglleCItem,
                    backgroundColor:
                      shippingMethod === SHIPPING_METHODS.takAway
                        ? theme.PRIMARY_COLOR
                        : "transparent",
                    borderTopLeftRadius: 50,
                    borderBottomLeftRadius: 50,
                  }}
                  icon={() => (
                    <View style={styles.togglleItemContentContainer}>
                      {shippingMethod === SHIPPING_METHODS.takAway && (
                        <LinearGradient
                          colors={["#eaaa5c", "#a77948"]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={[styles.background]}
                        />
                      )}
                      <Image
                        source={
                          shippingMethod === SHIPPING_METHODS.takAway
                            ? icons["bagOff"]
                            : icons["bagOn"]
                        }
                        style={{ height: 80, width: 50 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color:
                            shippingMethod === SHIPPING_METHODS.takAway
                              ? themeStyle.WHITE_COLOR
                              : themeStyle.TEXT_PRIMARY_COLOR,
                        }}
                      >
                        {t("take-away")}
                      </Text>
                    </View>
                  )}
                  value={SHIPPING_METHODS.takAway}
                />
              </ToggleButton.Row>
            </View>
            {shippingMethod === SHIPPING_METHODS.shipping && (
              <View
                pointerEvents="none"
                style={{
                  alignItems: "center",
                  marginTop: 5,
                  paddingHorizontal: 1,
                }}
              >
                {location && region ? (
                  <View style={styles.mapViewContainer}>
                    <MapView
                      style={styles.mapContainer}
                      initialRegion={{
                        ...region,
                      }}
                    >
                      {location && (
                        <Marker
                          coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                          }}
                        />
                      )}
                    </MapView>
                  </View>
                ) : (
                  <MapView
                    style={styles.mapContainerDefault}
                    initialRegion={{
                      latitude: 32.233583,
                      latitudeDelta: 0.01,
                      longitude: 34.951661,
                      longitudeDelta: 0.01,
                    }}
                  ></MapView>
                )}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
                paddingHorizontal: 20,
              }}
            >
              <ToggleButton.Row
                onValueChange={(value) => setPaymentMthod(value)}
                value={shippingMethod}
                style={styles.togglleContainer}
              >
                <ToggleButton
                  style={{
                    ...styles.togglleCItem,
                    backgroundColor:
                      paymentMthod === PAYMENT_METHODS.cash
                        ? theme.PRIMARY_COLOR
                        : "transparent",
                    borderTopRightRadius: 50,
                    borderBottomRightRadius: 50,
                  }}
                  icon={() => (
                    <View style={styles.togglleItemContentContainer}>
                      {paymentMthod === PAYMENT_METHODS.cash && (
                        <LinearGradient
                          colors={["#eaaa5c", "#a77948"]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={[styles.background]}
                        />
                      )}
                      <Icon
                        icon="shekel"
                        size={20}
                        style={{ color: theme.GRAY_700 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color:
                            paymentMthod === PAYMENT_METHODS.cash
                              ? themeStyle.WHITE_COLOR
                              : themeStyle.TEXT_PRIMARY_COLOR,
                        }}
                      >
                        {" "}
                        {t("cash")}
                      </Text>
                    </View>
                  )}
                  value={PAYMENT_METHODS.cash}
                />
                <ToggleButton
                  style={{
                    ...styles.togglleCItem,
                    backgroundColor:
                      paymentMthod === PAYMENT_METHODS.creditCard
                        ? theme.PRIMARY_COLOR
                        : "transparent",
                    borderTopLeftRadius: 50,
                    borderBottomLeftRadius: 50,
                  }}
                  icon={() => (
                    <View style={styles.togglleItemContentContainer}>
                      {paymentMthod === PAYMENT_METHODS.creditCard && (
                        <LinearGradient
                          colors={["#eaaa5c", "#a77948"]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={[styles.background]}
                        />
                      )}
                      <Image
                        source={
                          paymentMthod === PAYMENT_METHODS.creditCard
                            ? icons["ccOff"]
                            : icons["ccOn"]
                        }
                        style={{ height: 85, width: 50 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color:
                            paymentMthod === PAYMENT_METHODS.creditCard
                              ? themeStyle.WHITE_COLOR
                              : themeStyle.TEXT_PRIMARY_COLOR,
                        }}
                      >
                        {t("credit-card")}
                      </Text>
                    </View>
                  )}
                  value={PAYMENT_METHODS.creditCard}
                />
              </ToggleButton.Row>
            </View>

            {paymentMthod === PAYMENT_METHODS.creditCard &&
              ccData?.last4Digits && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                    marginHorizontal: 25,
                    alignItems: "center",
                    justifyContent: "space-between",

                    backgroundColor: themeStyle.WHITE_COLOR,
                    borderRadius: 15,
                    paddingHorizontal: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity onPress={replaceCreditCard}>
                      <Text style={{fontSize:16}}>{t('change')}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      onPress={removeCreditCard}
                      style={{ marginLeft: 20 }}
                    >
                      <Icon icon="trash" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: themeStyle.BROWN_700,
                        fontFamily: "Rubik-Light",
                      }}
                    >{`****_****_****_${ccData?.last4Digits}`}</Text>
                    <Icon
                      icon={ccData?.ccType}
                      size={50}
                      style={{ color: theme.GRAY_700, marginLeft: 5 }}
                    />
                  </View>
                </View>
              )}
          </View>
          {ordersStore.orderType === ORDER_TYPE.later && (
            <View
              style={{
                justifyContent: "space-between",
                marginTop: 30,
                paddingHorizontal: 20,
              }}
            >
              <Button
                onClickFn={onPickTime}
                icon={"calendar"}
                iconSize={20}
                iconPosition="right"
                text={t("pick-time")}
                fontSize={22}
                textColor={theme.WHITE_COLOR}
                borderRadious={20}
                textPadding={5}
                extraText={
                  selectedOrderDate &&
                  moment(selectedOrderDate).format("DD-MM-YYYY HH:mm")
                }
              />
            </View>
          )}
          <View style={styles.totalPrictContainer}>
            {/* <LinearGradient
              colors={["#c1bab3", "#efebe5", "#d8d1ca", "#dcdcd4", "#ccccc4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.background, { borderRadius: 10 }]}
            /> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                borderBottomWidth: 1,
                borderBottomColor: themeStyle.PRIMARY_COLOR,
              }}
            >
              <View style={styles.priceRowContainer}>
                <View>
                  <Text
                    style={{
                      fontFamily: `${getCurrentLang()}-Light`,
                      fontSize: 20,
                    }}
                  >
                    {t("order-price")}:
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: `${getCurrentLang()}-SemiBold`,

                    }}
                    type="number"

                  >
                    ₪{itemsPrice}{" "}
                  </Text>
                </View>
              </View>

              {shippingMethod === SHIPPING_METHODS.shipping && (
                <View style={styles.priceRowContainer}>
                  <View>
                    <Text
                      style={{
                        fontFamily: `${getCurrentLang()}-Light`,
                        fontSize: 20,
                      }}
                    >
                      {t("delivery")}:
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: `${getCurrentLang()}-SemiBold`,
                      }}
                      type="number"

                    >
                      ₪{deliveryPrice}{" "}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {deliveryPrice > 0 && <View style={{ borderWidth: 0.3 }}></View>}

            <View style={[styles.priceRowContainer, { marginTop: 10 }]}>
              <View>
                <Text
                  style={{
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    fontSize: 20,
                  }}
                >
                  {t("final-price")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                  type="number"
                >
                  {totalPrice}{" "}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                  }}
                >
                  ₪{" "}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{ marginTop: 20, marginHorizontal: 60, marginBottom: 100 }}
          >
            <Button
              onClickFn={onSendCart}
              disabled={
                isLoadingOrderSent ||
                // isOpenShippingMethodDialog ||
                isloadingLocation ||
                isPickTimeValid()
              }
              text={t("send-order")}
              fontSize={22}
              textColor={theme.WHITE_COLOR}
              isLoading={isLoadingOrderSent}
              borderRadious={30}
              textPadding={5}
            />
          </View>
        </View>
      </ScrollView>
      {isBarcodeOpen && (
        <BarcodeScannerCMP
          onChange={handleBarcodeAnswer}
          isOpen={isBarcodeOpen}
        />
      )}

      <StoreErrorMsgDialog
        handleAnswer={handleStoreErrorMsgAnswer}
        isOpen={isOpenStoreErrorMsgDialog}
        text={storeErrorText}
      />

      <RecipetNotSupportedDialog
        handleAnswer={handleRecipetNotSupportedAnswer}
        isOpen={isOpenRecipetNotSupportedDialog}
        text={recipetSupportText.text}
        icon={recipetSupportText.icon}
      />
      <OpenBarcodeScannerdDialog
        handleAnswer={handleOpenBarcodeScannerAnswer}
        isOpen={isOpenBarcodeSacnnerDialog}
      />
      <BarcodeScannedDialog
        handleAnswer={handleOpenBarcodeScannedAnswer}
        isOpen={isOpenBarcodeSacnnedDialog}
        text={barcodeSacnnedDialogText}
      />
      <NewPaymentMethodDialog
        handleAnswer={handleNewPMAnswer}
        isOpen={isOpenNewCreditCardDialog}
      />
      <DeliveryMethodDialog
        handleAnswer={handleShippingMethoAnswer}
        isOpen={isOpenShippingMethodDialog}
        type={shippingMethod}
      />
      <LocationIsDisabledDialog
        handleAnswer={handleLocationIsDiabledAnswer}
        isOpen={isOpenLocationIsDisabledDialog}
      />
      <InvalidAddressdDialog
        handleAnswer={handleInvalidLocationAnswer}
        isOpen={isOpenInvalidAddressDialod}
      />
      <StoreIsCloseDialog
        handleAnswer={handleStoreIsCloseAnswer}
        isOpen={showStoreIsCloseDialog}
      />
      <PickTimeDialog
        handleAnswer={handleTimeSelectedAnswer}
        isOpen={showPickTimeDialog}
      />
      <PaymentFailedDialog
        handleAnswer={handlePaymentFailedAnswer}
        isOpen={showPaymentFailedDialog}
        errorMessage={paymentErrorMessage}
      />
    </View>
  );
};

export default observer(CartScreen);
// MapScreen.navigationOptions = {
//     header: null
// }

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  togglleContainer: {
    borderRadius: 50,
    marginTop: 30,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: theme.PRIMARY_COLOR,
    flexDirection: "row",
    width: "100%",
    shadowColor: "black",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  togglleCItem: {
    borderWidth: 0,

    borderRadius: 50,
    flex: 1,
    alignItems: "flex-start",
  },
  togglleItemContent: {},
  togglleItemContentContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: "100%",
  },
  mapContainerDefault: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    minHeight: 200,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    minHeight: 200,
  },
  mapViewContainer: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    minHeight: 200,
    alignSelf: "center",
  },
  totalPrictContainer: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 40,
  },
  priceRowContainer: {
    flexDirection: "row",
    marginBottom: 10,
    fontSize: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: theme.SUCCESS_COLOR,
    borderRadius: 15,
    marginTop: 30,
  },
  submitContentButton: {
    height: 50,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: "100%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
