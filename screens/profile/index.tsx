import { StyleSheet, View } from "react-native";
import Icon from "../../components/icon";
import BackButton from "../../components/back-button";
import Text from "../../components/controls/Text";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import themeStyle from "../../styles/theme.style";
import { getCurrentLang } from "../../translations/i18n";
import { LinearGradient } from "expo-linear-gradient";
import DashedLine from "react-native-dashed-line";

const ProfileScreen = () => {
  const { t } = useTranslation();

  const { userDetailsStore, authStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    if (userDetailsStore.userDetails) {
      const items = [
        {
          title: userDetailsStore?.userDetails?.name,
          icon: "profile-1",
          key: "phone",
        },
        {
          title: "order-list",
          icon: "orders-icon",
          key: "orders",
        },
        {
          title: "change-language",
          icon: "language",
          key: "language",
        },
        {
          title: "signout",
          icon: "logout-icon",
          key: "signout",
        },
      ];
      setItemsList(items);
    }
  }, [userDetailsStore.userDetails]);

  const actionHandler = (key: string) => {
    switch (key) {
      case "phone":
        navigation.navigate("insert-customer-name");
        break;
      case "orders":
        onGoToOrdersList();
        break;
      case "calander":
        onGoToCalander();
        break;
      case "signout":
        onLogOut();
        break;
      case "deleteAccount":
        deletAccount();
        break;
      case "bcoin":
        navigation.navigate("becoin");
        break;
      case "language":
        navigation.navigate("language");
        break;
      case "upload-images":
        navigation.navigate("upload-images");
        break;
      case "openTerms":
        navigation.navigate("terms-and-conditions");
        break;
    }
  };

  const deletAccount = () => {
    authStore.deleteAccount();
    navigation.navigate("homeScreen");
  };
  const onLogOut = () => {
    authStore.logOut();
    userDetailsStore.resetUser();
    navigation.navigate("homeScreen");
  };
  const onGoToOrdersList = () => {
    if (userDetailsStore.isAdmin()) {
      navigation.navigate("admin-orders");
    } else {
      navigation.navigate("orders-status");
    }
  };
  const onGoToCalander = () => {
    navigation.navigate("admin-calander");
  };

  const renderItems = () => {
    return itemsList.map((item, index) => (
      <View>
        <TouchableOpacity
          onPress={() => actionHandler(item.key)}
          style={styles.rowContainer}
        >
          <View style={styles.rowContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  marginRight: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  padding: 10,
                }}
              >
                <Icon
                  icon={item.icon}
                  size={30}
                  style={{ color: themeStyle.PRIMARY_COLOR, opacity: 1 }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 18, color: "#442213" }}>
                  {t(item.title)}
                </Text>
              </View>
            </View>

            {/* <View>
              <Text style={{ fontSize: 25, color: "#292d32" }}>
                <Icon
                  icon="small-arrow-right"
                  size={15}
                  style={{ color: "#292D32" }}
                />
              </Text>
            </View> */}
          </View>
        </TouchableOpacity>
        {index < itemsList.length - 1 && (
          <DashedLine
            dashLength={5}
            dashThickness={1}
            dashGap={5}
            dashColor={themeStyle.PRIMARY_COLOR}
            style={{ paddingVertical: 15 }}
          />
        )}
      </View>
    ));
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        height: "100%",
      }}
    >
      <BackButton />

      <View style={styles.container}>
        <LinearGradient
          colors={[
            "rgba(207, 207, 207, 0.6)",
            "rgba(232, 232, 230, 0.5)",
            "rgba(232, 232, 230, 0.4)",
            "rgba(232, 232, 230, 0.4)",
            "rgba(207, 207, 207, 1)",
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.background]}
        />
        <View style={{ alignItems: "center", width: "100%", marginTop: 15 }}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: `he-Bold`,
              color: themeStyle.GRAY_700,
              textDecorationLine: "underline",
            }}
          >
            {userDetailsStore?.userDetails?.phone}
          </Text>
        </View>
        <View style={{ marginTop: 15 }}>{renderItems()}</View>
      </View>
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => actionHandler("openTerms")}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
            <Text style={{ color: themeStyle.GRAY_700 }}>
              {t("open-terms")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{top:-10}}>
          <Text>{"  |  "}</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => actionHandler("deleteAccount")}
            style={{ alignItems: "center", marginBottom: 20 }}
          >
            <Text style={{ color: themeStyle.GRAY_700 }}>
              {t("delete-account")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          margin: "auto",
          left: 0,
          right: 105,
        }}
      ></View>
      {/* <View
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          margin: "auto",
          left: 0,
          right: 0,
        }}
      >
        <Text
         
          style={{ alignItems: "center", marginBottom: 20 }}
        >
          <Text style={{ color: themeStyle.GRAY_700 }}>|</Text>
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          bottom: 5,
          margin: "auto",
          left: 130,
          right: 0,
        }}
      >

      </View> */}
    </View>
  );
};

export default observer(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    width: "100%",
    borderColor: "rgba(112,112,112,0.1)",
    height: "80%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    // marginTop: 15,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 50,
  },
});
