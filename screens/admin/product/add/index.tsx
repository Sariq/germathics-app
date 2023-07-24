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

const AddCourseScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { coursesStore, languageStore } = useContext(StoreContext);

  const [isEditMode, setIdEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<TProduct>();

  const initNewProduct = () => {
    return {
      categoryId: "",
      name: "دورة 1",
    };
  };

  const isValidForm = () => {
    return (
      (selectedProduct?.name
       )
    );
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
    if (selectedProduct ) {
      setIsLoading(true);
      //uploadImage(imgFile).then((res) => {
      let updatedData: TProduct = null;
    
        updatedData = { ...selectedProduct };


      setSelectedProduct(updatedData);
      coursesStore.addCourses(updatedData, isEditMode)
        .then((res: any) => {
          setIsLoading(false);
          navigation.navigate("admin-dashboard");
        });
      // menuStore
      //   .addOrUpdateProduct(updatedData, isEditMode)
      //   .then((res: any) => {
      //     setIsLoading(false);
      //     navigation.navigate("admin-dashboard");

      //     //navigateToMenu();
      //   });

      //});
    }
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
      <BackButton />

      <View style={styles.inputsContainer}>
        <Text style={{  fontSize: 30 }}>{t("اضف دورة")}</Text>

        <View
          style={{
            width: "100%",
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexBasis: "49%",
              marginTop: 15,
              alignItems: "flex-start",
            }}
          >
            <InputText
              onChange={(e) => handleInputChange(e, "name")}
              label={t("name")}
              value={selectedProduct?.name}
            />
            {!selectedProduct?.name && (
              <Text style={{ color: themeStyle.ERROR_COLOR }}>
                {t("invalid-name")}
              </Text>
            )}
          </View>
  
        </View>
        <View
          style={{
            justifyContent: "space-around",
            width: "100%",
            marginTop: 30,
          }}
        >

          </View>

        {/* <View
          style={{
            width: "100%",
            marginTop: 20,
            alignItems: "flex-start",
            zIndex: 11,
          }}
        >
          {categoryList && (
            <View style={{ alignItems: "flex-start" }}>
              <DropDown
                itemsList={categoryList}
                defaultValue={selectedCategoryId}
                onChangeFn={(e) => handleInputChange(e, "categoryId")}
              />
              {!selectedProduct?.categoryId && (
                <Text style={{ color: themeStyle.ERROR_COLOR }}>
                  {t("invalid-categoryId")}
                </Text>
              )}
            </View>
          )}
        </View> */}


        
   
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
            bgColor={themeStyle.SUCCESS_COLOR}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default observer(AddCourseScreen);

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
