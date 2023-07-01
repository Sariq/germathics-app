import { View } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
import Text from "../../controls/Text";

/* styles */
import theme from "../../../styles/theme.style";
import { useState, useEffect } from "react";
import Button from "../../../components/controls/button/button";
import themeStyle from "../../../styles/theme.style";
import { useTranslation } from "react-i18next";
import Icon from "../../icon";
import CalanderContainerUser from "./clander-container";
// import ExpandableCalendarScreen from "./clander-container";

type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
  text?: string;
  icon?: any;
};

export default function PickTimeDialog({
  isOpen,
  handleAnswer,
  text,
  icon,
}: TProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const hideDialog = (value: boolean) => {
    handleAnswer && handleAnswer(value);
    setVisible(false);
  };
  return (
    <Provider>
      <Portal>
        <Dialog
          theme={{
            colors: {
              //   backdrop: "transparent",
              
            },
          }}
          
          visible={visible}
          dismissable={false}
          style={{
      
           
            zIndex:100, 
            width:"100%",
            position:"absolute",
            top:-20,
            left:-25,
            right:0, 
            bottom:0,

          }}
        >
          <Dialog.Content
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
         
            }}
          >
            <CalanderContainerUser handleSelectedDate={hideDialog} />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Provider>
  );
}
