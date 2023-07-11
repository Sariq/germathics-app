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
import { v4 as uuidv4 } from 'uuid';


export type TProduct = {
  id?: string;
  lecturesCount: string;
  price: string;
  paymentsList: any[];
  createdDate: any;
  seats: any[];
};

const AddPackageScreen = ({ onClose, onSave, studentPackage = null }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [coursesList, setCoursesList] = useState<TProduct>();

  const initNewProduct = () => {
    return {
      createdDate: new Date(),
      id: uuidv4(),
    };
  };

  const isValidForm = () => {
    return (
        true
    //   selectedProduct?.name &&
    //   selectedProduct?.status &&
    //   selectedProduct?.totalPaidPrice
    );
  };


  useEffect(() => {
    if (!coursesStore.coursesList) {
      return;
    }

    if (studentPackage) {
      setIdEditMode(true);
      const tmpPackage = {
        ...studentPackage,
      };
      setSelectedProduct(tmpPackage);
    } else {
      setSelectedProduct(initNewProduct());
    }

    // }
  }, [coursesStore.coursesList]);

  const handleInputChange = (value: any, name: string) => {
      console.log(value,name)
      if(name == 'lecturesCount'){
        const seats = selectedProduct.seats || [];
        const startIndex = seats.length;
        for(var i = 0; i < value; i++){
          seats.push({
            status: 0,
            lectureDate: null,
            id: uuidv4()
          })
        }
        setSelectedProduct({ ...selectedProduct, [name]: value, seats: seats });
      }else{
        setSelectedProduct({ ...selectedProduct, [name]: value });
      }
  };

  const handlAddClick = () => {
      onSave(selectedProduct)
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
          [{ createdDate: new Date(), id: uuidv4() }],
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
      console.log("xx",selectedProduct)
  }

  useEffect(() => {
    // getMenu();
  }, []);

  if (!selectedProduct) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton isClose={true} onClick={onClose}/>

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30 }}>{t("اضف باقه")}</Text>

        <View
          style={{
            width: "100%",
            marginTop: 30,
            alignItems: "flex-start",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "lecturesCount")}
            label={t("عدد اللقائات")}
            value={selectedProduct?.lecturesCount}
          />
          {!selectedProduct?.lecturesCount && (
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
            onChange={(e) => handleInputChange(e, "price")}
            label={t("سعر الباقة")}
            value={selectedProduct?.price}
            keyboardType="numeric"
          />
          {!selectedProduct?.price && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-phone")}
            </Text>
          )}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("اضف دفعه")}
            fontSize={20}
            onClickFn={handlAddPayment}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          {selectedProduct?.paymentsList?.map((paymentRow, index) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  zIndex: 2,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexBasis: "32%",
                    marginHorizontal: 5,
                  }}
                >
                  <InputText
                    onChange={(e) =>
                      handlePaymentInputChange(e, "amount", index)
                    }
                    label={t("الكميه")}
                    value={paymentRow?.amount}
                  />
                  {/* {!selectedProduct?.fatherPhone && (
                    <Text style={{ color: themeStyle.ERROR_COLOR }}>
                      {t("invalid-fatherNumber")}
                      {selectedProduct?.paymentsList?.length}
                    </Text>
                  )} */}
                </View>

                <View
                  style={{
                    flexBasis: "32%",
                    marginHorizontal: 5,
                  }}
                >
                  <View style={{}}>
                    <DropDown
                      itemsList={PaymentMethods}
                      defaultValue={paymentRow?.paymentMethod}
                      onChangeFn={(e) =>
                        handlePaymentInputChange(e, "paymentMethod", index)
                      }
                    />
                    {/* {!selectedProduct?.categoryId && (
                <Text style={{ color: themeStyle.ERROR_COLOR }}>
                  {t("invalid-categoryId")}
                </Text>
              )} */}
                  </View>
                </View>
                <View
                  style={{
                    flexBasis: "32%",
                    marginHorizontal: 5,
                  }}
                >
                  <InputText
                    onChange={(e) =>
                      handlePaymentInputChange(e, "confirmationNumber", index)
                    }
                    label={t("رقم التأكيد")}
                    value={paymentRow?.confirmationNumber}
                  />
                  {/* {!paymentRow?.confirmationNumber && (
                    <Text style={{ color: themeStyle.ERROR_COLOR }}>
                      {t("invalid-motherNumber")}
                    </Text>
                  )} */}
                </View>
              </View>
            );
          })}
          {/* <View style={{ width: "50%", marginTop: 25, alignSelf: "center" }}>
            <Button text={t("اضف")} fontSize={20} onClickFn={savePayment} />
          </View> */}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("approve")}
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

export default observer(AddPackageScreen);

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
