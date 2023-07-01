import { StyleSheet, View, DeviceEventEmitter } from "react-native";
import InputText from "../../components/controls/input";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import {  AUTH_API, CUSTOMER_API } from "../../consts/api";
import { useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { axiosInstance } from "../../utils/http-interceptor";
import { useTranslation } from "react-i18next";
import { toBase64 } from "../../helpers/convert-base64";
import Text from "../../components/controls/Text";
import { LinearGradient } from "expo-linear-gradient";

const InsertCustomerNameScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { cartStore, userDetailsStore } = useContext(StoreContext);
 const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState();
  const [isValid, setIsValid] = useState(true);
  const onChange = (value) => {
    setIsValid(true);
    setCustomerName(value);
  };

  const isValidName = () =>{
    return customerName?.length>=2
  }

  const updateCutsomerName = () => {
    if(isValidName()){
      setIsLoading(true);
      const body = {
        fullName: customerName,
      };
      axiosInstance
        .post(
          `${CUSTOMER_API.CONTROLLER}/${CUSTOMER_API.UPDATE_CUSTOMER_NAME_API}`,
          body
        )
        .then(function (response) {
          DeviceEventEmitter.emit(`PREPARE_APP`);
          userDetailsStore.getUserDetails().then((res) => {
            setIsLoading(false);
            if (cartStore.getProductsCount() > 0 && prevRoute?.name !== "profile") {
              navigation.navigate("cart");
            } else {
              navigation.navigate("homeScreen");
            }
          });
        })
        .catch(function (error) {
        });
    }else{
      setIsValid(false);
    }
  };

  return (

    <View style={styles.container}>
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
      <View style={styles.inputsContainer}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>{t('insert-customer-name')}</Text>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 15, alignItems: "flex-start" }}>
          <InputText  onChange={onChange} label={t('name')} />
          {!isValid && <Text style={{color: themeStyle.ERROR_COLOR, paddingLeft:15 }}>{t('invalid-name')}</Text>}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            bgColor={themeStyle.PRIMARY_COLOR}
            text={t('approve')}
            fontSize={20}
            onClickFn={updateCutsomerName}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  );
}
export default observer(InsertCustomerNameScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputsContainer: {
    marginTop: 30,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  background:{
    position: "absolute",
    left:"8%",
    right:"8%",
    top: "8%",
    bottom: "30%",
    borderRadius:50
  }
});
