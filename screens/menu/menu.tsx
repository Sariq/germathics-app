import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Text from "../../components/controls/Text";

import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../stores";
import themeStyle from "../../styles/theme.style";
import { LinearGradient } from "expo-linear-gradient";

/* components */
import CategoryItemsList from "./components/categoryItemsList";
import Icon from "../../components/icon";
import { Buffer } from "buffer";
import i18n from "../../translations/index-x";
import { getCurrentLang } from "../../translations/i18n";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import MenuItem from "./components/menu-item/index";
import AddMenuItem from "./components/menu-item/add";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../consts/api";
export function toBase64(input) {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function fromBase64(encoded) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

const MenuScreen = () => {
  const { t } = useTranslation();
  const { menuStore, languageStore, userDetailsStore } = useContext(
    StoreContext
  );

  useEffect(() => {}, [languageStore]);

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      menuStore.getMenu().then(() => {
        getMenu();
      });
    }
  }, [lastJsonMessage]);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("BURGERS");

  const onCategorySelect = (category) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedCategory(category);
  };
  const onAddCategory = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getMenu = () => {
    const categories = menuStore.categories;
    setCategoryList(categories);
    setSelectedCategory(selectedCategory || categories[0]);
  };

  useEffect(() => {
    getMenu();
  }, []);
  useEffect(() => {
    getMenu();
  }, [menuStore.categories]);

  if (!categoryList || !selectedCategory) {
    return null;
  }
  return (
    <View style={{ height: "100%", marginTop: 0 }}>
      <View style={styles.container}>
        <ScrollView
          style={{ height: "100%", width: "100%" }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {/* {userDetailsStore.isAdmin() && <View style={{ width: 120, height: 96, flexBasis: 90 }}>
            <AddMenuItem onItemSelect={onAddCategory} />
          </View>} */}
          {categoryList.map((category) => (
            <View style={{ width: selectedCategory._id === category._id ? 160 : 70, flexBasis: 90 }}>
              <MenuItem
                item={category}
                onItemSelect={onCategorySelect}
                selectedItem={selectedCategory}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <LinearGradient
        colors={[
          "rgba(239, 238, 238, 0.04)",
          "rgba(239, 238, 238, 0.9)",
          "rgba(239, 238, 238, 0.9)",
          "rgba(239, 238, 238, 0.9)",
          "rgba(239, 238, 238, 0.9)",
          "rgba(239, 238, 238, 0.01)",
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.background]}
      />
      <View>
        {categoryList.map((category, index) => (
          <View
            style={{
              display:
                category.categoryId === selectedCategory.categoryId
                  ? "flex"
                  : "none",
            }}
          >
            <CategoryItemsList
              productsList={category.products}
              category={category}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default observer(MenuScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,

    height: 100,
    paddingHorizontal:5
    // backgroundColor: "#F1F1F1",
  },
  categoryItem: {},
  iconContainer: {},
  itemsListConainer: {
    top: 120,
    position: "absolute",
    alignSelf: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    zIndex: -1,
  },
});
