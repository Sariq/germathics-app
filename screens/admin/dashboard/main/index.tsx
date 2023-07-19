import { StyleSheet, View } from "react-native";
import Icon from "../../../../components/icon";
import BackButton from "../../../../components/back-button";
import Text from "../../../../components/controls/Text";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../../stores";
import { observer } from "mobx-react";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import themeStyle from "../../../../styles/theme.style";
import { getCurrentLang } from "../../../../translations/i18n";
import { LinearGradient } from "expo-linear-gradient";
import DashedLine from "react-native-dashed-line";

const DashboardScreen = () => {
  const { t } = useTranslation();

  const { userDetailsStore, authStore, languageStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
      const items = [
        // {
        //   title: userDetailsStore?.userDetails?.name,
        //   icon: "profile-1",
        //   key: "phone",
        // },
        // {
        //   title: 'B-COINS',
        //   icon: "bcoin_icon",
        //   key: "bcoin",
        // },
        {
          title: "اضف دورة",
          icon: "file-empty",
          key: "add-course",
        },
        {
          title: "قائمة الدورات",
          icon: "files-empty",
          key: "courses-list",
        },
 
        {
          title: "اضف طالب",
          icon: "user-plus",
          key: "add-student",
        },
        {
          title: "قائمة الطلاب",
          icon: "users",
          key: "students-list",
        },
        {
          title: "اضف مرشد",
          icon: "user-plus",
          key: "add-employe",
        },
        {
          title: "قائمة المرشدين",
          icon: "users",
          key: "employes-list",
        },
        {
          title: "דוח תשלומים",
          icon: "user-plus",
          key: "payment-report",
        },
        {
          title: "דוח עובדים",
          icon: "users",
          key: "employe-reports",
        },
        {
          title: "signout",
          icon: "logout-icon",
          key: "signout",
        },
      ];
      setItemsList(items);
  }, []);

  const actionHandler = (key: string) => {
    console.log("key",key)
    switch (key) {
      // case "phone":
      //   navigation.navigate("insert-customer-name");
      //   break;
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
      case "new-order":
        navigation.navigate("homeScreen");
        break;
      case "add-course":
        navigation.navigate("admin-add-course", { categoryId: null });
        break;
      case "courses-list":
        navigation.navigate("admin-courses-list", { categoryId: null });
        break;
      case "students-list":
        navigation.navigate("admin-students-list", { categoryId: null });
        break;
      case "add-student":
        navigation.navigate("admin-add-student");
        break;
      case "employes-list":
        navigation.navigate("admin-employes-list", { categoryId: null });
        break;
      case "add-employe":
        navigation.navigate("admin-add-employe");
        break;
      case "payment-report":
        navigation.navigate("admin-payment-report");
        break;
      case "openTerms":
        navigation.navigate("terms-and-conditions");
        break;
      case "menu":
        navigation.navigate("menuScreen");
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
      <View style={{padding: 30, marginVertical:10, marginHorizontal:5, borderRadius:20, backgroundColor:"#001A5f"}}>
           {/* <LinearGradient
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
        /> */}
        <TouchableOpacity
          onPress={() => actionHandler(item.key)}
          style={styles.rowContainer}
        >
          <View style={styles.rowContainer}>
            <View style={{  alignItems: "center" }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  padding: 10,
                }}
              >
                <Icon
                  icon={item.icon}
                  size={30}
                  style={{ color: themeStyle.WHITE_COLOR, opacity: 1 }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 18, color: themeStyle.WHITE_COLOR }}>
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
        {/* {index < itemsList.length -1 && <DashedLine
          dashLength={5}
          dashThickness={1}
          dashGap={5}
          dashColor={themeStyle.PRIMARY_COLOR}
          style={{paddingVertical:15}}
        />} */}
      </View>
    ));
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: 0,
        height: "100%",
      }}
    >
      <View style={styles.itemsContainter}>
        {/* <LinearGradient
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
        /> */}
                <View style={{ marginTop: 15, flexDirection: "row", flexWrap: "wrap",justifyContent:"center" }}>{renderItems()}</View>

        </View>

      {/* <View style={styles.container}>
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
        <View style={{ alignItems: "center", width: "100%", marginTop: 15}}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: `he-Bold`,
              color: themeStyle.GRAY_700,
              textDecorationLine: 'underline'
            }}
            
          >
           {userDetailsStore?.userDetails?.phone}
          </Text>
        </View>
        <View style={{ marginTop: 15 }}>{renderItems()}</View>
      </View> */}
     
     
    </ScrollView>
  );
};

export default observer(DashboardScreen);

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 10,
    width: "100%",
    borderColor: "rgba(112,112,112,0.1)",
    height: "80%",
    
  },
  itemsContainter: {
    padding: 5,
    borderRadius: 10,
    borderColor: "rgba(112,112,112,0.1)",
    alignSelf: "center"   
  },
  rowContainer: {
    //== flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
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
