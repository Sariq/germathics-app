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
import { SignatureView } from "react-native-signature-capture-view";
import BackButton from "../back-button";
import themeStyle from "../../styles/theme.style";

const SignuaterScreen = ({ onClose, signatureData, onSave }) => {
  const signatureRef = useRef(null);
  const [text, setText] = useState("");
  console.log("signatureData", signatureData);
  return (
    <ScrollView style={styles.container}>
      <BackButton isClose={true} onClick={onClose} />
      <View style={{ marginVertical: 15, alignItems:"center" }}>
        <Text style={{fontSize:25}}>المبلغ</Text>
        <Text style={{fontSize:20, marginTop:5}}>{signatureData.data.amount}</Text>
      </View>
      <SignatureView
        style={{
          borderWidth: 2,
          height: 200,
        }}
        ref={signatureRef}
        // onSave is automatically called whenever signature-pad onEnd is called and saveSignature is called
        onSave={(val) => {
          //  a base64 encoded image
          console.log("saved signature");
          console.log(val);
          setText(val);
        }}
        onClear={() => {
          console.log("cleared signature");
          setText("");
        }}
      />
      <View
        style={{ flexDirection: "row", justifyContent: "center", height: 50 }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          onPress={() => {
            signatureRef.current.clearSignature();
          }}
        >
          <Text>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          onPress={() => {
            signatureRef.current.saveSignature();
            onSave(text);
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
  
    </ScrollView>
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
