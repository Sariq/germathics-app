import { StyleSheet, View, TouchableOpacity,Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../styles/theme.style";
import Icon from "../icon";
import * as Haptics from "expo-haptics";
import themeStyle from "../../styles/theme.style";

export type TProps = {
  goTo?: string;
  isClose?: boolean;
  onClick?: any;
}
export default function BackButton({goTo, isClose, onClick}: TProps) {
  const navigation = useNavigation();

  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if(isClose){
      onClick && onClick();
      return
    }
    const routes = navigation.getState()?.routes;
    const currentRoute = routes[routes.length - 1]; // -2 because -1 is the current route
    const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
    if ((currentRoute.name === "cart" || currentRoute.name === "profile") && (prevRoute.name === "verify-code" || prevRoute.name === "insert-customer-name")) {
      navigation.navigate("homeScreen");
      return;
    }
    // if(goTo){
    //   navigation.navigate(goTo);
    //   return;
    // }
    navigation.goBack();
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onBtnClick();
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(112,112,112,0.1)",
            borderRadius: 30,
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            backgroundColor: themeStyle.PRIMARY_COLOR
            // transform: [{ rotate: "180deg" }],
          }}
        >
          {isClose ? <Text style={{color:themeStyle.WHITE_COLOR}}>X</Text>: <Icon icon="arrow-right" size={15} style={{ color: themeStyle.WHITE_COLOR }} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems:"flex-end",
    paddingRight:10,
    position:"absolute",
    right:0,
    top: 5,
    zIndex:1
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    marginHorizontal: 20,
  },
});
