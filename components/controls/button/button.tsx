import { StyleSheet, View, TouchableOpacity } from "react-native";
import theme from "../../../styles/theme.style";
import Icon from "../../icon";
import themeStyle from "../../../styles/theme.style";
import { ActivityIndicator } from "react-native-paper";
import * as Haptics from "expo-haptics";
import Text from "../Text";
import { getCurrentLang } from "../../../translations/i18n";
import { LinearGradient } from "expo-linear-gradient";

type TProps = {
  onClickFn: any;
  text: any;
  icon?: any;
  iconSize?: any;
  iconPosition?: "right" | "left";
  fontSize?: any;
  bgColor?: any;
  textColor?: any;
  fontFamily?: any;
  disabled?: boolean;
  isLoading?: boolean;
  borderRadious?: number;
  textPadding?: number;
  isFlexCol?: boolean;
  marginH?: number;
  iconMargin?: number;
  extraText?: string;
};
export default function Button({
  onClickFn,
  text,
  icon,
  iconSize,
  fontSize,
  iconPosition = "right",
  bgColor,
  textColor,
  fontFamily,
  disabled,
  isLoading,
  borderRadious,
  textPadding,
  isFlexCol,
  marginH,
  iconMargin,
  extraText,
}: TProps) {
  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClickFn();
  };

  const getBorderColor = () => {
    if (disabled) {
      return themeStyle.GRAY_600;
    }

    if (bgColor == "white" || bgColor == themeStyle.PRIMARY_COLOR) {
      return themeStyle.PRIMARY_COLOR;
    }

    if (bgColor) {
      return themeStyle.PRIMARY_COLOR;
    }
    return themeStyle.PRIMARY_COLOR;

  };
  const renderIcon = () => (
    <Icon
      icon={icon}
      size={iconSize ? iconSize : 20}
      style={{
        color: textColor || theme.GRAY_700,
        marginBottom: isFlexCol ? 10 : 0,
        marginRight: iconMargin ? iconMargin : 0,
      }}
    />
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.button,
          borderRadius: borderRadious !== undefined ? borderRadious : 30,
          backgroundColor: disabled ? themeStyle.GRAY_600 : bgColor || themeStyle.PRIMARY_COLOR,
          borderColor: getBorderColor(),
          borderWidth: bgColor ? 1 : 0 ,
          opacity: disabled && 0.3,
          alignItems: "center",
          padding: isFlexCol ? 0 : 10,
          height: isFlexCol ? "100%" : "auto",
          
        }}
        disabled={disabled}
        onPress={() => {
          onBtnClick();
        }}
      >
        {/* {!bgColor && (
          <LinearGradient
            colors={["#eaaa5c", "#a77948"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.background]}
          />
        )} */}
        <View
          style={{
            height: isFlexCol ? "100%" : "auto",
            flexDirection: isFlexCol ? "column" : "row",
            alignItems: "center",
            ...styles.button,
            borderRadius: borderRadious !== undefined ? borderRadious : 30,
            backgroundColor: "transparent",
            borderColor: getBorderColor(),
            width: "100%",
            
          }}
        >
          {icon && iconPosition && iconPosition === "right" && renderIcon()}
          <Text
            style={{
              marginHorizontal: marginH !== undefined ? marginH : 15,
              fontSize: fontSize,
              color: textColor || theme.WHITE_COLOR,
              fontFamily: fontFamily || `${getCurrentLang()}-Light`,
              padding: textPadding,
              textAlign: "center",
            }}
          >
            {text}
          </Text>

          {icon && iconPosition && iconPosition === "left" && renderIcon()}
          {isLoading && (
            <ActivityIndicator animating={true} color={theme.WHITE_COLOR} />
          )}
          <View></View>
        </View>
        {extraText && (
          <Text
            style={{
              fontSize: 20,
              color: textColor,
              fontFamily: fontFamily,
              textAlign: "center",
            }}
          >
            {extraText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginHorizontal: 15,
  },
  background: {
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "0%",
    bottom: "0%",
    borderRadius: 50,
  },
});
