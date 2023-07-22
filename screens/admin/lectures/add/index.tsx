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
import { uuidv4 } from "../../../../utils/shared";


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
      id: uuidv4(),
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

  const handleDateChange =  (value: any, name: string) => {
      let date = selectedProduct.createdDate;
       
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

      setSelectedProduct({ ...selectedProduct, createdDate: date });

  }



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
          marginVertical: 20,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
          zIndex: 2,
        }}
      >
   
        <View style={{ flexBasis: "40%" }}>
          <DropDown
            itemsList={monthsArray}
            defaultValue={new Date(selectedProduct?.createdDate).getMonth() +1}
            onChangeFn={(e) => handleDateChange(e, "month")}
          />
        </View>
        <View style={{ flexBasis: "30%" }}>
            <DropDown
              itemsList={daysArray}
              defaultValue={new Date(selectedProduct?.createdDate).getDate()}
              onChangeFn={(e) => handleDateChange(e, "day")}
            />
          </View>
      </View>
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
