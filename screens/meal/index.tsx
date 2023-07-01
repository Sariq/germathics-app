import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import Text from "../../components/controls/Text";
import BirthdayImagesList from "../../components/birthday-images-list";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { isEmpty } from "lodash";

import GradiantRow from "../../components/gradiant-row";
import Button from "../../components/controls/button/button";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../stores";
import { ScrollView } from "react-native-gesture-handler";
import themeStyle from "../../styles/theme.style";
import Icon from "../../components/icon";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { cdnUrl } from "../../consts/shared";
import CheckBox from "../../components/controls/checkbox";
import Counter from "../../components/controls/counter";
import PickImagedDialog from "../../components/dialogs/pick-image";

const MealScreen = ({ route }) => {
  const { t } = useTranslation();
  const { product, index, category } = route.params;
  const navigation = useNavigation();
  let { cartStore, menuStore, languageStore } = useContext(StoreContext);
  const [meal, setMeal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isPickImageDialogOpen, setIsPickImageDialogOpen] = useState(false);

  useEffect(() => {
    let tmpProduct: any = {};
    if (product) {
      setIsEdit(false);
      // tmpProduct = menuStore.getMealByKey(product.id);
      tmpProduct.data = product;
      // for products without constants
      if (isEmpty(tmpProduct)) {
        tmpProduct.data = product;
      }
      tmpProduct.others = { count: 1, note: "" };
    }
    if (index !== null && index !== undefined) {
      setIsEdit(true);
      tmpProduct = cartStore.getProductByIndex(index);
    }
    setMeal(tmpProduct);
  }, []);

  const initExtras = () => {};

  const onAddToCart = () => {
    DeviceEventEmitter.emit(`add-to-cart-animate`, {
      imgUrl: `${cdnUrl}${meal.data.img[0].uri}`,
    });
    cartStore.addProductToCart(meal);
    navigation.goBack();
  };

  const onUpdateCartProduct = () => {
    cartStore.updateCartProduct(index, meal);
    navigation.goBack();
  };

  const handlePickImageAnswer = (value:any) => {
    setIsPickImageDialogOpen(false);
  }

  const onClose = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  const updateMeal = (value, tag, type) => {
    setMeal({
      ...meal,
      data: {
        ...meal.data,
        extras: {
          ...meal.data.extras,
          [tag]: { ...meal.data.extras[tag], value: value },
        },
      },
    });
  };

  const updateMeal2 = (value, tag, type) => {
    let extraPrice = 0;
    const currentExtraType = meal.extras[type];
    const extrasType = meal.extras[type].map((tagItem) => {
      if (tagItem.id === tag.id) {
        switch (tag.type) {
          case "COUNTER":
            extraPrice =
              value > tagItem.value
                ? extraPrice + tagItem.price * meal.others.count
                : extraPrice - tagItem.price * meal.others.count;
            break;
          case "oneChoice":
            if (!tag.multiple_choice) {
              const currentTag = currentExtraType.find(
                (tagItem) => tagItem.value === true
              );
              if (currentTag) {
                const tagDeltaPrice = tagItem.price - currentTag.price;
                extraPrice = extraPrice + tagDeltaPrice;
              }
            } else {
              extraPrice = value
                ? extraPrice + tagItem.price * meal.others.count
                : extraPrice - tagItem.price * meal.others.count;
            }
            break;
          case "CHOICE":
            if (!tag.multiple_choice) {
              const currentTag = currentExtraType.find(
                (tagItem) => tagItem.value === true
              );
              if (currentTag) {
                const tagDeltaPrice = tagItem.price - currentTag.price;
                extraPrice = extraPrice + tagDeltaPrice;
              }
            } else {
              extraPrice = value
                ? extraPrice + tagItem.price * meal.others.count
                : extraPrice - tagItem.price * meal.others.count;
            }
            break;
          default:
            break;
        }
        tagItem.value = value;
      } else {
        if (tag.type === "CHOICE" && !tag.multiple_choice) {
          tagItem.value = false;
        }
      }
      return tagItem;
    });
    if (extraPrice !== 0) {
      meal.extras[type] = extrasType;
      setMeal({
        ...meal,
        data: { ...meal.data, price: meal.data.price + extraPrice },
        extras: meal.extras,
      });
    }
  };

  const updateOthers = (value, key, type) => {
    if (key === "count") {
      const updatedPrice =
        meal.data.price +
        (value - meal.others.count) * (meal.data.price / meal.others.count);
      setMeal({
        ...meal,
        [type]: { ...meal[type], [key]: value },
        data: { ...meal.data },
      });
    } else {
      setMeal({ ...meal, [type]: { ...meal[type], [key]: value } });
    }
  };

  const isAvailableOnApp = (key: string) => {
    let isAvailable = false;
    Object.keys(meal.extras[key]).forEach((tagId) => {
      const tag = meal.extras[key][tagId];
      if (tag.available_on_app) {
        isAvailable = true;
      }
    });
    return isAvailable;
  };

  const isOneChoiceTag = (tags) => {
    const result = tags.find((tag) => tag.multiple_choice === false);
    return !!result;
  };
  const isOneChoiceTagStyle = (tags) => {
    const result = isOneChoiceTag(tags);
    const rowStyle = {
      flexDirection: "row",
      justifyContent: "space-evenly",
    };
    return result ? rowStyle : {};
  };

  const orderList = (index: any) => {
    const result = Object.keys(meal.extras.orderList).find(
      (key) => meal.extras.orderList[key] === index
    );
    return result;
  };
  const sizes = {
    medium: true,
    large: false,
  };

  const [sizesOptions, setSizeOptions] = useState(sizes);

  const onSizeChange = (value, key) => {
    const updatesSizeOptions = sizes;
    Object.keys(sizesOptions).forEach((size) => {
      updatesSizeOptions[size] = size === key;
    });
    setSizeOptions(updatesSizeOptions);
  };

  const getPriceBySize = () => {
    return meal.data.extras.size.options[meal.data.extras.size.value].price;

    const size = meal.data.extras.size.options?.filter(
      (size) => size.title === meal.data.extras.size.value
    )[0];
    return size.price;
  };

  if (!meal) {
    return null;
  }

  return (
    <View style={{ height: "100%", marginBottom: 40 }}>
      {/* <LinearGradient
        colors={["white", "#F9F9F9", "#FCFCFC", "#FCFCFC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.1 }}
        style={styles.background}
      /> */}
      {/* <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior="position"
        style={{ flex: 1, }}
      > */}
      <View style={{ height: "100%" }}>
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <View style={{ height: "65%", marginTop:"5%" }}>
          <TouchableOpacity
        style={[
          {
            borderRadius: 50,
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            width: 60,
            alignSelf: "center",
            position: "absolute",
            zIndex: 2,
            marginTop: -20,
          },
        ]}
        onPress={isEdit ? onUpdateCartProduct : onAddToCart}
      >
        <LinearGradient
          colors={[
            "rgba(198, 202, 207,1)",
            "rgba(236, 238, 239,1)",

            "rgba(255, 255, 255,1)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.backgroundAddCart]}
        />
        <Icon icon={"shopping-bag"} style={{ color: themeStyle.PRIMARY_COLOR }} size={35} />
      </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={{
                zIndex: 1,
                position: "absolute",
                right: 15,
                width: "10%",
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: "100%", width: "100%", alignSelf: "center" }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: `${cdnUrl}${meal.data.img[0].uri}` }}
              />
            </View>
          </View>
          <View
            style={{
              paddingBottom: 15,
              width: "100%",
              height: "28%",
              // borderRadius: 30,
              // borderTopLeftRadius:30,
              alignSelf: "center",
              position: "absolute",
              bottom: 0,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(199, 199, 199, 0.9)",
                "rgba(254, 254, 254, 0.9)",
                "rgba(254, 254, 254, 0.9)",
                "rgba(254, 254, 254, 0.9)",
                "rgba(199, 199, 199, 0.9)",
              ]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.background]}
            />
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                marginTop: -15,
                zIndex:2
              }}
            >
              <Counter
                value={meal.data.extras.counter.value}
                minValue={1}
                onCounterChange={(value) => {
                  updateMeal(value, "counter", meal.data.extras.counter.type);
                }}
                variant={"gray"}
              />
            </View>
            {meal.data.subCategoryId == "1" && 
            <TouchableOpacity
              onPress={()=>setIsPickImageDialogOpen(true)}
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                marginTop: -20,
                padding:10,
                right:30,
                zIndex:4
              }}
            >
              <LinearGradient
                colors={["#eaaa5c", "#a77948"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.backgroundEdit]}
              />
              <Icon
                icon="images"
                size={30}
                style={{ color: themeStyle.WHITE_COLOR, }}
              />
            </TouchableOpacity>} 
            <View
              style={{ overflow: "hidden", padding: 20, paddingHorizontal: 20 }}
            >
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
                  style={{ color: "white", alignItems: "center", fontSize: 25 }}
                  type="number"
                >
                  ₪{" "}
                  {(getPriceBySize() || meal.data.price) *
                    meal.data.extras.counter.value}
                </Text>
              </View>
              <View style={{ width: "100%", marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 25,
                    textAlign: "center",
                    fontFamily: `${getCurrentLang()}-Bold`,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {languageStore.selectedLang === "ar"
                    ? meal.data.nameAR
                    : meal.data.nameHE}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    fontFamily: `${getCurrentLang()}-SemiBold`,
                    marginTop: 10,
                    color: themeStyle.GRAY_700,
                  }}
                >
                  {languageStore.selectedLang === "ar"
                    ? meal.data.descriptionAR
                    : meal.data.descriptionHE}
                </Text>
              </View>

              { meal.data.categoryId == "5" && <View>
                <View style={{ marginTop: 20, width: "100%" }}>
                  <GradiantRow
                    onChangeFn={(value) => {
                      updateMeal(value, "size", meal.data.extras["size"].type);
                    }}
                    type={meal.data.extras["size"].type}
                    value={meal.data.extras["size"].value}
                    title={"size"}
                    options={meal.data.extras["size"].options}
                  />
                </View>
              </View>}

              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <View
                  style={{
                    width: "100%",
                  }}
                >
                  {Object.keys(meal.data.extras).map((key) => (
                    <View style={{ marginBottom: 20, width: "100%" }}>
                      <GradiantRow
                        onChangeFn={(value) => {
                          updateMeal(value, key, meal.data.extras[key].type);
                        }}
                        type={meal.data.extras[key].type}
                        value={meal.data.extras[key].value}
                        title={key}
                        options={meal.data.extras[key].options}
                        minValue={1}
                      />
                    </View>
                  ))}
                </View>
              </View> */}

              {/* <View style={styles.buttonContainer}>
                <View
                  style={{
                    width: "60%",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#442213",
                      }}
                    >
                      ₪
                      {(getPriceBySize() || meal.data.price) *
                        meal.data.extras.counter.value}
                    </Text>
                  </View>
                  <Button
                    text={isEdit ? t("save") : t("add-to-cart")}
                    icon="shopping-bag-plus"
                    fontSize={17}
                    onClickFn={isEdit ? onUpdateCartProduct : onAddToCart}
                    bgColor={themeStyle.SUCCESS_COLOR}
                    textColor={themeStyle.WHITE_COLOR}
                    fontFamily={`${getCurrentLang()}-Bold`}
                    borderRadious={19}
                  />
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </View>
      <PickImagedDialog isOpen={isPickImageDialogOpen} handleAnswer={handlePickImageAnswer} />

    </View>
  );
};
export default observer(MealScreen);

const styles = StyleSheet.create({
  gradiantRowContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonContainer: {
    width: "100%",
    bottom: 20,
    marginTop: 60,
  },
  titleContainer: {
    alignSelf: "center",
  },
  sectionContainer: {
    backgroundColor: "white",
    marginTop: 25,
    shadowColor: "#F1F1F1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 0,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

    // borderRadius: 50,
  },
  backgroundAddCart: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
     borderRadius: 50,
  },
  backgroundEdit: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 50,

    // borderRadius: 50,
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
