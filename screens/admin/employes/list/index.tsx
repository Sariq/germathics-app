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
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { cdnUrl, studentStatuses } from "../../../../consts/shared";
import CheckBox from "../../../../components/controls/checkbox";
import BackButton from "../../../../components/back-button";
import { LinearGradient } from "expo-linear-gradient";
import SeatsStatusOptionsScreen from "../../../../components/seats-status-options";

export type TProduct = {
  id?: string;
  name: string;
  count: string;
};

const EmployesListScreen = ({
  ids,
  title,
  isLecture,
  onApperanceChange,
  isAppeared,
  lectureData,
  onClose = null,
  subTitle = ''
}: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const routeState = useNavigationState((state) => state);

  const { menuStore, employesStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [employesList, setStudentsList] = useState<TProduct>();
  const [lectureStudentsList, setLecutreStudentsList] = useState(
    lectureData?.employesList || []
  );

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

  const handleSearchInputChange = (value: any) => {
    setSearchValue(value);
  };
  const handleStatusChange = (value: any) => {
    setStatusValue(value);
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

  const getCourseById = (id: any) => {
    const course = coursesStore.coursesList.find((course) => course._id == id);
    return course;
  };

  useEffect(() => {
    employesStore.getEmployes(ids);
  }, []);

  const handleStudentClick = (student) => {
      navigation.navigate("admin-employes-item", { student });
  };

  const onEditClick = (student) => {
    if (!isLecture) {
      navigation.navigate("admin-add-employe", { student });
    }
  };

  const getIsAppearedByStudentId = (id: any) => {
    const student = lectureStudentsList.find(
      (student) => student.studentId === id
    );
    return student?.isAppeard;
  };

  const filterList = (employesList) => {
    let filteredSearch = employesList;

    if (searchValue !== "") {
      filteredSearch = filteredSearch.filter((student) => {
        if (student.name.toLowerCase().includes(searchValue.toLowerCase())) {
          return student;
        }
      });
    }
    if (statusValue !== "") {
      filteredSearch = filteredSearch.filter((student) => {
        if (student.status.toLowerCase().includes(statusValue.toLowerCase())) {
          return student;
        }
      });
    }

    return filteredSearch;
  };

  const getPaidDeltaColor = (student) => {
    if (student.status === "paid") {
      const delta = student.apperanceCount - student.totalLecturesPaid;
      let color = null;
      if (delta <= 2 && delta > 0) {
        color = "#FFD700";
      }
      if (delta === 3) {
        color = "orange";
      }
      if (delta >= 4) {
        color = "red";
      }
      return color;
    }
    return null;
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

  if (!selectedProduct || !employesStore.employesList) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      {onClose ? (
        <BackButton isClose={true} onClick={onClose} />
      ) : (
        <BackButton />
      )}
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <Text style={{ fontSize: 30 }}>{`قائمة المرشدين`}</Text>
        {title && <Text style={{ fontSize: 25 }}>{`${title ? title : ""}`}</Text>}
        {subTitle && <Text style={{ fontSize: 25 }}>{`${subTitle ? subTitle : ""}`}</Text>}
      </View>
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
            label={t("الاسم")}
            value={searchValue}
          />
          {!selectedProduct?.name && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-name")}
            </Text>
          )}
        </View>

      </View>
      <View style={styles.cardListContainer}>
        {filterList(employesStore.employesList).map((student) => {
          return (
            <View
              style={[
                styles.cardContainer,
                {
                  backgroundColor:
                    getPaidDeltaColor(student) || themeStyle.EMPLOYE_COLOR,
                },
              ]}
            >
              { !onClose && 
              
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
                  bottom: 0,
                  height: 40,
                  width: 40,
                  backgroundColor: themeStyle.WHITE_COLOR_300,
                  borderTopStartRadius: 20,
                  zIndex:5

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
              </>}
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
                      onSave={(value) => onApperanceChange(value, student._id)}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default observer(EmployesListScreen);

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
