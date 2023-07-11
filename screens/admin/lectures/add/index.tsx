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
import moment from "moment";
export type TProduct = {
  id?: string;
  freeText: string;
  createdDate: any;
};

const AddLectureScreen = ({ onClose, onSave }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { menuStore, languageStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();

  const initNewProduct = () => {
    return {
      freeText: "دورة ",
      createdDate: new Date(),
    };
  };

  // const isValidForm = () => {
  //   return (
  //     (selectedProduct?.name
  //      )
  //   );
  // };

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
    onSave(selectedProduct)
    // if (selectedProduct) {
    //   setIsLoading(true);
    //   //uploadImage(imgFile).then((res) => {
    //   let updatedData: TProduct = null;

    //   updatedData = { ...selectedProduct };

    //   setSelectedProduct(updatedData);
    //   menuStore.addOrUpdateProduct(updatedData, isEditMode).then((res: any) => {
    //     menuStore.getMenu();
    //     setIsLoading(false);
    //     navigation.navigate("admin-dashboard");

    //     //navigateToMenu();
    //   });

    //   //});
    // }
  };

  const navigateToMenu = () => {
    navigation.navigate("menuScreen");
  };

  useEffect(() => {
    // getMenu();
  }, []);

  if (!selectedProduct) {
    return;
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton isClose onClick={onClose} />

      <View style={styles.inputsContainer}>
        <Text style={{ fontSize: 30 }}>{t("اضف لقاء")}</Text>
        <View
          style={{
            width: "100%",
            marginTop: 40,
            alignItems: "center",
            flexDirection: "row",
            justifyContent:"center"
          }}
        >
          <Text style={{ fontSize: 20, marginRight: 10 }}>
            {moment(selectedProduct.createdDate).format("DD-MM-YY | HH:mm")}{" "}
          </Text>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 50, marginTop: 25 }}>
          <Button
            text={t("اضف")}
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

export default observer(AddLectureScreen);

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
