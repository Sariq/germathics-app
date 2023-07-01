import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { getCurrentLang } from "../../translations/i18n";
import Text from "../../components/controls/Text";
import { LinearGradient } from "expo-linear-gradient";

const LanguageScreen = () => {
  const { languageStore } = useContext(StoreContext);
  const navigation = useNavigation();

  const onChangeLanguage = (lng) => {
    languageStore.changeLang(lng);
    navigation.goBack();
  };

  return (
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
      <View style={{ alignItems: "center" }}>
        {/* <View>
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            أختر اللغة
          </Text>
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "he-SemiBold",
            }}
          >
            בחר שפה
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            height: "50%",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              backgroundColor:
                getCurrentLang() === "ar" ? themeStyle.PRIMARY_COLOR : "white",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal:20,
              borderRadius:20
            }}
            onPress={() => {
              onChangeLanguage("ar");
            }}
          >
            <Text style={{ fontFamily: "ar-SemiBold", fontSize: 29 }}>
              العربية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              backgroundColor:
                getCurrentLang() === "he" ? themeStyle.PRIMARY_COLOR : "white",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal:20,
              borderRadius:20
            }}
            onPress={() => {
              onChangeLanguage("he");
            }}
          >
            <Text style={{ fontFamily: "he-SemiBold", fontSize: 29 }}>
            עברית
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default observer(LanguageScreen);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  textLang: {
    //   fontFamily: props.fontFamily + "Bold",
    fontSize: 29,
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
