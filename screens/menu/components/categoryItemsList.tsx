import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../../stores";
import i18n from "../../../translations/index-x";
import { ScrollView } from "react-native-gesture-handler";
import Text from "../../../components/controls/Text";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";
import * as Haptics from "expo-haptics";
import Button from "../../../components/controls/button/button";
import { cdnUrl } from "../../../consts/shared";
import ProductItem from "./product-item/index";
import ProductCarousleItem from "./product-item/carousle";
import AddProductItem from "./product-item/add";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import BirthdayCakes from "./product-item/birthday-cakes";
import ConfirmActiondDialog from "../../../components/dialogs/confirm-action";

const CategoryItemsList = ({ productsList, category }) => {
  const navigation = useNavigation();
  const scrollRef = useRef();

  const { userDetailsStore, menuStore, languageStore } = useContext(
    StoreContext
  );
  const [selectedItem, setSelectedItem] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState("1");
  const [isOpenConfirmActiondDialog, setIsOpenConfirmActiondDialog] = useState(false);
  const onItemSelect = (item) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedItem(item);
    navigation.navigate("meal", { product: item, category });
  };
  const onAddProduct = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("admin-add-product", { categoryId: category._id });
  };

  const handleConfirmActionAnswer = (answer: string) => {
    if(answer){
      menuStore.deleteProduct([selectedItem._id]).then((res: any) => {
        menuStore.getMenu();
        navigation.navigate("menu");
      });
    }
    setIsOpenConfirmActiondDialog(false);
  };

  const onDeleteProduct = (item: any) => {
    //setIsLoading(true);
    setSelectedItem(item);
    setIsOpenConfirmActiondDialog(true);

  };
  const onEditProduct = (item: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("admin-add-product", { product: item });
  };

  const handleSubCategoryChange = (vlaue: string) => {
    setSelectedSubCategory(vlaue);
  };


  const filterBirthday = () => {
    const items =  productsList.filter(
      (item) => item.subCategoryId === selectedSubCategory
    );
    return items;
  };
  
  return (
    <View style={{ height: "100%" }}>
      {category.categoryId !== 5 && (
        <View style={{ marginTop: 15, height: "100%" }}>
          <Carousel
            loop
            width={Dimensions.get("window").width}
            height={"100%"}
            autoPlay={false}
            data={productsList}
            scrollAnimationDuration={1500}
            autoPlayInterval={3000}
            mode="parallax"
            style={{}}
            renderItem={({ index }) => (
              <ProductCarousleItem
                item={productsList[index]}
                onItemSelect={onItemSelect}
                onDeleteProduct={onDeleteProduct}
                onEditProduct={onEditProduct}
              />
            )}
          />
        </View>
      )}
      {category.categoryId === 5 && (
        <View style={{ height: "85%" }}>
          <BirthdayCakes onChange={handleSubCategoryChange} />
          <ScrollView style={{ height: "100%" }}>
            <View style={styles.container}>
              {userDetailsStore.isAdmin() && (
                <View
                  style={{
                    marginTop:
                      productsList?.length > 1 ? (1 % 2 === 0 ? -50 : 50) : 0,
                    flexBasis: "48.5%",
                  }}
                >
                  <AddProductItem onItemSelect={onAddProduct} />
                </View>
              )}
              {filterBirthday().map((item, index) => {
                return (
                  <View
                    style={{
                      marginTop:
                        productsList?.length > 1
                          ? index % 2 === 0
                            ? -15
                            : 15
                          : 0,
                      flexBasis: "48.5%",
                    }}
                  >
                    <ProductItem
                      item={item}
                      onItemSelect={onItemSelect}
                      onDeleteProduct={onDeleteProduct}
                      onEditProduct={onEditProduct}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
         <ConfirmActiondDialog
        handleAnswer={handleConfirmActionAnswer}
        isOpen={isOpenConfirmActiondDialog}
        text={'sure-continue'}
        positiveText="agree"
        negativeText="cancel"
      />
    </View>
  );
};
export default observer(CategoryItemsList);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginTop: 40,
    maxWidth: 600,
    justifyContent: "space-between",
    paddingHorizontal: 8,
    alignSelf:"center"
  },
  categoryItem: {
    marginBottom: 15,
    height: 360,
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#F8F6F4",
    paddingVertical: 60,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  square: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 4,
    height: 150,
    shadowColor: "black",
    width: 150,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

// <TouchableOpacity onPress={()=>onItemSelect(productsList[index])} style={{ height: "70%", width: "100%", borderRadius:30, overflow:"hidden", }}>
//  <View style={{position:"absolute",zIndex:1, top: "50%", marginLeft:5, borderRadius:30, width:60, height:60, justifyContent:"center",alignItems:"center"}}>
//   <LinearGradient
//         colors={[
//           "rgba(207, 207, 207, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(207, 207, 207, 0.8)",
//         ]}
//         start={{ x: 1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.background,{borderRadius:30}]}
//       />
//   <Text style={{ textAlign: "center", fontSize: 40 }}>></Text>
//   </View>
//   <View style={{position:"absolute",zIndex:1, top: "50%", right: 10, borderRadius:30, width:60, height:60, justifyContent:"center",alignItems:"center"}}>
//   <LinearGradient
//         colors={[
//           "rgba(207, 207, 207, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(232, 232, 230, 0.8)",
//           "rgba(207, 207, 207, 0.8)",
//         ]}
//         start={{ x: 1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.background,{borderRadius:30}]}
//       />
//   <Text style={{ textAlign: "center", fontSize: 40 }}>{`<`}</Text>
//   </View>

//    <ImageBackground
//     source={{ uri: `${cdnUrl}${productsList[index].img[0].uri}` }}
//     style={{ height: "100%", width: "100%", borderRadius:30  }}
//   >
//     <View style={{ position: "relative", borderRadius:30, marginTop:10  }}>
//       <LinearGradient
//         colors={[
//           "rgba(207, 207, 207, 0.4)",
//           "rgba(232, 232, 230, 0.4)",
//           "rgba(232, 232, 230, 0.4)",
//           "rgba(232, 232, 230, 0.4)",
//           "rgba(207, 207, 207, 0.4)",
//         ]}
//         start={{ x: 1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.background]}
//       />
//       <Text style={{ textAlign: "center", fontSize: 25 }}>
//         {languageStore.selectedLang === "ar"
//           ? productsList[index].nameAR
//           : productsList[index].nameHE}
//       </Text>
//       <Text style={{ textAlign: "center", fontSize: 25 }}>
//       ₪{
//           getPriceBySize(productsList[index]) || productsList[index].price
//           }
//       </Text>
//     </View>
//   </ImageBackground>
// </TouchableOpacity>
