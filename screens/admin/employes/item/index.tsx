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
import { cdnUrl } from "../../../../consts/shared";
import CheckBox from "../../../../components/controls/checkbox";
import BackButton from "../../../../components/back-button";
import { LinearGradient } from "expo-linear-gradient";
import AddAttendanceScreen from "../../attendance/add";
import AttendanceListScreen from "../../attendance/list";

export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const EpmloyeItemScreen = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { student } = route.params;

  const { menuStore, employesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAddAttendance, setIsShowAddAttendance] = useState(false);
  const [isShowAddAttendanceList, setIsShowAddAttendanceList] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [attendanceList, setAttendanceList] = useState();

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "كورس 1",
      count: 10,
    };
  };

  const isValidForm = () => {
    return selectedProduct?.name && selectedProduct?.count;
  };

  const handleInputChange = (value: any, name: string) => {
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handlAddClick = () => {
    setIsShowAddAttendance(true);
  };

  useEffect(() => {}, []);

  useEffect(()=>{
      if(student.attendanceList){
        setAttendanceList(attendanceList)
      }
 
  },[])

  const onSaveAttendace = (data) => {
    console.log("data",data)
    console.log("student",student)
    setIsShowAddAttendance(false);
    setIsLoading(true);

    const foundAttendance = student.attendanceList.find((attendance)=> attendance.id === data.id);
    console.log("foundAttendance",foundAttendance)
    let tmpAttendanceList = [];
    if(foundAttendance?.length > 0){
      tmpAttendanceList = student.attendanceList.map((attendance)=>{
        if(attendance.id === data.id){
          return data;
        }else{
          return attendance;
        }
      });
    }else{
      tmpAttendanceList.push(data);
    }
 
    console.log("tmpAttendanceList",tmpAttendanceList)

    const tempStudent = {
      ...student,
      attendanceList: tmpAttendanceList
    }
    employesStore.addEmployes(tempStudent, true).then((res: any) => {
      setIsLoading(false);
      navigation.navigate("admin-dashboard");
    });
    setSelectedProduct(tempStudent)
  }
  const onCloseAddAtendance = () => {
    setIsShowAddAttendance(false);
  }

  const handlOpenAttendanceListClick = () => {
    setIsShowAddAttendanceList(true);
  }
  const onCloseAddAtendanceList = () => {
    setIsShowAddAttendanceList(false);
  }

  if(isShowAddAttendance){
    return <AddAttendanceScreen onSave={onSaveAttendace} onClose={onCloseAddAtendance}/>
  }
  if(isShowAddAttendanceList){
    return <AttendanceListScreen onSave={onSaveAttendace} onClose={onCloseAddAtendanceList} attendanceList={student.attendanceList}/>
  }

 
  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 30,marginTop:20 }}>{student.name}</Text>
      </View>
      <View style={styles.cardListContainer}>
      <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("اضف حضور")}
            fontSize={20}
            onClickFn={handlAddClick}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("قائمة الحضور")}
            fontSize={20}
            onClickFn={handlOpenAttendanceListClick}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(EpmloyeItemScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    minheight: 100,
    marginBottom: 10,
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
