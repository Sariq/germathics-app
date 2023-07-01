import { StyleSheet, Text, View, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../../../stores";

const OrderHistoryScreen = ({ route }) => {
  const { cartStore } = useContext(StoreContext);
  const navigation = useNavigation();
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    const tmp = cartStore.getOrderHistory().then((res) => {
      setOrdersList(res.ordersList);
    });
  }, []);

  return (
    <View style={{ width: "100%", marginTop: 20 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <View
          style={{ alignItems: "center", paddingHorizontal: 40, width: "100%" }}
        >
          <Text
            style={{
              ...styles.textLang,
              fontFamily: "ar-SemiBold",
            }}
          >
            Order History
          </Text>
          <View style={{ marginTop: 30, width: "100%" }}>
            {ordersList.map((order) => (
              <View style={{ ...styles.orderContainer }}>
                <Text>{order.totalPrice}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
export default observer(OrderHistoryScreen);

const styles = StyleSheet.create({
    orderContainer: {
      backgroundColor: "white",
      padding: 10,
      width: "100%",
      borderRadius: 10,
    },
    textLang: {
      //   fontFamily: props.fontFamily + "Bold",
      fontSize: 25,
      textAlign: "left",
    },
  });
