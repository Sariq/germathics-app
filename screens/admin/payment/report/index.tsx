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
export type TProduct = {
  id?: string;
  name: string;
};

const PaymentReportScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { menuStore, studentsStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState();

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "دورة 1",
    };
  };

  const isValidForm = () => {
    return selectedProduct?.name;
  };

  useEffect(() => {
    // console.log("product?.extras.size.options", product?.extras.size.options);
    // if (product) {
    //   setIdEditMode(true);
    //   setSelectedCategoryId(product.categoryId);
    //   setSelectedSubCategoryId(product.subCategoryId);
    //   let tmpProduct = {
    //     ...product,
    //     mediumPrice: product?.extras.size.options["medium"].price,
    //     mediumCount: product?.extras.size.options["medium"].count,
    //     largePrice: product?.extras.size.options["large"].price,
    //     largeCount: product?.extras.size.options["large"].count,
    //   };
    //   setSelectedProduct(tmpProduct);
    // } else {
    setSelectedProduct(initNewProduct());
    // }
  }, []);

  const handleInputChange = (value: any, name: string) => {
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handlAddClick = () => {
    if (selectedProduct) {
      setIsLoading(true);
      //uploadImage(imgFile).then((res) => {


      studentsStore.sendPaymentReport(selectedProduct).then((res: any) => {
        setIsLoading(false);
        // navigation.navigate("admin-dashboard");
      });
    }
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  useEffect(() => {
    // getMenu();
    setSelectedProduct({
        year:  new Date().getFullYear(),
        month:  new Date().getMonth() + 1
    })
  }, []);


  const startYear = 2023;
  const currentYear = new Date().getFullYear() + 1;
  const numberOfYears = currentYear - startYear; // Change this value to determine the number of years to include
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

   
  if (!selectedProduct) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30 }}>{t("דוח תשלומים")}</Text>
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
        <View style={{ flexBasis: "40%" }}>
          <DropDown
            itemsList={yearsArray}
            defaultValue={selectedProduct?.year}
            onChangeFn={(e) => handleInputChange(e, "year")}
          />
        </View>
        <View style={{ flexBasis: "40%" }}>
          <DropDown
            itemsList={monthsArray}
            defaultValue={selectedProduct?.month}
            onChangeFn={(e) => handleInputChange(e, "month")}
          />
        </View>
      </View>
        <View
          style={{
            justifyContent: "space-around",
            width: "100%",
            marginTop: 30,
          }}
        ></View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("approve")}
            fontSize={20}
            onClickFn={handlAddClick}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(PaymentReportScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginBottom: 30,
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
});
