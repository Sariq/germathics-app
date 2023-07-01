import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import OrderDayItem from "../day-item";
import { useEffect, useContext, useState } from "react";
import { StoreContext } from "../../../../stores";
import moment from "moment";
import { groupBy } from "lodash";
import themeStyle from "../../../../styles/theme.style";
import Button from "../../../controls/button/button";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: [
    "الأحد.",
    "الإثنين.",
    "الثلاثاء.",
    "الأربعاء.",
    "الخميس.",
    "الجمعة.",
    "السبت",
  ],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

export type TProps = {
  handleSelectedDate: any;
};
const CalanderContainerUser = ({ handleSelectedDate }: TProps) => {
  const { menuStore, ordersStore, authStore, userDetailsStore } = useContext(
    StoreContext
  );
  // const [ordersList, setOrdersList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().clone().add(0, "days").format("YYYY-MM-DD")
  );
  const [selectedHour, setSelectedHour] = useState();
  const [ordersByDate, setOrdersByDate] = useState({});
  // const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsloading] = useState(false);

  const getOrders = () => {
    if (authStore.isLoggedIn()) {
      ordersStore.getOrders(userDetailsStore.isAdmin());
    }
  };

  useEffect(() => {
    setIsloading(true);
    getOrders();
  }, []);

  const initOrderItemsByDate = (odersList) => {
    const groupedOrders = groupBy(odersList, (x) =>
      moment(x.created).format("YYYY-MM-DD")
    );
    const formatedOrders = {};
    for (const property in groupedOrders) {
      formatedOrders[moment(property).format("YYYY-MM-DD")] =
        groupedOrders[property];
    }
    setOrdersByDate(formatedOrders);

    // const dates = {};
    // odersList.forEach((order) => {
    //   dates[moment(order.created).format("YYYY-MM-DD")] = { marked: true };
    // });
    // setMarkedDates(dates);
  };

  // const initMarkedDates = (odersList) => {
  //   const dates = {};
  //   odersList.forEach((order) => {
  //     dates[moment(order.created).format("YYYY-MM-DD")] = { marked: true };
  //   });
  //   setMarkedDates(dates);
  // };

  useEffect(() => {
    // setOrdersList(ordersStore.ordersList);
    initOrderItemsByDate(ordersStore.ordersList);
    // initMarkedDates(ordersStore.ordersList);
    setIsloading(false);
  }, [ordersStore.ordersList]);

  const [weekdDays, setWeekDays] = useState();
  const getNext7Days = () => {
    let days = [];
    let daysRequired = 7;

    for (let i = 0; i < daysRequired; i++) {
      let day = moment().add(i, "days");
      days.push({
        dayId: day.day(),
        dayLetter: day.format("dddd"),
        dayNumber: day.format("Do"),
        monthName: day.format("MMM"),
        date: day,
      });
    }

    setWeekDays(days);
  };
  useEffect(() => {
    getNext7Days();
  }, []);

  const isSelectedDay = (day) => {
    // moment(selectedDate,"YYYY-MM-DD").isSame(moment(day.date, "YYYY-MM-DD"))
    return (
      moment(selectedDate).format("YYYY-MM-DD") ===
      moment(day.date).format("YYYY-MM-DD")
    );
  };

  const updateSelectedDate = (date: any) => {
    setSelectedDate(moment(date).format("YYYY-MM-DD"));
  };

  const updateSelectedHour = (hour: any) => {
    setSelectedHour(hour);
  };

  const handleSaveDate = () => {
    const ddate = moment(selectedDate).format("YYYY-MM-DD");
    const orderDate = new Date(`${ddate} ${selectedHour}`);
    const awq = moment(`${ddate} ${selectedHour}`);

    handleSelectedDate(orderDate);
  };

  const closeDialog = () => {
    handleSelectedDate(null);
  };

  if (!weekdDays) {
    return;
  }

  return (
    <View style={{ height: "100%", backgroundColor: "transparent"}}>
      <ImageBackground
        source={require("../../../../assets/bg/bg.jpg")}
        resizeMode="cover"
        style={{ height: "100%" }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            height: "90%",
          }}
        >
          <View style={{ flexBasis: "25%" }}>
            {weekdDays.map((day) => {
              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: themeStyle.WHITE_COLOR,
                    marginVertical: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius:10
                  }}
                  onPress={() => updateSelectedDate(day.date)}
                >
                  <Text style={{fontSize:18}}>{moment(day.date).lang("ar").format("dddd")}</Text>
                  <Text style={{fontSize:18}}>
                    {moment(day.date).format("D")}/
                    {moment(day.date).format("M")}
                  </Text>
                  <View
                    style={isSelectedDay(day) ? styles.triangle : {}}
                  >
                             <LinearGradient
            colors={["#eaaa5c", "#a77948"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.background]}
          />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ flexBasis: "75%", paddingHorizontal: 8 }}>
            <OrderDayItem
              selectedHour={selectedHour}
              data={{ selectedDate: selectedDate, items: [] }}
              updateSelectedHour={updateSelectedHour}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "95%",
            justifyContent: "center",
            alignItems: "center",
            height: "10%",
            alignSelf: "center",
            marginTop: 8,
          }}
        >
          <View style={{ flexBasis: "80%" }}>
            <Button
              onClickFn={handleSaveDate}
              text={"agree"}
              textColor={themeStyle.WHITE_COLOR}
              fontSize={16}
              disabled={!selectedHour}
            />
          </View>
          {/* <View style={{ flexBasis: "49%" }}>
                <Button
                  onClickFn={handleSaveDate}
                  text={("edit-order")}
                  bgColor={themeStyle.GRAY_600}
                  textColor={themeStyle.WHITE_COLOR}
                  fontSize={16}
                />
              </View> */}
        </View>
      </ImageBackground>
    </View>
  );
};

export default observer(CalanderContainerUser);

const styles = StyleSheet.create({
  triangle: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#eaaa5c",
    transform: [{ rotate: "90deg" }],
    margin: 0,
    marginLeft: 0,
    borderWidth: 0,
    borderColor: "black",
    paddingHorizontal: 0,

    right: 0,
    position: "absolute",
  },
  background: {
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "0%",
    bottom: "0%",
  },
});
