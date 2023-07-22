import { StyleSheet, View } from "react-native";
import InputText from "../../../../components/controls/input";
import Button from "../../../../components/controls/button/button";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { StoreContext } from "../../../../stores";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../../../components/back-button";
import themeStyle from "../../../../styles/theme.style";

const AddEmployeScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { student } = route.params;
  const { employesStore} = useContext(StoreContext);
  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

  const initNewProduct = () => {
    return {
      name: "",
      status: 0,
      phone: "",
      attendanceList: []
    };
  };


  useEffect(() => {

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
  }, []);

  const handleInputChange = (value: any, name: string) => {
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handlAddClick = () => {
    if (selectedProduct) {
      setIsLoading(true);
      employesStore.addEmployes(selectedProduct, isEditMode).then((res: any) => {
        setIsLoading(false);
        navigation.navigate("admin-dashboard");
      });
    }
  };

  if (!selectedProduct) {
    return;
  }


  return (
    <ScrollView style={styles.container}>
      <BackButton />

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30,marginTop:20 }}>{t("اضف مرشد")}</Text>

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
            label={t("رقم الهاتف")}
            value={selectedProduct?.phone}
            keyboardType="numeric"
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
            onChange={(e) => handleInputChange(e, "idNumber")}
            label={t("رقم الهوية")}
            value={selectedProduct?.idNumber}
          />
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("حفظ")}
            fontSize={20}
            onClickFn={handlAddClick}
            isLoading={isLoading}
            disabled={isLoading}
            bgColor={themeStyle.SUCCESS_COLOR}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(AddEmployeScreen);

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
