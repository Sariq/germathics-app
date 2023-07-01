import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from "react-native";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import moment from "moment";
import { useState, useEffect, useContext, useRef } from "react";
import { isEmpty } from "lodash";
import themeStyle from "../../../../styles/theme.style";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../components/controls/button/button";
import { StoreContext } from "../../../../stores";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../../../consts/api";
import Carousel from "react-native-reanimated-carousel";

export type TProps = {
  data: any;
  updateSelectedHour: any;
  selectedHour: string;
};

const OrderDayItem = ({ data, updateSelectedHour, selectedHour }: TProps) => {
  const { calanderStore } = useContext(StoreContext);
  const [dayHours, setDayhours] = useState();
  const [isDayHoursReady, setIsDayHoursReady] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carousleRef = useRef(null);

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      initData();
    }
  }, [lastJsonMessage]);

  const initDeafaulHours = () => {
    const deafultDayH = {};
    for (let i = 10; i <= 22; i++) {
      deafultDayH[i + ":00"] = {
        isDisabled: false,
        isSelected: i + ":00" === selectedHour,
      };
    }
    return deafultDayH;
  };

  const initData = () => {
    const deafultDayHours = initDeafaulHours();
    setDayhours(deafultDayHours);
    setIsDayHoursReady(true);
  };
  useEffect(() => {
    initData();

  }, []);
  useEffect(() => {
    // if (isEmpty(data?.items)) {
    //   return;
    // }
    if (!data?.selectedDate || !dayHours) {
      return;
    }
    initDay();
  }, [data, isDayHoursReady]);

  const initDay = () => {
    calanderStore.getDisabledHoursByDate(data?.selectedDate).then((res) => {
      //updateDisabledHours(res);
      initDayOrders(res);
    });
  };

  const updateDisabledHours = (disabledHoursList: any) => {};
  const initDayOrders = async (disabledHoursList: any) => {
    let deafultDayHoursTemp = initDeafaulHours();
    // var sorted_meetings = data?.items[data?.selectedDate]?.sort((a, b) => {
    //   return new Date(a.created).getTime() - new Date(b.created).getTime();
    // });
    // sorted_meetings?.forEach(async (order) => {
    //   const orderHour =
    //     moment(order.created).zone("-0000").format("HH") + ":00";

    deafultDayHoursTemp = {
      ...deafultDayHoursTemp,
      // [orderHour]: {
      //   orders: [...deafultDayHoursTemp[orderHour].orders, order],
      // },
    };
    //});

    disabledHoursList?.forEach(async (item) => {
      deafultDayHoursTemp = {
        ...deafultDayHoursTemp,
        [item.hour]: {
          isDisabled: true,
          isSelected: false,
        },
      };
    });
    setActiveSlide(0)

    setDayhours(deafultDayHoursTemp);
  };

  useEffect(()=>{
    if(dayHours && activeSlide !== undefined){
      handleSelectedHour(Object.keys(dayHours)[activeSlide])
    }
  }, [dayHours,activeSlide])

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
  const handleSelectedHour = (dayKey: any) => {
    // let updateDayHours = {};
    // Object.keys(dayHours).map((key) => {
    //   updateDayHours[key] = {
    //     ...dayHours[key],
    //     isSelected: key===dayKey
    //   }
    // })
    updateSelectedHour(dayKey);
    // setDayhours({...updateDayHours})
  };

  useEffect(() => {
    if (!dayHours) {
      return;
    }
    let updateDayHours = {};

    Object.keys(dayHours).map((key) => {
      updateDayHours[key] = {
        ...dayHours[key],
        isSelected: key === selectedHour,
      };
    });
    setDayhours({ ...updateDayHours });
  }, [selectedHour]);

  const handleDayItemBGColor = (day: any) => {
    if (day.isDisabled) {
      return "rgba(255,255,255,0.4)";
    }
    if (day.isSelected) {
      return themeStyle.SUCCESS_COLOR;
    }
    return themeStyle.WHITE_COLOR;
  };

  const getFontSize = (activeSlide, index) => {
    if (activeSlide === index) {
      return 50;
    }
    const beforeOne =
      activeSlide - 1 < 0
        ? Object.keys(dayHours)[Object.keys(dayHours).length - 1]
        : Object.keys(dayHours)[activeSlide - 1];
    const beforeTwo =
      activeSlide - 2 < 0
        ? Object.keys(dayHours)[Object.keys(dayHours).length - 2]
        : Object.keys(dayHours)[activeSlide - 2];

    const afterOne =
      activeSlide + 1 > Object.keys(dayHours).length - 1
        ? Object.keys(dayHours)[0]
        : Object.keys(dayHours)[activeSlide + 1];
    const afterTwo =
      activeSlide + 2 > Object.keys(dayHours).length - 1
        ? Object.keys(dayHours)[1]
        : Object.keys(dayHours)[activeSlide + 2];

    if (
      Object.keys(dayHours)[index] === beforeOne ||
      Object.keys(dayHours)[index] === afterOne
    ) {
      return 40;
    }
     if(Object.keys(dayHours)[index] === beforeTwo || Object.keys(dayHours)[index] === afterTwo){
       return 40;
     }

    return 1;
  };

  const handleTimeSelect = (index) => {
    setActiveSlide(index)
    handleSelectedHour(Object.keys(dayHours)[index])
  }

  if (!dayHours) {
    return;
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <View style={{height:150, overflow:"hidden", alignItems:"center"}}>
        <Carousel
          ref={carousleRef}
          loop
          width={200}
          height={300}
          autoPlay={false}
          data={Object.keys(dayHours)}
          scrollAnimationDuration={200}
          autoPlayInterval={3000}
          vertical={true}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 250,
          }}
          onSnapToItem={(index) => handleTimeSelect(index)}
          defaultIndex={0}
          renderItem={({ index }) => (
            <Animated.View
              style={{
                alignSelf: "center",
                position: "absolute",
                top:
                  carousleRef?.current?.getCurrentIndex() === index ? 30 : 30,
                opacity:
                  carousleRef?.current?.getCurrentIndex() === index ? 1 : 0.7,
                // transform: [
                //   {
                //     scale: getFontSize(
                //       carousleRef?.current?.getCurrentIndex(),
                //       index
                //     ),
                //   },
                // ],
              }}
            >
              <Text style={{ textAlign: "center", fontSize: getFontSize(
                      carousleRef?.current?.getCurrentIndex(),
                      index
                    ), }}>
                {Object.keys(dayHours)[index]}
              </Text>
            </Animated.View>
          )}
        />
        {/* {Object.keys(dayHours).map((key) => {
          return (
            <TouchableOpacity onPress={()=>handleSelectedHour(key)} disabled={dayHours[key].isDisabled}>
              <View
                style={{
                  padding: 20,
                  backgroundColor: handleDayItemBGColor(dayHours[key]),
                  marginVertical: 15,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text style={{ fontSize: 20 }}>{key}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })} */}
      </View>
    </View>
  );
};

export default observer(OrderDayItem);
const gap = 8;
const styles = StyleSheet.create({
  hourOrdersContainer: {
    flexDirection: "row",
    paddingHorizontal: gap / -2,
    left: 10,
  },
  hourOrderContainer: {
    marginHorizontal: gap / 2,
    padding: 10,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 10,
  },
});
