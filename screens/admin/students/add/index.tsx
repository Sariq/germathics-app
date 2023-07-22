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
import AddPackageScreen from "../../package/add";
import PackagesListScreen from "../../package/list";
import { uuidv4 } from "../../../../utils/shared";

export type TProduct = {
  id?: string;
  name: string;
  status: string;
  phone: string;
  fatherPhone: string;
  motherNumber: string;
  categoryId?: string;
  // totalPaidPrice?: number;
  // totalLecturesPaid?: number;
  packagesList?: any;
};

const AddStudentScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { student } = route.params;
  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [coursesList, setCoursesList] = useState<TProduct>();
  const [isAddPacakge, setIsAddPacakge] = useState(false);
  const [isShowPackagesList, setIsShowPackagesList] = useState(false);

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "ساري",
      status: "",
      phone: "0542454362",
      packagesList: [],
    };
  };

  const isValidForm = () => {
    return (
      selectedProduct?.name && selectedProduct?.status
      // selectedProduct?.totalPaidPrice
    );
  };

  const initCoursesList = () => {
    const courses = coursesStore.coursesList;
    console.log("courses",courses)
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

    if (student) {
      setIdEditMode(true);
      const tmpStudent = {
        ...student,
        id: student._id,
      };
      setSelectedProduct(tmpStudent);
    } else {
      setSelectedProduct(initNewProduct());
    }

    // }
  }, [coursesStore.coursesList]);

  const handleInputChange = (value: any, name: string) => {
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const getNewPackage = () => {
    const newPackage = {
      createdDate: new Date(),
      id: uuidv4(),
      status: 0,
      lecturesCount: 5,
      seats: [
        {
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        },
        {
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        },
        {
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        },
        {
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        },
        {
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        },
      ],
    }
    return newPackage;
  }

  const handlAddClick = () => {
    if (selectedProduct) {
      setIsLoading(true);
      //uploadImage(imgFile).then((res) => {
      let updatedData: TProduct = null;

      if (!isEditMode) {
        updatedData = {
          ...selectedProduct,
          packagesList: [getNewPackage()],
        };
      } else {
        updatedData = { ...selectedProduct };
      }

      setSelectedProduct(updatedData);
      studentsStore.addStudents(updatedData, isEditMode).then((res: any) => {
        setIsLoading(false);
        //navigateToMenu();
        // if (!isEditMode) {
        navigation.navigate("admin-dashboard");
        // }else{
        //   studentsStore.getStudents();
        // }
      });

      //});
    }
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };
  const goToPackagesList = () => {
    navigation.navigate("admin-add-package", { studentId: selectedProduct.id });
  };

  const addPackage = () => {
    setIsAddPacakge(true);
  };

  const onCloseAddPackage = () => {
    setIsAddPacakge(false);
  };
  const onClosePackagesList = () => {
    setIsShowPackagesList(false);
  };

  const openPacakgedList = () => {
    setIsShowPackagesList(true);
  };

  const getPackageStatus = (packageData) => {
    const emptySeats = packageData.seats.filter((seat) => seat.status === 0);
    if (emptySeats.length === 0) {
      return 2;
    } else {
      return 1;
    }
  };

  const onSavePacakge = (newPackage: any) => {
    let isAddNewPackge = false;
    setIsAddPacakge(false);
    const foundedPackage = selectedProduct.packagesList.find(
      (pacakge) => pacakge.id === newPackage.id
    );
    if (foundedPackage) {
      let updatedPackagesList = selectedProduct.packagesList.map(
        (pacakge) => {
          if (pacakge.id === newPackage.id) {
            const packageStatus = getPackageStatus(newPackage)
            if (packageStatus === 2) {
              isAddNewPackge = true;
            }
            return {...newPackage, status: packageStatus};
          } else {
            return pacakge;
          }
        }
      );
      if(isAddNewPackge){
        updatedPackagesList.push(getNewPackage())
      }
      setSelectedProduct({
        ...selectedProduct,
        packagesList: updatedPackagesList,
      });
      studentsStore.addStudents({
        ...selectedProduct,
        packagesList: updatedPackagesList,
      }, isEditMode)
    } else {
      selectedProduct.packagesList.push(newPackage);
      setSelectedProduct({ ...selectedProduct });
      studentsStore.addStudents({
        ...selectedProduct,
      }, isEditMode)
    }
    console.log("newPackage",newPackage)
  

  };

  useEffect(() => {
    // getMenu();
    if(selectedProduct){
      updateSelectedProduct(studentsStore.studentsList);
    }
  }, [studentsStore.studentsList]);


  const updateSelectedProduct = (tmpStudentsList) =>{
    console.log("selectedProduct",tmpStudentsList)
    //const tmpStudent = tmpStudentsList.find((student)=> student._id == selectedProduct?._id);
  //  console.log("tmpStudent",tmpStudent)
    //setSelectedProduct(tmpStudent);
  }

  if (!selectedProduct) {
    return;
  }

  if (isAddPacakge) {
    return (
      <AddPackageScreen onClose={onCloseAddPackage} onSave={onSavePacakge} />
    );
  }
  

  if (isShowPackagesList) {
    return (
      <PackagesListScreen
        student={selectedProduct}
        pacakgesList={selectedProduct.packagesList}
        onClose={onClosePackagesList}
        onSave={onSavePacakge}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30 }}>{t("add-student")}</Text>

        <View
          style={{
            width: "100%",
            marginTop: 30,
            alignItems: "flex-start",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "name")}
            label={t("الاسم")}
            value={selectedProduct?.name}
          />
          {!selectedProduct?.name && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-name")}
            </Text>
          )}
        </View>

        <View
          style={{
            marginTop: 15,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "phone")}
            label={t("هاتف الطالب")}
            value={selectedProduct?.phone}
            keyboardType="numeric"
          />
          {!selectedProduct?.phone && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-phone")}
            </Text>
          )}
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 15,
            alignItems: "flex-start",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "fatherNumber")}
            label={t("هاتف الاب")}
            value={selectedProduct?.fatherPhone}
          />
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 15,
            alignItems: "flex-start",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "motherNumber")}
            label={t("هاتف الام")}
            value={selectedProduct?.motherNumber}
          />
        </View>

        <View
          style={{
            marginTop: 30,
            alignItems: "flex-start",
            width: "100%",
            zIndex: 1,
          }}
        >
          <DropDown
            itemsList={studentStatuses}
            defaultValue={selectedProduct?.status}
            onChangeFn={(e) => handleInputChange(e, "status")}
          />
        </View>

        {(selectedProduct?.status === "paid" ||
          selectedProduct?.status === "registered") && (
          <View
            style={{
              width: "100%",
              marginTop: 30,
              alignItems: "flex-start",
              zIndex: 1,
            }}
          >
            {coursesList && (
              <View style={{ alignItems: "flex-start" }}>
                <DropDown
                  itemsList={coursesList}
                  defaultValue={selectedProduct?.categoryId}
                  onChangeFn={(e) => handleInputChange(e, "categoryId")}
                />
                {/* {!selectedProduct?.categoryId && (
                <Text style={{ color: themeStyle.ERROR_COLOR }}>
                  {t("invalid-categoryId")}
                </Text>
              )} */}
              </View>
            )}
          </View>
        )}

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("قائمة الباقات")}
            fontSize={20}
            onClickFn={openPacakgedList}
            bgColor={themeStyle.PACKAGE_COLOR}
          />
        </View>

        {/* 
        <View
          style={{
            width: "100%",
            marginTop: 40,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 20, marginRight: 10 }}>
            {t("is-inStore")}
          </Text>
          <CheckBox
            onChange={(e) => handleInputChange(e, "isInStore")}
            value={selectedProduct?.isInStore}
          />
        </View> */}

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("حفظ")}
            fontSize={20}
            onClickFn={handlAddClick}
            isLoading={isLoading}
            disabled={isLoading || !isValidForm()}
            bgColor={themeStyle.SUCCESS_COLOR}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(AddStudentScreen);

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
});
