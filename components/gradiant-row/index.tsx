import { StyleSheet, View, Image } from "react-native";
import Counter from "../controls/counter";
import CheckBox from "../controls/checkbox";
import i18n from "../../translations/index-x";
import { getCurrentLang } from "../../translations/i18n";
import themeStyle from "../../styles/theme.style";
import Text from "../controls/Text";
import ImagePicker from "../controls/image-picker";
import { useTranslation } from "react-i18next";
type TProps = {
  onChangeFn: any;
  icon?: any;
  type: any;
  title: any;
  value: any;
  stepValue?: number;
  minValue?: number;
  price?: number;
  hideIcon?: boolean;
  fontSize?: number;
  isMultipleChoice?: boolean;
  options?: any;
};

export default function GradiantRow({
  onChangeFn,
  icon,
  type,
  price,
  title,
  value,
  stepValue,
  minValue,
  hideIcon,
  fontSize,
  isMultipleChoice,
  options,
}: TProps) {
  const { t } = useTranslation();

  const onChange = (value) => {
    onChangeFn(value);
  };

  const getInputByType = (type, valuex, minValue) => {
    switch (type) {
      case "COUNTER":
        return (
          <Counter
            onCounterChange={onChange}
            value={valuex}
            stepValue={stepValue}
            minValue={minValue}
          />
        );
      case "CHOICE":
        return (
          <View style={{ paddingLeft: 8 }}>
            <CheckBox onChange={onChange} value={valuex} />
          </View>
        );
    }
  };

  if (type === "CHOICE" && !isMultipleChoice) {
    return (
      <View style={{ paddingLeft: 8 }}>
        <CheckBox
          onChange={onChange}
          value={value}
          title={title}
          variant={"button"}
          isOneChoice
        />
      </View>
    );
  }
  if (type === "uploadImage") {
    return (
      <View style={[styles.gradiantRow]}>
        <View
          style={[
            styles.textAndPriceContainer,
            { marginLeft: 20, width: "25%" },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize || 18,
              fontFamily: `${getCurrentLang()}-SemiBold`,
              color: themeStyle.BROWN_700,
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
            width: "60%",
            alignItems: "center",
          }}
        >
          <ImagePicker handleImageSelect={onChange} />
        </View>
      </View>
    );
  }
  if (type === "oneChoice") {
    return options.large.price > 0 && options.large.count > 0 ? (
      <View
        style={[
          styles.gradiantRow,
          { alignItems: "center",justifyContent: "center" },
        ]}
      >
        <View
          style={[
            styles.textAndPriceContainer,
            { marginLeft: 20, width: "18%" },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize || 20,
              fontFamily: `${getCurrentLang()}-SemiBold`,
              color: themeStyle.BROWN_700,
              left:-30
            }}
          >
            {t(title)}{" "}:
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            alignItems: "center",
            left:-40
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {Object.keys(options).map((key) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  title={key}
                  isOneChoice
                  isDisabled={options[key].count === 0}
                />
            ))}
          </View>
        </View>
      </View>
    ) : null;
  }
  return (
    <View style={styles.gradiantRow}>
      <View
        style={[styles.textAndPriceContainer, { marginLeft: 20, width: "40%" }]}
      >
        <View>
          <Text
            style={{
              fontSize: fontSize || 18,
              fontFamily: `${getCurrentLang()}-SemiBold`,
              color: themeStyle.BROWN_700,
            }}
          >
            {title}
          </Text>
        </View>
        {/* <View
          style={{
            marginHorizontal: -10,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 5,
          }}
        >
          {price ? (
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Rubik-Regular",
                color: themeStyle.BROWN_700,
              }}
            >
              {price}+
            </Text>
          ) : null}
          {price ? <Text>₪</Text> : null}
        </View> */}
      </View>
      <View style={styles.inputConatainer}>
        {getInputByType(type, value, minValue)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputConatainer: {
    width: "30%",
    alignItems: "center",
  },
  gradiantRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textAndPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
