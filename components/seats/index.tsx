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

export type TProduct = {
  seats: any[];
};

const SeatsScreen = ({ onClose = null, onSave = null, seats }) => {
  const { t } = useTranslation();

  useEffect(() => {
    // getMenu();
  }, []);

  const handleSeatClick = (seat) => {
    console.log(seat);
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

  console.log("seats", seats);
  if (!seats) {
    return;
  }


  return (
    <ScrollView style={styles.container}>
     {onClose &&  <BackButton isClose={true} onClick={onClose} />}

      <View
        style={{
          marginTop: 60,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          backgroundColor: themeStyle.PRIMARY_COLOR,
          margin:15,
          height: "100%"
        }}
      >
        {seats.map((seat) => {
          return (
            <View style={[styles.seatContainer]}>
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
    </ScrollView>
  );
};

export default observer(SeatsScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginBottom: 30,
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
    margin: 15,
    padding: 10,
    width:90,
    height:50,
    alignItems:"center",
    borderColor: themeStyle.WHITE_COLOR
  },
  seatIconContainer: {
    borderWidth: 1,
    padding: 10,
    width:40,
    height:40,
    alignItems:"center",
    borderColor: themeStyle.WHITE_COLOR
  },
});
