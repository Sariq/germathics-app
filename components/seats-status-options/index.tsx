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

export type TProduct = {
  seats: any[];
};

const seatOptions = [
    {
        label: 'V',
        value: 1
    },
    {
        label: 'X',
        value: 2
    },
    {
        label: '/',
        value: 3
    },
]

const SeatsStatusOptionsScreen = ({ value, onSave }) => {
  const { t } = useTranslation();

  useEffect(() => {
    // getMenu();
  }, []);

  const handleSeatOptionClick = (seatOption) => {
    console.log(seatOption);
    onSave(seatOption.value)
  };
  console.log("baa",value)

  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return "";
      case 1:
        return "V";
      case 2:
        return "X";
      case 3:
        return "o";
    }
  };



  return (

      <View
        style={{
          flexDirection: "row",
        }}
      >
        {seatOptions.map((seatStatus) => {
          return (
            <View>
              <TouchableOpacity
                style={[styles.seatContainer, {borderColor: value === seatStatus.value ? themeStyle.SUCCESS_COLOR : themeStyle.WHITE_COLOR }]}
                onPress={() => handleSeatOptionClick(seatStatus)}
              >
                <Text style={{color: themeStyle.WHITE_COLOR, fontSize: 20}}>{(seatStatus.label)}</Text>
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
  );
};

export default observer(SeatsStatusOptionsScreen);

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
    marginHorizontal: 15,
    borderWidth: 1,
    width:30,
    height:30,
    color: themeStyle.WHITE_COLOR,
    alignItems: "center"
  },
});
