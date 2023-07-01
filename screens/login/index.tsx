import { StyleSheet, View, Image, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { AUTH_API, CUSTOMER_API } from "../../consts/api";
import { useState } from "react";
import * as Device from "expo-device";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import base64 from "react-native-base64";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { axiosInstance } from "../../utils/http-interceptor";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toBase64 } from "../../helpers/convert-base64";
import Text from "../../components/controls/Text";
import { LinearGradient } from "expo-linear-gradient";

const reg_arNumbers = /^[\u0660-\u0669]{10}$/;
const arabicNumbers = [
  /٠/g,
  /١/g,
  /٢/g,
  /٣/g,
  /٤/g,
  /٥/g,
  /٦/g,
  /٧/g,
  /٨/g,
  /٩/g,
];

const LoginScreen = () => {
  const { t } = useTranslation();
  const { languageStore, authStore } = useContext(StoreContext);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isValid, setIsValid] = useState(true);
  const onChange = (value) => {
    setIsValid(true);
    if(value.length === 10){
      Keyboard.dismiss();
    }
    setPhoneNumber(value);
  };

  const isValidNunber = () => {
    return (
      phoneNumber?.match(/\d/g)?.length === 10 ||
      reg_arNumbers.test(phoneNumber)
    );
  };
  const ifUserBlocked = async () => {
    const userB = await AsyncStorage.getItem("@storage_user_b");
    const userBJson = JSON.parse(userB);
    if (userBJson) {
      return true;
    }
    return false;
  };
  const authinticate = async () => {
    if (isValidNunber()) {
      setIsLoading(true);

      if (await ifUserBlocked()) {
        setTimeout(() => {
          navigation.navigate("homeScreen");
        }, 5000);
      }

      let convertedValue = phoneNumber;
      for (var i = 0; i < phoneNumber.length; i++) {
        convertedValue = convertedValue.replace(arabicNumbers[i], i);
      }

      const body = {
        phone: convertedValue,
        // device_type: Device.osName || "IOS",
        // language: languageStore.selectedLang === "ar" ? 0 : 1,
        // datetime: new Date(),
      };
      axiosInstance
        .post(
          `${CUSTOMER_API.CONTROLLER}/${CUSTOMER_API.CUSTOMER_CREATE_API}`,
          body,
          { headers: { "Content-Type": "application/json" } }
        )
        .then(async function (response: any) {
          setIsLoading(false);
          // const res = JSON.parse(base64.decode(response.data));
          // if (res.has_err ) {
          //   if(res.code == PHONE_NUMBER_BLOCKED){
          //     setIsLoading(false);
          //     await AsyncStorage.setItem("@storage_user_b", JSON.stringify(true));
          //     return;
          //   }
          // }
          authStore.setVerifyCodeToken(response.phone);
          navigation.navigate("verify-code", {
            convertedValue: response.phone,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setIsValid(false);
    }
  };

  const handleLogoPress = () =>{
    navigation.navigate("homeScreen");
  }

  return (
    <View style={styles.container}>

            <ImageBackground
          source={require("../../assets/bg/login-bg.jpg")}
          resizeMode="cover"
          style={{ height: "100%",width:"100%"}}
              >
      <TouchableOpacity onPress={handleLogoPress}  style={{ marginTop: 90 }}>
        <Image
          style={{  alignSelf: "center", width:"70%", height:85 }}
          source={require("../../assets/store-logo.png")}
          
        />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{borderWidth:1, backgroundColor:'red', zIndex:10, height:"100%", width:"100%"}}>

      <View style={{ width: "100%" }}>
        <LinearGradient
          colors={[
            "rgba(207, 207, 207, 0.4)",
            "rgba(246,246,247, 0.8)",
            "rgba(246,246,247, 0.8)",
            "rgba(246,246,247, 0.8)",
            "rgba(246,246,247, 0.8)",
            "rgba(246,246,247, 0.8)",
            "rgba(207, 207, 207, 0.4)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.background]}
        />

        <View style={styles.inputsContainer}>
          <Text style={{ fontSize: 26, paddingTop:30,fontWeight: 'bold'  }}>
            {t("insert-phone-number")}
          </Text>
          <Text
            style={{ marginTop: 20, fontSize: 20 }}
          >
            {t("will-send-sms-with-code")}
          </Text>

          <View
            style={{
              width: "100%",
              paddingHorizontal: 50,
              marginTop: 50,
              alignItems: "flex-start",
            }}
          >
            <InputText
              keyboardType="numeric"
              onChange={onChange}
              label={t("phone")}
            />
            {!isValid && (
              <Text style={{ color: themeStyle.ERROR_COLOR, paddingLeft: 15 }}>
                {t("invalid-phone")}
              </Text>
            )}
          </View>

          <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 70 }}>
            <Button
              text={t("approve")}
              fontSize={20}
              onClickFn={authinticate}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>

      </View>
      </TouchableWithoutFeedback>

      </ImageBackground>
    </View>
  );
};
export default observer(LoginScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 90,
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  background: {
    position: "absolute",
    left: "5%",
    right: "5%",
    top: "10%",
    bottom: "0%",
    borderRadius: 50,
  },
});
