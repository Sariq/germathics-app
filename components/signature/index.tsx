import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
// import { SignatureView } from "react-native-signature-capture-view";
import Signature from "react-native-signature-canvas";

import BackButton from "../back-button";
import themeStyle from "../../styles/theme.style";

const SignuaterScreen = ({ onClose, signatureData, onSave }) => {
  const [signature, setSign] = useState(null);

  const handleOK = (signature) => {
    setSign(signature);
    onSave(signature);

  };

  const handleEmpty = () => {
    setSign(null);

  };
  
  const style = `.m-signature-pad--footer
  .button {
    background-color: red;
    color: #FFF;
  }`;
  return (
    <View style={styles.container}>
      <BackButton isClose={true} onClick={onClose} />
      <View style={{ marginVertical: 15, alignItems:"center" }}>
        <Text style={{fontSize:25}}>المبلغ</Text>
        <Text style={{fontSize:20, marginTop:5}}>{signatureData.data.amount}</Text>
      </View>
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
        style={{height:"100%"}}
      />
    </View>
  );
};

export default SignuaterScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginBottom: 30,
  },
  inputsContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  footerTabs: {
    backgroundColor: "blue",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  seatContainer: {
    margin: 15,
    padding: 10,
    width: 90,
    height: 50,
    alignItems: "center",
    borderColor: themeStyle.WHITE_COLOR,
  },
  seatIconContainer: {
    borderWidth: 1,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    borderColor: themeStyle.WHITE_COLOR,
  },
});
