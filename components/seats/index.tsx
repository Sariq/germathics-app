import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import InputText from "../controls/input";
import Button from "../controls/button/button";
import Text from "../controls/Text";
import { observer } from "mobx-react";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../back-button";
import { TouchableOpacity } from "react-native-gesture-handler";
import themeStyle from "../../styles/theme.style";
import moment from "moment";
import PaymentFailedDialog from "../dialogs/payment-failed";
import { StoreContext } from "../../stores";

export type TProduct = {
  seats: any[];
};

const SeatsScreen = ({ onClose = null, onSave = null, seats }) => {
  const { t } = useTranslation();
  const { coursesStore } = useContext(StoreContext);

  const [showSeatsOptionsDialog, setShowSeatsOptionsDialog] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState();
  const [seatsList, setSeatsList] = useState();

  useEffect(() => {
    setSeatsList(seats)
  }, []);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowSeatsOptionsDialog(true)
  };
  const handleSeatOptionAnswer = (value) => {
    const tmpSeatsList = seatsList.map((seat)=>{
        if(seat.id == selectedSeat.id){
            return {
                ...seat,
                status: value
            }
        }else{
            return seat;
        }
    })
    setSeatsList(tmpSeatsList)
    onSave(tmpSeatsList);
    setShowSeatsOptionsDialog(false)
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return "";
      case 1:
        return "V";
      case 2:
        return "X";
      case 3:
        return "/";
    }
  };

  const getCourseById = (courseId) => {
    const courses = coursesStore.getCoursesByIds([courseId]);
    return courses[0];
  }

  if (!seatsList) {
    return;
  }


  return (
    <ScrollView style={styles.container}>
     {onClose &&  <BackButton isClose={true} onClick={onClose} />}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        {seatsList.map((seat) => {
          return (
            <View style={[styles.seatContainer]}>
                <Text style={{color:themeStyle.WHITE_COLOR, height:20, marginBottom:5}}>{getCourseById(seat?.categoryId)?.name}</Text>
                <Text style={{color:themeStyle.WHITE_COLOR, height:20, marginBottom:5}}>{seat.lectureDate && moment(seat.lectureDate).format("DD-MM-YY")}</Text>
              <TouchableOpacity
                style={[styles.seatIconContainer]}
                onPress={() => handleSeatClick(seat)}
              >
                <Text style={{color: themeStyle.WHITE_COLOR}}>{getStatusIcon(seat.status)}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        {/* 
        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("approve")}
            fontSize={20}
            onClickFn={handlAddClick}

          />
        </View> */}
      </View>
      <PaymentFailedDialog
        handleAnswer={handleSeatOptionAnswer}
        isOpen={showSeatsOptionsDialog}
        value={selectedSeat?.status}
      />
    </ScrollView>
  );
};

export default observer(SeatsScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  inputsContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  seatContainer: {
    padding: 10,
    width:90,
    height:50,
    alignItems:"center",
    borderColor: themeStyle.WHITE_COLOR,
    marginVertical:20
  },
  seatIconContainer: {
    borderWidth: 2,
    padding: 10,
    width:40,
    height:40,
    alignItems:"center",
    borderColor: themeStyle.WHITE_COLOR
  },
});
