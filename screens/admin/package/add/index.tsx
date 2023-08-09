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
  originalLecturesCount: string;
};

const AddPackageScreen = ({
  onClose,
  onSave,
  studentPackage = null,
  student = null,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { menuStore, studentsStore, coursesStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();
  const [coursesList, setCoursesList] = useState<TProduct>();
  const [showSignature, setShowSignature] = useState(false);
  const [selectedSignatrueData, setSelectedSignatrueData] = useState();
  const [activePaymentRow, setActivePaymentRow] = useState();

  const initNewProduct = () => {
    return {
      createdDate: new Date(),
      id: uuidv4(),
      status: 0,
      totalPaid: 0
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
    if (name == "lecturesCount") {
      const seats = selectedProduct.seats || [];
      const startIndex = seats.length;
      for (var i = startIndex; i < value; i++) {
        seats.push({
          status: 0,
          lectureDate: null,
          id: uuidv4(),
        });
      }
      setSelectedProduct({ ...selectedProduct, [name]: value, seats: seats, originalLecturesCount: value });
    } else {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    }
  };

  const handlAddClick = () => {
    let tmpTotalPaid = 0;
     selectedProduct?.paymentsList?.forEach((paymentRow)=>{
      tmpTotalPaid = Number(tmpTotalPaid) + Number(paymentRow.amount)
    })
    onSave({...selectedProduct, totalPaid: tmpTotalPaid});
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
  const handleActivePaymentRow = (row) => {
    setActivePaymentRow(row);
  };

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
            marginTop: 30,
            alignItems: "flex-start",
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "lecturesCount")}
            label={t("عدد اللقائات")}
            value={selectedProduct?.lecturesCount?.toString()}
          />
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
          }}
        >
          <InputText
            onChange={(e) => handleInputChange(e, "price")}
            label={t("سعر الباقة")}
            value={selectedProduct?.price?.toString()}
            keyboardType="numeric"
          />
          {/* {!selectedProduct?.price && (
            <Text style={{ color: themeStyle.ERROR_COLOR }}>
              {t("invalid-phone")}
            </Text>
          )} */}
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("اضف دفعه")}
            fontSize={20}
            onClickFn={handlAddPayment}
          />
        </View>
        <View style={{ marginTop: 20, zIndex: 4 }}>
          {selectedProduct?.paymentsList?.map((paymentRow, index) => {
            return (
              <View
                style={{
                  zIndex: activePaymentRow?.id === paymentRow.id ? 2 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    zIndex: activePaymentRow?.id === paymentRow.id ? 2 : 0,
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
                      label={t("المبلغ")}
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
                      marginHorizontal: 11,
                    }}
                  >
                    <View style={{}}>
                      <DropDown
                        itemsList={PaymentMethods}
                        defaultValue={paymentRow?.paymentMethod || ""}
                        onChangeFn={(e) =>
                          handlePaymentInputChange(e, "paymentMethod", index)
                        }
                        onHandleOpen={() => handleActivePaymentRow(paymentRow)}
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
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  {paymentRow?.signature && (
                    <Image
                      style={styles.signutareImage}
                      source={{ uri: paymentRow?.signature }}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{}}
                      onPress={() => onSignatureOpen(index, "signature")}
                    >
                      <Text style={{ fontSize: 18 }}>חתימה</Text>
                    </TouchableOpacity>
                    <Text style={{ top: -2 }}> | </Text>
                    <TouchableOpacity
                      style={{}}
                      onPress={() => onRecipetPrint(index, "signature")}
                    >
                      <Text style={{ fontSize: 18 }}>הדפס</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
          {/* <View style={styles.container}>
      <Image
         style={styles.signutareImage}
        source={{uri: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`}}
      />
    </View> */}
          {/* <View style={{ width: "50%", marginTop: 25, alignSelf: "center" }}>
            <Button text={t("اضف")} fontSize={20} onClickFn={savePayment} />
          </View> */}
        </View>

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
  signutareImage: {
    height: 60,
    width: 60,
    alignSelf: "center",
    backgroundColor: themeStyle.WHITE_COLOR,
  },
});
