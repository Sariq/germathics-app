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
import { orderBy } from "lodash";

import StudentsListScreen from "../../students/list";
import LecturesListScreen from "../../lectures/list";
export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const CoursesListScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { menuStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selctedCourseStudentsList, setSelctedCourseStudentsList] = useState();
  const [selctedLecturesList, setSelctedLecturesList] = useState();
  const [selctedCourse, setSelctedCourse] = useState();

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();

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

  const handleOpenStudents = (course: any) => {
    setSelctedCourse(course);
    setSelctedCourseStudentsList(course?.studentsList);
  };
  const onStudentsListClose = (studentsIds: any, course: any) => {
    setSelctedCourseStudentsList(undefined);
  };

  const handleOpenLectures = (lectures: any, course: any) => {
    setSelctedCourse(course);
    setSelctedLecturesList(lectures);
  };
  const onLecturesClose = (lectures: any, course: any) => {
    setSelctedCourse(null);
    setSelctedLecturesList(null);
  };

  const onSaveLecture = (lecturesList: any) => {
    const tmpCourse = { ...selctedCourse };
    tmpCourse.lectures = lecturesList;
    menuStore.addOrUpdateProduct(tmpCourse, true).then((res: any) => {
      menuStore.getMenu();
      setIsLoading(false);
    });
  };

  useEffect(() => {
    coursesStore.getCourses();
  }, []);

  useEffect(() => {
    handleOpenStudents(selctedCourse)
  }, [coursesStore.coursesList]);


  const filterList = (itemsList) => {
    return orderBy(itemsList,['createdDate'], ["desc"])
  }

  if (!coursesStore.coursesList) {
    return;
  }

  if (selctedCourseStudentsList) {
    return (
      <StudentsListScreen
        title={selctedCourse.name}
        ids={selctedCourseStudentsList}
        onClose={onStudentsListClose}
      />
    );
  }
  if (selctedLecturesList) {
    return (
      <LecturesListScreen
        title={selctedCourse.name}
        lectures={selctedLecturesList}
        course={selctedCourse}
        onSave={onSaveLecture}
        onClose={onLecturesClose}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />

      <View style={{ alignItems: "center", marginTop: 15 }}>
        <Text style={{ fontSize: 30 }}>{"قائمة الدورات"}</Text>
      </View>
      <View style={styles.cardListContainer}>
        {(coursesStore.coursesList)?.map((course) => {
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
                    <Text
                      style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                    >
                      {t("الاسم")}:
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                    >
                      {" "}
                      {course.name}{" "}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <View>
                    <Text
                      style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                    >
                      {t("عدد اللقائات")}:
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                    >
                      {" "}
                      {course.lectures?.length}{" "}
                    </Text>
                  </View>
                </View>
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
                <View style={{ flexBasis: "48%" }}>
                  <Button
                    text={t("قائمة الطلاب")}
                    fontSize={14}
                    onClickFn={() =>
                      handleOpenStudents(course)
                    }
                    // isLoading={isLoading}
                    // disabled={isLoading}
                    textColor={themeStyle.TEXT_PRIMARY_COLOR}
                    bgColor={themeStyle.WHITE_COLOR}
                  />
                </View>
                <View style={{ flexBasis: "48%", }}>
                  <Button
                    text={t("قائمة اللقائات")}
                    fontSize={14}
                    onClickFn={() =>
                      handleOpenLectures(course.lectures, course)
                    }
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
    </ScrollView>
  );
};

export default observer(CoursesListScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: themeStyle.COURSE_COLOR,
    marginTop: 20,
  },
  cardListContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
    alignItems: "center",
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
