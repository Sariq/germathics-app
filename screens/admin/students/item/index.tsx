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
import * as Linking from "expo-linking";

export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const StudentItemScreen = ({ route }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { student } = route.params;

  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [coursesList, setCoursesList] = useState();

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

  useEffect(() => {}, []);

  useEffect(() => {
    if (student.categoryIdList) {
      const courses = coursesStore.getCoursesByIds([
        ...new Set(student.categoryIdList),
      ]);
      setCoursesList(courses);
    }
  }, []);

  const handleCallStudent = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          top: 15,
          left: 10,
          borderWidth: 3,
          borderRadius: 50,
          padding: 5,
          borderColor: themeStyle.SUCCESS_COLOR,
        }}
      >
        <TouchableOpacity onPress={() => handleCallStudent(student.phone)}>
          <Icon
            icon="phone1"
            size={25}
            style={{ color: themeStyle.SUCCESS_COLOR }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginBottom: 20, marginTop: 15 }}>
        <Text style={{ fontSize: 30 }}>{student.name}</Text>
      </View>
      <View style={styles.cardListContainer}>
        {coursesList?.map((course) => {
          return (
            <View style={styles.cardContainer}>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: themeStyle.WHITE_COLOR_300,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomStartRadius: 20,
                      padding: 10,
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

              <TouchableOpacity
                onPress={() => {
                  // handleStudentClick(student);
                }}
              >
                <View
                  style={{ flexDirection: "column", paddingHorizontal: 10 }}
                >
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View>
                      <Text
                        style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                      >
                        {t("اسم الكورس")}:
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
                        {t("الحضور")}:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                      >
                        {" "}
                        {student.apperanceCount}
                        {"/"}
                        {student.totalLecturesPaid}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default observer(StudentItemScreen);

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
