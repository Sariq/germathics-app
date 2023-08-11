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
import { cdnUrl, PaymentMethods } from "../../../../consts/shared";
import CheckBox from "../../../../components/controls/checkbox";
import BackButton from "../../../../components/back-button";
import { uuidv4 } from "../../../../utils/shared";
import SignuaterScreen from "../../../../components/signature";
/// package 0 = default, 1 = active, 2 = done

export type TProduct = {
  id?: string;
  lecturesCount: string;
  price: string;
  paymentsList: any[];
  createdDate: any;
  seats: any[];
};

const AddAttendanceScreen = ({
  onClose,
  onSave,
  attendanceData = null,
  student = null,
  
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState();
  const [coursesList, setCoursesList] = useState<TProduct>();
  const [showSignature, setShowSignature] = useState(false);
  const [selectedSignatrueData, setSelectedSignatrueData] = useState();

  const initNewProduct = () => {
    return {
      createdDate: new Date(),
      id: uuidv4(),
      status: 0,
      lectureHoursCount: "",
      lectureHoursPrice: 40,
      generalHoursCount: "",
      generalHoursPrice: 30,
      attendanceDate: new Date()
    };
  };

  const isValidForm = () => {
    return true;
    //   selectedProduct?.name &&
    //   selectedProduct?.status &&
    //   selectedProduct?.totalPaidPrice
  };

  useEffect(() => {
    if (!coursesStore.coursesList) {
      return;
    }

    if (attendanceData) {
      setIdEditMode(true);

      setSelectedProduct(attendanceData);
    } else {
      setSelectedProduct(initNewProduct());
    }

    // }
  }, [coursesStore.coursesList]);

  const handleInputChange = (value: any, name: string) => {
    if (name == "day" || name == "month" || name == "year") {
      let date = selectedProduct.attendanceDate;
       
      switch(name){
        case "day":
          date = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), value);
          break;
          case "month":
            date = new Date(new Date(date).getFullYear(), value - 1, new Date(date).getDate());
            break;
            case "year":
              date = new Date(value, new Date(date).getMonth(), new Date(date).getDate());
         break;
      }
      setSelectedProduct({ ...selectedProduct, attendanceDate: date });
    } else {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    }
  };

  const handlAddClick = () => {
    onSave(selectedProduct);
    // if (selectedProduct) {
    //   setIsLoading(true);
    //     studentsStore.addPackage(studentId, selectedProduct).then((res: any) => {
    //       setIsLoading(false);
    //       //navigateToMenu();
    //       navigation.navigate("admin-dashboard");

    //     });
    // }
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  const handlePaymentInputChange = (
    value: any,
    name: string,
    index: number
  ) => {
    const updatedPackages = selectedProduct.paymentsList.map(
      (paymetRow, currentIndex) => {
        if (currentIndex == index) {
          const tmpPaymentRow = {
            ...paymetRow,
            [name]: value,
          };
          return tmpPaymentRow;
        }
        return paymetRow;
      }
    );
    setSelectedProduct({ ...selectedProduct, paymentsList: updatedPackages });
  };

  const handlAddPayment = () => {
    if (selectedProduct.paymentsList) {
      setSelectedProduct({
        ...selectedProduct,
        paymentsList: [
          ...selectedProduct.paymentsList,
          { createdDate: new Date(), id: uuidv4() },
        ],
      });
    } else {
      setSelectedProduct({
        ...selectedProduct,
        paymentsList: [{ createdDate: new Date(), id: uuidv4() }],
      });
    }
  };

  const savePayment = () => {
  };

  useEffect(() => {
    // getMenu();
  }, []);

  const onSignatureClose = () => {
    setShowSignature(false);
  };
  const onSignatureOpen = (index, key) => {
    setSelectedSignatrueData({
      index,
      data: selectedProduct?.paymentsList[index],
    });
    setShowSignature(true);
  };
  const onRecipetPrint = (index) => {
    setSelectedSignatrueData({
      index,
      data: selectedProduct?.paymentsList[index],
    });
    studentsStore.printRecipet({
      ...selectedProduct?.paymentsList[index],
      ...student,
    });
  };
  const onSaveSignature = (val) => {
    handlePaymentInputChange(val, "signature", selectedSignatrueData.index);
    setShowSignature(false);
  };

  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const numberOfYears = 3 + currentYear - startYear; // Change this value to determine the number of years to include
  const yearsArray = Array.from({ length: numberOfYears }, (_, index) => {
    const year = startYear + index;
    return { label: year, value: year };
  });

  const monthsArray = [];
  const numberOfMonths = 12;
  for (let i = 0; i < numberOfMonths; i++) {
    const monthIndex = i;
    monthsArray.push({ label: monthIndex + 1, value: monthIndex + 1 });
  }

  const daysArray = [];
  const numberOfDays = 31;
  for (let i = 0; i < numberOfDays; i++) {
    const dayIndex = i;
    daysArray.push({ label: dayIndex + 1, value: dayIndex + 1 });
  }

  if (showSignature) {
    return (
      <SignuaterScreen
        onClose={onSignatureClose}
        onSave={onSaveSignature}
        signatureData={selectedSignatrueData}
      />
    );
  }

  if (!selectedProduct) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton isClose={true} onClick={onClose} />

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30, marginTop: 20 }}>{t("اضف باقه")}</Text>

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
          <View style={{ flexBasis: "30%" }}>
            <DropDown
              itemsList={yearsArray}
              defaultValue={new Date(selectedProduct?.attendanceDate).getFullYear()}
              onChangeFn={(e) => handleInputChange(e, "year")}
            />
          </View>
          <View style={{ flexBasis: "30%" }}>
            <DropDown
              itemsList={monthsArray}
              defaultValue={new Date(selectedProduct?.attendanceDate).getMonth()+1}
              onChangeFn={(e) => handleInputChange(e, "month")}
            />
          </View>
          <View style={{ flexBasis: "30%" }}>
            <DropDown
              itemsList={daysArray}
              defaultValue={new Date(selectedProduct?.attendanceDate).getDate()}
              onChangeFn={(e) => handleInputChange(e, "day")}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: 20,
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexBasis: "48%" }}>
            <InputText
              onChange={(e) => handleInputChange(e, "lectureHoursCount")}
              label={t("ساعات الارشاد")}
              value={selectedProduct?.lectureHoursCount?.toString()}
            />
          </View>
          <View style={{ flexBasis: "48%" }}>
            <InputText
              onChange={(e) => handleInputChange(e, "lectureHoursPrice")}
              label={t("المبلغ")}
              value={selectedProduct?.lectureHoursPrice?.toString()}
            />
          </View>

          {/* {!selectedProduct?.lecturesCount && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-name")}
            </Text>
          )} */}
        </View>

        <View
          style={{
            marginTop: 15,
            alignItems: "flex-start",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View style={{ flexBasis: "48%" }}>
            <InputText
              onChange={(e) => handleInputChange(e, "generalHoursCount")}
              label={t("ساعات عامة")}
              value={selectedProduct?.generalHoursCount?.toString()}
            />
          </View>
          <View style={{ flexBasis: "48%" }}>
            <InputText
              onChange={(e) => handleInputChange(e, "generalHoursPrice")}
              label={t("المبلغ")}
              value={selectedProduct?.generalHoursPrice?.toString()}
            />
          </View>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("حفظ")}
            fontSize={20}
            onClickFn={handlAddClick}
            isLoading={isLoading}
            disabled={isLoading || !isValidForm()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(AddAttendanceScreen);

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
  signutareImage: {
    height: 80,
    width: 80,
    alignSelf: "center",
  },
});
