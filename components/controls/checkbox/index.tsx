import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import themeStyle from "../../../styles/theme.style";
import Icon from "../../icon";
import Button from "../button/button";
import * as Haptics from "expo-haptics";
import Text from "../Text";
import { LinearGradient } from "expo-linear-gradient";

export default function CheckBox({
  onChange,
  value,
  title = undefined,
  variant = "default",
  isOneChoice = false,
  isDisabled = false
}) {
  const [isSelected, setIsSelected] = useState(value);
  const onBtnClick = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // if (isOneChoice && value) {
    //   return;
    // }
    setIsSelected(isOneChoice ? isSelected : !isSelected);
    onChange && onChange(isOneChoice ? value : !isSelected);
  };
  useEffect(() => {
    setIsSelected(value);
  }, [value]);

  const sizeTitleAdapter = (title:string) => {
    switch(title){
      case 'large':
        return 'L';
      case 'medium':
        return 'S';
    }
  }

  if (variant === "button" && isOneChoice) {
    return (
      <View style={styles.container}>
        <View style={{ height: 50, width: 90 }}>
          {value === title ? (
            <Button
              fontSize={15}
              onClickFn={() => onChange(title)}
              text={title}
              textColor={themeStyle.BROWN_700}
              bgColor={themeStyle.PRIMARY_COLOR}
              borderRadious={10}
              isFlexCol
              textPadding={0}
            />
          ) : (
            <Button
              fontSize={15}
              onClickFn={() => onChange(title)}
              text={title}
              textColor={themeStyle.BROWN_700}
              bgColor={themeStyle.WHITE_COLOR}
              borderRadious={10}
              textPadding={0}
              isFlexCol
            />
          )}
        </View>
      </View>
    );
  }

  if (variant === "button") {
    return (
      <View style={styles.container}>
        <View
          onTouchEnd={() => {
            onBtnClick();
          }}
          style={{ height: 50, width: 90 }}
        >
          {isSelected ? (
            <Button
              fontSize={15}
              onClickFn={() => onChange(value)}
              text={title}
              textColor={themeStyle.BROWN_700}
              bgColor={themeStyle.PRIMARY_COLOR}
              borderRadious={10}
              isFlexCol
              textPadding={0}
            />
          ) : (
            <Button
              fontSize={15}
              onClickFn={() => onChange(value)}
              text={title}
              textColor={themeStyle.BROWN_700}
              bgColor={themeStyle.WHITE_COLOR}
              borderRadious={10}
              textPadding={0}
              isFlexCol
            />
          )}
        </View>
      </View>
    );
  }

  if (isOneChoice) {
    return (
      <View style={{alignItems:"center", opacity: isDisabled ? 0.5 : 1}}>
      {title && <Text style={{ marginBottom: 10, fontSize:20 }}>{sizeTitleAdapter(title)}</Text>}

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 20,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderColor: themeStyle.PRIMARY_COLOR,
        }}
        onPress={() => {
          onChange(title)

        }}
        disabled={isDisabled}
      >
        {value === title ? (
          <View style={{ height: 25, width: 25, borderRadius: 30, padding: 5 }}>
            <LinearGradient
              colors={["#eaaa5c", "#a77948"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.background]}
            />
          </View>
        ) : (
          <View></View>
        )}
      </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 20,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderColor: themeStyle.PRIMARY_COLOR,
      }}
      onPress={() => {
        onBtnClick();
      }}
    >
      {title && <Text style={{ marginBottom: 10 }}>{title}</Text>}
      {isSelected ? (
        <View style={{ height: 25, width: 25, borderRadius: 30, padding: 5, backgroundColor:themeStyle.SUCCESS_COLOR, borderColor: themeStyle.WHITE_COLOR, borderWidth:1 }}>
    
        </View>
      ) : (
        <View style={{ height: 25, width: 25, borderRadius: 30, padding: 5, backgroundColor:themeStyle.WHITE_COLOR, borderColor: themeStyle.WHITE_COLOR, borderWidth:1 }}>
          
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {},
  counterValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  btn: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    width: 30,
    height: 30,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 20,
  },
  unchecked: {
    borderWidth: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 30,
  },
});
