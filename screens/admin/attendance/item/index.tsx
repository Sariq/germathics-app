import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import InputText from "../../../../components/controls/input";
import Button from "../../../../components/controls/button/button";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../components/back-button";
import { TouchableOpacity } from "react-native-gesture-handler";
import themeStyle from "../../../../styles/theme.style";
import moment from "moment";
import SeatsScreen from "../../../../components/seats";

export type TProduct = {
  seats: any[];
};

const AttendanceItemScreen = ({ onClose, onSave, packageItem }) => {
  const { t } = useTranslation();

  const [packageData, setPackageData] = useState();

  useEffect(() => {
    // getMenu();
    setPackageData(packageItem);
  }, []);

  const handleSeatClick = (seat) => {
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

  const getBgColorByStatus = (status) => {
    switch (status) {
      case 0:
        return themeStyle.ORANGE_COLOR;
      case 1:
        return themeStyle.PRIMARY_COLOR;
      case 2:
        return themeStyle.SUCCESS_COLOR;
    }
  };

  const onSeatStatusChange = (seatsList)=>{
    const tmpPackage = {...packageData, seats: seatsList}
    setPackageData(tmpPackage);
    onSave(tmpPackage)
  }

  if (!packageData) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton isClose={true} onClick={onClose} />

      <View
        style={{
          marginTop: 60,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          backgroundColor: getBgColorByStatus(packageItem.status),
          margin: 15,
          height: "100%",
          paddingVertical:20
        }}
      >
        <SeatsScreen seats={packageItem.seats} onSave={onSeatStatusChange}/>

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

export default observer(AttendanceItemScreen);

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
    width: 90,
    height: 50,
    alignItems: "center",
    borderColor: themeStyle.WHITE_COLOR,
  },
  seatIconContainer: {
    borderWidth: 1,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    borderColor: themeStyle.WHITE_COLOR,
  },
});
