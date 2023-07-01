import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import { isEmpty } from "lodash";
import themeStyle from "../../../../styles/theme.style";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../components/controls/button/button";
import { StoreContext } from "../../../../stores";
import OrderDetailsdDialog from "../../../../components/dialogs/order-details";

export type TProps = {
  data: any;
};

const initDeafaulHours = () => {
  const deafultDayH = {};
  for (let i = 0; i <= 22; i++) {
    const hour = i < 10 ? "0" + i : i;
    deafultDayH[hour + ":00"] = { orders: [], isDisabled: false };
  }
  return deafultDayH;
};
const deafultDayHours = initDeafaulHours();

const OrderDayItem = ({ data }: TProps) => {
  const { calanderStore } = useContext(StoreContext);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const [dayHours, setDayhours] = useState(deafultDayHours);
  useEffect(() => {
    if (isEmpty(data?.items)) {
      return;
    }
    if (!data?.selectedDate) {
      return;
    }
    initDay();
  }, [data]);

  const initDay = () => {
    calanderStore.getDisabledHoursByDate(data?.selectedDate).then((res) => {
      //updateDisabledHours(res);
      initDayOrders(res);
    });
  };

  const updateDisabledHours = (disabledHoursList: any) => {};
  const initDayOrders = async (disabledHoursList: any) => {
    let deafultDayHoursTemp = initDeafaulHours();
    var sorted_meetings = data?.items[data?.selectedDate]?.sort((a, b) => {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    });
    sorted_meetings?.forEach(async (order) => {
      const orderHour = moment(order.orderDate  || order.created).format("HH") + ":00";
      deafultDayHoursTemp = {
        ...deafultDayHoursTemp,
        [orderHour]: {
          orders: [...deafultDayHoursTemp[orderHour]?.orders, order],
        },
      };
    });

    disabledHoursList?.forEach(async (item) => {
      deafultDayHoursTemp = {
        ...deafultDayHoursTemp,
        [item.hour]: {
          isDisabled: true,
        },
      };
    });

    setDayhours(deafultDayHoursTemp);
  };

  const disableHour = (hourItem) => {
    calanderStore
      .insertDisableHour({
        date: data?.selectedDate,
        hour: hourItem,
      })
      .then(() => initDay());
  };

  const enableDisabledHour = (hourItem) => {
    calanderStore
      .enableDisabledHour({
        date: data?.selectedDate,
        hour: hourItem,
      })
      .then(() => initDay());
  };

  const handlOrderPress = (order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true)
  }
  const handleAnswer = () => {
    setIsOrderDialogOpen(false)
  }

  return (
    <>
      <ScrollView>
        <View>
          {Object.keys(dayHours).map((key) => {
            return (
              <View>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: dayHours[key]?.isDisabled
                      ? "rgba(255,255,255,0.4)"
                      : "white",
                    marginVertical: 15,
                    flexDirection: "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <Text style={{ fontSize: 20 }}>{key}</Text>
                    <View style={styles.hourOrdersContainer}>
                      {dayHours[key]?.orders?.map((order) => {
                        return (
                          <TouchableOpacity onPress={()=>handlOrderPress(order)}>
                            <View style={styles.hourOrderContainer}>
                              <Text>{order?.customerDetails?.name}</Text>
                              <Text>
                                {moment(order.orderDate || order.created).format("HH:mm")}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {!dayHours[key]?.isDisabled && (
                        <View style={{ left: 0, width: 100 }}>
                          <Button
                            bgColor={themeStyle.GRAY_300}
                            text={"disable"}
                            fontSize={18}
                            onClickFn={() => disableHour(key)}
                            textPadding={0}
                            marginH={0}
                            // isLoading={isLoading}
                            // disabled={isLoading}
                            textColor={themeStyle.GRAY_700}
                          />
                        </View>
                      )}
                      {dayHours[key]?.isDisabled && (
                        <View style={{ left: 0, width: 100 }}>
                          <Button
                            bgColor={themeStyle.SUCCESS_COLOR}
                            text={"enable"}
                            fontSize={18}
                            onClickFn={() => enableDisabledHour(key)}
                            textPadding={0}
                            marginH={0}
                            // isLoading={isLoading}
                            // disabled={isLoading}
                            textColor={themeStyle.GRAY_700}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <OrderDetailsdDialog isOpen={isOrderDialogOpen} order={selectedOrder} handleAnswer={handleAnswer}/>
    </>
  );
};

export default observer(OrderDayItem);
const gap = 8;
const styles = StyleSheet.create({
  hourOrdersContainer: {
    flexDirection: "row",
    paddingHorizontal: gap / -2,
    left: 10,
    flexWrap: "wrap",
  },
  hourOrderContainer: {
    marginHorizontal: gap / 2,
    marginVertical: gap / 2,
    padding: 10,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 10,
  },
});
