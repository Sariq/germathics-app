import { View } from "react-native";
import { Dialog, Portal, Provider } from "react-native-paper";
import Text from "../controls/Text";

/* styles */
import theme from "../../styles/theme.style";
import Icon from "../../components/icon";
import { useState, useEffect } from "react";
import Button from "../../components/controls/button/button";
import themeStyle from "../../styles/theme.style";
import { useTranslation } from "react-i18next";
import seatsStatusOptions from "../seats-status-options";
import SeatsStatusOptionsScreen from "../seats-status-options"
import BackButton from "../back-button";
type TProps = {
  isOpen: boolean;
  handleAnswer?: any;
  value?: any;
};

export default function PaymentFailedDialog({
  isOpen,
  handleAnswer,
  value,
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

  const onApperanceChange = (value: boolean) => {
    handleAnswer && handleAnswer(value);
    setVisible(false);
  };

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
            borderRadius: 10,
            backgroundColor: themeStyle.SECONDARY_COLOR
          }}
          visible={visible}
          dismissable={false}
        >
     
     
          <Dialog.Content>

          <View style={{marginTop:0, right:-60}}>
          <BackButton isClose={true} onClick={hideDialog} />

          </View>
          <View style={{marginTop:60, height:"100%"}}>
          <SeatsStatusOptionsScreen
                      value={value}
                      onSave={(value) => onApperanceChange(value)}
                    />
          </View>
   
          </Dialog.Content>
    
        </Dialog>
      </Portal>
    </Provider>
  );
}