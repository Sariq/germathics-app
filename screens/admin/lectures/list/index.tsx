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
import StudentsListScreen from "../../students/list";
import AddLectureScreen from "../add";
import moment from "moment";

export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const LecturesListScreen = ({ lectures, course,title, onSave, onClose }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { menuStore, coursesStore, studentsStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLecture, setIsAddLecture] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [selectedLecture, setSelectedLecture] = useState();
  const [selctedCourseStudentsList, setSelctedCourseStudentsList] = useState();
  const [lecturesList, setLecturesList] = useState(lectures);

  

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

  useEffect(() => {
    setSelectedProduct(initNewProduct());
  }, []);

  const handleInputChange = (value: any, name: string) => {
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handlAddClick = () => {
    if (selectedProduct) {
      setIsLoading(true);
      //uploadImage(imgFile).then((res) => {
      let updatedData: TProduct = null;

      updatedData = { ...selectedProduct };

      setSelectedProduct(updatedData);
      menuStore.addOrUpdateProduct(updatedData, isEditMode).then((res: any) => {
        menuStore.getMenu();
        setIsLoading(false);
        //navigateToMenu();
      });

      //});
    }
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  const handleOpenStudents = (lecture: any) => {
    setSelectedLecture(lecture);
    const studentsIds = course.studentsList.map(
      (student) => student
    );
    setSelctedCourseStudentsList(studentsIds);
  };
  const onStudentsListClose = () => {
    setSelectedLecture(undefined);
    setSelctedCourseStudentsList(undefined);
  };


  // const onApperanceChange = (isAppeard, studentId) => {
  //   coursesStore.updateStudentAppearance({
  //     categoryId: course._id,
  //     lectureId: selectedLecture.id,
  //     studentId: studentId,
  //     isAppeard: isAppeard,
  //   }).then((res)=>{
  //     studentsStore.getStudents();
  //   })
  // };
  const onApperanceChange = (seatStatus, studentId) => {
    coursesStore.updateStudentAppearance({
      categoryId: course._id,
      studentId: studentId,
      seatStatus: seatStatus,
      lectureId: selectedLecture.id,
      lectureDate: selectedLecture.createdDate
    }).then((res)=>{
      studentsStore.getStudents(selctedCourseStudentsList);
    })
  };

  const handleAddLecture = () => {
    setIsAddLecture(true)
  }
  const onAddLectureClose = () => {
    setIsAddLecture(false)
  }

  const onLectureSave = (newLecture) => {
    const tmpLecturesList = [...lecturesList];
    tmpLecturesList.push(newLecture);
    setLecturesList(tmpLecturesList);
    onSave(tmpLecturesList)
    setIsAddLecture(false)

  }

  if (selctedCourseStudentsList) {
    return (
      <StudentsListScreen
        ids={selctedCourseStudentsList}
        title={`${title}`}
        subTitle={` لقاء - ${moment(selectedLecture.createdDate).format("DD/MM/YYYY")}`}
        isLecture={true}
        onApperanceChange={onApperanceChange}
        lectureData={selectedLecture}
        onClose={onStudentsListClose}

      />
    );
  }

  if(isAddLecture){
    return <AddLectureScreen onClose={onAddLectureClose} onSave={onLectureSave}/>
  }
  return (
    <ScrollView style={styles.container}>
      {onClose ? (
        <BackButton isClose={true} onClick={onClose} />
      ) : (
        <BackButton />
      )}
            <View style={{ alignItems: "center", marginTop:15 }}>
        <Text style={{ fontSize: 30 }}>{`قائمة اللقائات`}</Text>
        <Text style={{ fontSize: 25 }}>{`${title ? title : ''}`}</Text>

      </View>
      <View style={styles.cardListContainer}>
        {lecturesList?.map((lecture, index) => {
          return (
            <View style={styles.cardContainer}>
        
              {/* <View
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      // backgroundColor: themeStyle.WHITE_COLOR,
                      height: 45,
                      borderRadius: 20,
                      width: 50,
                      alignItems: "flex-end",
                    }}
                  >
                    <Icon
                      icon="trash"
                      size={20}
                      style={{
                        right: 20,
                        top: 17,
                        color: "red",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View> */}
              <View style={{ flexDirection: "column", paddingHorizontal: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={{ fontSize: 20, color: themeStyle.WHITE_COLOR  }}>{t("لقاء")}:</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 20, color: themeStyle.WHITE_COLOR  }}> {index + 1} </Text>
                  </View>
                </View>
                {/* <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <View>
                    <Text style={{ fontSize: 20, color: themeStyle.WHITE_COLOR  }}>{t("عدد اللقائات")}:</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 20, color: themeStyle.WHITE_COLOR  }}> {lecture.phone} </Text>
                  </View>
                </View> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: 18,
                  width: "100%",
                  paddingHorizontal: 5,
                }}
              >
                <View style={{ flexBasis: "47%" }}>
                  <Button
                    text={t("قائمة الطلاب")}
                    fontSize={14}
                    onClickFn={() => handleOpenStudents(lecture)}
                    // isLoading={isLoading}
                    // disabled={isLoading}
                    textColor={themeStyle.TEXT_PRIMARY_COLOR}
                    bgColor={themeStyle.WHITE_COLOR}
                    />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("اضف لقاء")}
            fontSize={20}
            onClickFn={handleAddLecture}
            isLoading={isLoading}
            disabled={isLoading || !isValidForm()}
          />
        </View>
    </ScrollView>
  );
};

export default observer(LecturesListScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: themeStyle.LECTURE_COLOR,
    alignItems:"center"
  },
  cardListContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    marginTop:20
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
