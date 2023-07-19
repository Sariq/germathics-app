import { StyleSheet, View, TextInput, Image } from "react-native";
import InputText from "../../../../components/controls/input";
import Button from "../../../../components/controls/button/button";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import DropDown from "../../../../components/controls/dropdown";
import themeStyle from "../../../../styles/theme.style";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { StoreContext } from "../../../../stores";
import Icon from "../../../../components/icon";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { cdnUrl, studentStatuses } from "../../../../consts/shared";
import CheckBox from "../../../../components/controls/checkbox";
import BackButton from "../../../../components/back-button";
import { LinearGradient } from "expo-linear-gradient";
import SeatsScreen from "../../../../components/seats";
import PackageItemScreen from "../item";
import AddAttendanceScreen from "../add";

import AddPackageScreen from "../add";
import moment from "moment";
export type TProduct = {
  attendanceList: string;
};

const AttendanceListScreen = ({
  attendanceList,
  onClose,
  onSave,
  student = null,
}: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [isShowSeats, setIsShowSeats] = useState(false);
  const [isShowAddAttendance, setIsShowAddAttendance] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState<TProduct>();
  const [studentsList, setStudentsList] = useState<TProduct>();

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "كورس 1",
      count: 10,
    };
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  const getCourseById = (id: any) => {
    const course = coursesStore.coursesList.find((course) => course._id == id);
    return course;
  };

  const addPackage = () => {
    setSelectedAttendance(null);
    setIsShowAddAttendance(true);
  };

  const onCloseAddPackage = () => {
    setSelectedAttendance(null);
    setIsShowAddAttendance(false);
  };

  const onEditClick = (student) => {
    console.log("SSSSattendance", student)
    setSelectedAttendance(student);
    setIsShowAddAttendance(true);
  };

  // const handlePackageClick = (seatsList) => {
  //   setSelectedSeats(seatsList);
  //  setIsShowSeats(true);
  // };

  const handlePackageClick = (studentPackage) => {
    setSelectedAttendance(studentPackage);
    setIsShowAddAttendance(true);
  };

  const onCloseAddAtendance = () => {
    setSelectedSeats(null);
    setIsShowAddAttendance(false);
  };
  const onClosePackgeItem = () => {
    setSelectedAttendance(null);
    setIsShowAddAttendance(false);
  };

  const onSaveAttendace = (newPackage) => {
    onSave(newPackage);
    onCloseAddPackage();
    onClose();
  };
  if (!attendanceList) {
    return;
  }

  // if(isShowSeats){
  //   return(
  //     <SeatsScreen onClose={onCloseSeats} onSave={onSavePacakge} seats={selectedSeats}/>
  //   )
  // }

  if(isShowAddAttendance){
    return <AddAttendanceScreen onSave={onSaveAttendace} onClose={onCloseAddAtendance} attendanceData={selectedAttendance}/>
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton isClose={true} onClick={onClose} />
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <Text style={{ fontSize: 30 }}>{`قائمة الحضور`}</Text>
      </View>

      <View style={styles.cardListContainer}>
        {attendanceList.map((packageItem) => {
          return (
            <View style={[styles.cardContainer, {}]}>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: 40,
                  width: 40,
                  backgroundColor: themeStyle.WHITE_COLOR_300,
                  borderBottomLeftRadius: 20,
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: themeStyle.WHITE_COLOR_300,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomStartRadius: 20,
                      height: 40,
                      width: 40,
                    }}
                  >
                    <Icon
                      icon="trash"
                      size={20}
                      style={{
                        color: "red",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  height: 40,
                  width: 40,
                  backgroundColor: themeStyle.WHITE_COLOR_300,
                  borderTopStartRadius: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                  onPress={() => {
                    //onRemoveProduct(product, index);
                    onEditClick(packageItem);
                  }}
                >
                  <Icon
                    icon="pencil"
                    size={18}
                    style={{
                      color: themeStyle.PRIMARY_COLOR,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handlePackageClick(packageItem);
                }}
              >
                {/* <LinearGradient
                colors={[
                  "rgba(207, 207, 207, 0.4)",
                  "rgba(207, 207, 207, 0.4)",
                ]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background]}
              /> */}

                <View
                  style={{ flexDirection: "column", paddingHorizontal: 10 }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {t("التاريخ")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {" "}
                        {moment(packageItem.attendanceDate).format(
                          "DD-MM-YYYY"
                        )}{" "}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {t("ساعات الارشاد")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {packageItem.lectureHoursCount}{" "}
                      </Text>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                      <Text
                        style={{ color: themeStyle.WHITE_COLOR, fontSize: 20 }}
                      >
                        |
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {t("المبلغ")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {" "}
                        {packageItem.lectureHoursPrice}{" "}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {t("ساعات عامة")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {packageItem.generalHoursCount}{" "}
                      </Text>
                    </View>
                    <View style={{ marginHorizontal: 10 }}>
                      <Text
                        style={{ color: themeStyle.WHITE_COLOR, fontSize: 20 }}
                      >
                        |
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {t("المبلغ")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: themeStyle.WHITE_COLOR,
                        }}
                      >
                        {" "}
                        {packageItem.generalHoursPrice}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {/* <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
        <Button text={t("اضف باقه")} fontSize={20} onClickFn={addPackage} />
      </View> */}
    </ScrollView>
  );
};

export default observer(AttendanceListScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    minheight: 0,
    marginBottom: 20,
    borderRadius: 10,
    position: "relative",
    padding: 15,
    backgroundColor: themeStyle.PRIMARY_COLOR,
  },
  cardListContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
    overflow: "hidden",
    marginTop: 20,
  },
  container: {
    width: "100%",
    overflow: "hidden",
  },
  inputsContainer: {
    marginTop: 30,
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});