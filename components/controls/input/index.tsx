import { StyleSheet, Text, View, TextInput } from "react-native";
import { TextInput as TextInputPaper } from "react-native-paper";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";

type TProps = {
  onChange: any;
  label: string;
  value?: string;
  isEditable?: boolean;
  onClick?: any;
  keyboardType?: any;
  isError?: boolean;
  isPreviewMode?: boolean;
  variant?: "default" | "outlined";
  placeHolder?: string;
  onFocus?: any;
  onBlur?: any;
};
export default function InputText({
  onChange,
  value,
  label,
  isEditable = true,
  onClick,
  keyboardType,
  isError,
  isPreviewMode,
  variant,
  placeHolder,
  onFocus,
  onBlur,
}: TProps) {
  const handleOnChange = (e) => {
    onChange && onChange(e.nativeEvent.text);
  };
  if (variant === "default") {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "left",
            paddingLeft: 10,
            marginBottom: 10,
            fontSize: 20,
          }}
        >
          {label}
        </Text>
        <TextInput
          value={value}
          onPressIn={onClick}
          editable={isEditable}
          onChange={handleOnChange}
          placeholder={placeHolder}
          placeholderTextColor={themeStyle.TEXT_PRIMARY_COLOR}
          selectionColor={"black"}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            textAlign: "center",
            height: 50,
            borderWidth: 1,
            borderColor: isError
              ? themeStyle.ERROR_COLOR
              : themeStyle.PRIMARY_COLOR,
            // borderRadius: 30,
            fontSize: 20,
            color: themeStyle.TEXT_PRIMARY_COLOR,
            fontFamily: `${getCurrentLang()}-SemiBold`,
          }}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TextInputPaper
        keyboardType={keyboardType}
        onPressIn={onClick}
        value={value}
        editable={isEditable}
        onChange={handleOnChange}
        mode="outlined"
        disabled={isPreviewMode}
        label={label}
        theme={{
          colors: {
            text: themeStyle.TEXT_PRIMARY_COLOR,
            placeholder: themeStyle.TEXT_PRIMARY_COLOR,
          },
          
        }}
        
        outlineColor={
          isError ? themeStyle.ERROR_COLOR : themeStyle.PRIMARY_COLOR
        }
        activeUnderlineColor={
          isError ? themeStyle.ERROR_COLOR : themeStyle.PRIMARY_COLOR
        }
        underlineColor={
          isError ? themeStyle.ERROR_COLOR : themeStyle.PRIMARY_COLOR
        }
        style={{
          fontSize: 20,
          // borderRadius: 100,
          fontFamily: `${getCurrentLang()}-SemiBold`,
          
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { width: "100%" },
});
