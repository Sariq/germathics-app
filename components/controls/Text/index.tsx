import { Text as ReactText } from "react-native";
import themeStyle from "../../../styles/theme.style";
import { getCurrentLang } from "../../../translations/i18n";

export type TProps = {
  children: any;
  style?: any;
  type?: any
};

const Text = ({ children, style,type }: TProps) => {
  if (!style?.color) {
    style = { ...style, color: themeStyle.TEXT_PRIMARY_COLOR };
  }
  if (!style?.fontFamily && type != 'number') {
    style = { ...style };
  }
  const customStyles = { ...style };

  return <ReactText style={customStyles}>{children}</ReactText>;
};

export default Text;
