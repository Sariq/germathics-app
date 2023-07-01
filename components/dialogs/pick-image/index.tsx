import { View, Image, ScrollView, ImageBackground } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
import Text from "../../controls/Text";

/* styles */
import theme from "../../../styles/theme.style";
import { useState, useEffect, useContext } from "react";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { useTranslation } from "react-i18next";
import Icon from "../../icon";
import { LinearGradient } from "expo-linear-gradient";
import { StoreContext } from "../../../stores";
import { cdnUrl } from "../../../consts/shared";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getCurrentLang } from "../../../translations/i18n";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
  text?: string;
  icon?: any;
};

export default function PickImagedDialog({
  isOpen,
  handleAnswer,
  text,
  icon,
}: TProps) {
  const { t } = useTranslation();
  const { menuStore } = useContext(StoreContext);

  const [visible, setVisible] = useState(isOpen);
  const [imagesList, setImagesList] = useState();

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    menuStore.getImagesByCategory("birthday").then((res) => {
      setImagesList(res);
    });
  }, []);

  const hideDialog = (value: boolean) => {
    handleAnswer && handleAnswer(value);
    setVisible(false);
  };

  const renderImagesListByType = (type) => {
    const images = imagesList.filter((image) => image.subType === type);
    return (
      <View style={{ alignItems: "flex-start" }}>
        <View>
          <Text style={{ fontSize: 18 }}>
            {type === "1" ? t("for-boys") : t("for-girls")}
          </Text>
        </View>
        <View style={{ marginTop: 5, flexDirection: "row" }}>
          <ScrollView
            style={{ height: "100%", width: "100%" }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((image) => (
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  marginRight: 10,
                }}
                source={{ uri: `${cdnUrl}${image.data.uri}` }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  if (!imagesList) {
    return;
  }
  return (
    <Provider>
      <Portal>
        <Dialog
          theme={{
            colors: {
              backdrop: "transparent",
            },
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "white",
            margin: 0,
            overflow: "hidden",
          }}
          visible={visible}
          dismissable={false}
        >
          <LinearGradient
            colors={[
              "rgba(199, 199, 199, 0.9)",
              "rgba(254, 254, 254, 0.9)",
              "rgba(254, 254, 254, 0.9)",
              "rgba(254, 254, 254, 0.9)",
              "rgba(199, 199, 199, 0.9)",
            ]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 20,
            }}
          />

          <Dialog.Content style={{}}>
            <View
              style={{
                flexDirection: "row",
                zIndex: 1,
                paddingBottom: 5,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexBasis: "100%",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    paddingTop: 5,
                    justifyContent: "center",
                    right: -25,
                  }}
                >
                  <Icon
                    icon="add_image"
                    size={30}
                    style={{ color: theme.GRAY_700 }}
                  />
                  <Text style={{ fontSize: 20 }}>{t("add-image")}</Text>
                </View>
                <View
                  style={{ alignItems: "center", marginTop: 5, right: -25 }}
                >
                  <Text style={{ fontSize: 18 }}>{t("add-image-desc")}</Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    hideDialog(false);
                  }}
                  style={{
                    backgroundColor: themeStyle.WHITE_COLOR,
                    height: 45,
                    borderRadius: 20,
                    width: 50,
                    right: -35,
                    top: -30,
                    zIndex: 5,
                  }}
                >
                  <Text
                    style={{
                      color: themeStyle.TEXT_PRIMARY_COLOR,
                      right: 25,
                      top: 17,
                      fontSize: 20,
                      fontWeight: "900",
                      fontFamily: `${getCurrentLang()}-GS-Black-Bold`,
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ padding: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {t("suggestions-images")}
                </Text>
                <View style={{ marginTop: 15 }}>
                  {renderImagesListByType("1")}
                </View>
                <View style={{ marginTop: 15 }}>
                  {renderImagesListByType("2")}
                </View>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions style={{ alignItems: "center", paddingBottom: 30 }}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <View style={{ alignSelf: "center", width: "50%" }}>
                <Button
                  onClickFn={() => hideDialog(true)}
                  text={t("ok")}
                  textColor={themeStyle.WHITE_COLOR}
                  fontSize={16}
                />
              </View>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}
