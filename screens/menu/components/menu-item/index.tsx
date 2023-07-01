import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Text from "../../../../components/controls/Text";
import { observer } from "mobx-react";
import themeStyle from "../../../../styles/theme.style";

/* components */
import Icon from "../../../../components/icon";
import { getCurrentLang } from "../../../../translations/i18n";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { StoreContext } from "../../../../stores";
import { cdnUrl } from "../../../../consts/shared";

export type TProps = {
  item: any;
  onItemSelect: (item: any) => void;
  selectedItem: any;
};
const menuIcons = {
  "long-cake-active": require("../../../../assets/categories/long-cake-active.png"),
  "long-cake-inactive": require("../../../../assets/categories/long-cake-inactive.png"),
  "moouse-active": require("../../../../assets/categories/moouse-active.png"),
  "moouse-inactive": require("../../../../assets/categories/moouse-inactive.png"),
  "cookies-active": require("../../../../assets/categories/cookies-active.png"),
  "cookies-inactive": require("../../../../assets/categories/cookies-inactive.png"),
  "birthday-active": require("../../../../assets/categories/birthday-active.png"),
  "birthday-inactive": require("../../../../assets/categories/birthday-inactive.png"),
  "design-active": require("../../../../assets/categories/design-active.png"),
  "design-inactive": require("../../../../assets/categories/design-inactive.png"),
  "desserts-active": require("../../../../assets/categories/desserts-active.png"),
  "desserts-inactive": require("../../../../assets/categories/desserts-inactive.png"),
  "shmareem-active": require("../../../../assets/categories/shmareem-active.png"),
  "shmareem-inactive": require("../../../../assets/categories/shmareem-inactive.png"),
};
const MenuItem = ({ item, onItemSelect, selectedItem }: TProps) => {
  const { t } = useTranslation();
  const { languageStore } = useContext(StoreContext);
  return (
    <View style={styles.categoryItem}>
      <TouchableOpacity
        style={{
          shadowColor:
            selectedItem._id === item._id
              ? "rgba(0, 0, 0,0.8)"
              : "rgba(0, 0, 0,0)",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          borderWidth: 0,
          zIndex: 1,
          shadowOpacity: selectedItem._id === item._id ? 0.5 : 0,
          shadowRadius: 6.84,
          elevation: 9,
          borderRadius: 50,
          scaleX: selectedItem._id === item._id ? 1.2 : 1,
          scaleY: selectedItem._id === item._id ? 1.2 : 1,
          // marginTop: selectedItem._id === item._id ? 35 : 0,
          backgroundColor:
            selectedItem._id === item._id ? "#F1F1F1" : "transparent",
        }}
        onPress={() => {
          onItemSelect(item);
        }}
      >
        <View
          style={[
            styles.iconContainer,

            {
              // backgroundColor:
              // category?._id === selectedCategory?._id
              //     ? themeStyle.PRIMARY_COLOR
              //     : themeStyle.WHITE_COLOR,
            },
          ]}
        >
          <Image
            style={{
              width: selectedItem._id === item._id ? "70%" : "45%",
              height: selectedItem._id === item._id ? "70%" : "45%",
            }}
            source={
              menuIcons[
                item[
                  `icon-${
                    selectedItem._id === item._id ? "active" : "inactive"
                  }`
                ]
              ]
            }
          />
        </View>
      </TouchableOpacity>
      {selectedItem._id === item._id && (
        <View style={{ marginTop: 10, width: "140%", alignItems: "center" }}>
          <Text
            style={[
              {
                marginTop: 10,
                color: themeStyle.GRAY_700,
                fontFamily: `${getCurrentLang()}-Bold`,
              },
            ]}
          >
            {languageStore.selectedLang === "ar" ? item.nameAR : item.nameHE}
          </Text>
        </View>
      )}
    </View>
  );
};

export default observer(MenuItem);

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#F1F1F1",
  },
  categoryItem: {
    alignItems: "center",
    // justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    // width: 120
    paddingTop: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    height: 60,
    width: 60,
    // padding: 15,
  },
  itemsListConainer: {},
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
