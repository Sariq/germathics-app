import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
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
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { cdnUrl, studentStatuses } from "../../../../consts/shared";
import CheckBox from "../../../../components/controls/checkbox";
import BackButton from "../../../../components/back-button";
import { LinearGradient } from "expo-linear-gradient";
import SeatsStatusOptionsScreen from "../../../../components/seats-status-options";
import { orderBy } from "lodash";

export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const StudentsListScreen = ({
  ids,
  title,
  isLecture,
  onApperanceChange,
  isAppeared,
  lectureData,
  onClose = null,
  subTitle = "",
}: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);

  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [studentsList, setStudentsList] = useState([]);
  const [lectureStudentsList, setLecutreStudentsList] = useState(
    lectureData?.studentsList || []
  );
  const [selectedList, setSelectedList] = useState([]);
  const [isSelectEnabeled, setIsSelectEnabeled] = useState(false);
  const [coursesList, setCoursesList] = useState<TProduct>();
  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "كورس 1",
      count: 10,
    };
  };

  const initCoursesList = () => {
    const courses = coursesStore.coursesList;
    console.log("courses", courses);
    let mappedCategories = courses.map((course, index) => {
      // if (categoryId && cours.categoryId === categoryId) {
      //   setSelectedCategoryId(index);
      // }
      return {
        label: course.name,
        value: course._id,
      };
    });
    mappedCategories.unshift({ label: "select course", value: "" });
    setCoursesList(mappedCategories);
  };
  useEffect(() => {
    if (!coursesStore.coursesList) {
      return;
    }
    initCoursesList();

    // }
  }, [coursesStore.coursesList]);
  const handleSelectedCategoryChange = (categoryId: any) => {
    console.log("categoryId", categoryId);
    setSelectedCategoryId(categoryId);
  };

  useEffect(() => {
    setSelectedProduct(initNewProduct());
  }, []);

  const handleSearchInputChange = (value: any) => {
    setSearchValue(value);
  };
  const handleStatusChange = (value: any) => {
    setStatusValue(value);
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  const getCourseById = (id: any) => {
    const course = coursesStore.coursesList.find((course) => course._id == id);
    return course;
  };

  useEffect(() => {
    setIsLoading(true);
    setStudentsList([]);
    studentsStore.getStudents(ids);
  }, []);

  const handleStudentClick = (student) => {
    if (isSelectEnabeled) {
      if (selectedList.includes(student._id)) {
        // If the ID exists, remove it from the array using the 'filter' method
        setSelectedList(selectedList.filter((item) => item !== student._id));
      } else {
        // If the ID doesn't exist, add it to the array using the spread operator
        setSelectedList([...selectedList, student._id]);
      }
      return;
    }
    if (!isLecture) {
      navigation.navigate("admin-students-item", { student });
    }
  };

  const onUpdateStudentsCategory = () => {
    studentsStore
      .updateStudentsCategory({
        ids: selectedList,
        newCategoryId: selectedCategoryId,
      })
      .then((res) => {
        coursesStore.getCourses().then((res) => handleOnClose());
      });
  };

  const onEditClick = (student) => {
    if (!isLecture) {
      navigation.navigate("admin-add-student", { student });
    }
  };

  const filterList = (studentsList) => {
    let filteredSearch = studentsList || [];

    if (searchValue !== "") {
      filteredSearch = filteredSearch?.filter((student) => {
        if (
          student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          student.phone.includes(searchValue)
        ) {
          return student;
        }
      });
    }
    if (statusValue !== "") {
      filteredSearch = filteredSearch?.filter((student) => {
        if (student.status.toLowerCase().includes(statusValue.toLowerCase())) {
          return student;
        }
      });
    } else {
      filteredSearch = filteredSearch?.filter((student) => {
        if (student.status.toLowerCase() != "inactive") {
          return student;
        }
      });
    }

    return orderBy(filteredSearch, ["createdDate"], ["desc"]);
  };

  const getSeatValue = (student) => {
    let currentSeatStatus = null;
    student.packagesList.forEach((currentPackage) => {
      currentPackage.seats.forEach((seat) => {
        if (seat.lectureId == lectureData.id) {
          currentSeatStatus = seat.status;
        }
      });
    });
    return currentSeatStatus;
  };

  const handleOnClose = () => {
    console.log("close");
    onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      setStudentsList(studentsStore.studentsList);
      setIsLoading(false);
    }, 1000);
  }, [studentsStore.studentsList]);

  if (!selectedProduct || !studentsList) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      {/* <View
        style={{
          height: "100%",
          justifyContent: "center",
          position: "absolute",
          alignSelf: "center",
          backgroundColor: "red",
          width: "100%",
        }}
      >
        <ActivityIndicator
          animating={true}
          size="large"
          color={themeStyle.PRIMARY_COLOR}
        />
      </View> */}
      {onClose ? (
        <BackButton isClose={true} onClick={handleOnClose} />
      ) : (
        <BackButton />
      )}
      <View style={{ alignItems: "center", marginVertical: 15 }}>
        <Text style={{ fontSize: 30 }}>{`قائمة الطلاب`}</Text>
        <Text style={{ fontSize: 25 }}>{`${title ? title : ""}`}</Text>
        <Text style={{ fontSize: 25 }}>{`${subTitle ? subTitle : ""}`}</Text>
      </View>

      <View
        style={{
          width: "100%",
          marginVertical: 20,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 20,
          zIndex: 3,
        }}
      >
        <View
          style={{
            flexBasis: "49%",
            justifyContent: "flex-start",
            paddingHorizontal: 10,
            flexDirection: "row",
          }}
        >
          {!isSelectEnabeled && (
            <TouchableOpacity
              onPress={() => setIsSelectEnabeled(!isSelectEnabeled)}
            >
              <Text style={{ fontSize: 18, textDecorationLine: "underline" }}>
                {t("اختر")}
              </Text>
            </TouchableOpacity>
          )}
          {isSelectEnabeled && (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flexBasis: "49%",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  opacity:
                    selectedList.length === 0 || !selectedCategoryId ? 0.3 : 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    onUpdateStudentsCategory();
                    setIsSelectEnabeled(!isSelectEnabeled);
                  }}
                  disabled={selectedList.length == 0 || !selectedCategoryId}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: themeStyle.SUCCESS_COLOR,
                      textDecorationLine: "underline",
                    }}
                  >
                    {t("حفظ")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexBasis: "49%",
                  justifyContent: "flex-start",

                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsSelectEnabeled(!isSelectEnabeled)}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: themeStyle.ERROR_COLOR,
                      textDecorationLine: "underline",
                    }}
                  >
                    {t("الغاء")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={{ flexBasis: "49%" }}>
          {coursesList && isSelectEnabeled && (
            <View style={{ alignItems: "flex-start" }}>
              <DropDown
                itemsList={coursesList}
                defaultValue={selectedCategoryId}
                onChangeFn={(e) => handleSelectedCategoryChange(e)}
              />
            </View>
          )}
        </View>
      </View>

      {!onClose && (
        <View
          style={{
            width: "100%",
            marginVertical: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            zIndex: 2,
          }}
        >
          <View style={{ flexBasis: "49%" }}>
            <InputText
              onChange={(e) => handleSearchInputChange(e)}
              label={t("بحث")}
              value={searchValue}
            />
            {!selectedProduct?.name && (
              <Text style={{ color: themeStyle.ERROR_COLOR }}>
                {t("invalid-name")}
              </Text>
            )}
          </View>
          <View style={{ flexBasis: "40%" }}>
            <DropDown
              itemsList={studentStatuses}
              defaultValue={statusValue}
              onChangeFn={(e) => handleStatusChange(e)}
            />
          </View>
        </View>
      )}
      <View style={[styles.cardListContainer]}>
        {studentsList.length == 0 && isLoading ? (
          <View style={{ height: "100%", justifyContent: "center" }}>
            <ActivityIndicator
              animating={true}
              color={themeStyle.PRIMARY_COLOR}
              size={"large"}
            />
          </View>
        ) : (
          filterList(studentsList)?.map((student) => {
            return (
              <View
                style={[
                  styles.cardContainer,
                  {
                    backgroundColor: student.isPayDelay
                      ? "red"
                      : themeStyle.STUDENT_COLOR,
                  },
                ]}
              >
                {isSelectEnabeled && (
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
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
                          borderTopStartRadius: 20,
                          height: 40,
                          width: 40,
                        }}
                      >
                        <CheckBox
                          value={selectedList.indexOf(student._id) > -1}
                          onChange={() => {}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {!onClose && (
                  <>
                    {/* <View
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
                    </View> */}
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: 40,
                        width: 40,
                        backgroundColor: themeStyle.WHITE_COLOR_300,
                        borderBottomLeftRadius: 20,
                        zIndex: 5,
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
                          onEditClick(student);
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
                  </>
                )}
                <TouchableOpacity
                  onPress={() => {
                    handleStudentClick(student);
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
                          {t("الاسم")}:
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
                          {student.name}{" "}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            color: themeStyle.WHITE_COLOR,
                          }}
                        >
                          {t("رقم الهاتف")}:
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
                          {student.phone}{" "}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 15 }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            color: themeStyle.WHITE_COLOR,
                          }}
                        >
                          {t("اسم الدورة")}:
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
                          {getCourseById(student.categoryId)?.name}{" "}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {isLecture && (
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <View>
                      <Text
                        style={{ fontSize: 20, color: themeStyle.WHITE_COLOR }}
                      >
                        {t("حضور")}:
                      </Text>
                    </View>
                    <View>
                      {/* <CheckBox
                      onChange={(e) => onApperanceChange(e, student._id)}
                      value={getIsAppearedByStudentId(student._id)}
                    /> */}
                      <SeatsStatusOptionsScreen
                        value={getSeatValue(student)}
                        onSave={(value) =>
                          onApperanceChange(value, student._id)
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default observer(StudentsListScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    minheight: 100,
    marginBottom: 20,
    borderRadius: 10,
    position: "relative",
    padding: 15,
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
