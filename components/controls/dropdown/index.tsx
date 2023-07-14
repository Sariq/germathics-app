import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { View } from "react-native";

export type TProps = {
  itemsList: any;
  defaultValue: any;
  onChangeFn: (value:any) => void;
};
const DropDown = ({ itemsList, defaultValue, onChangeFn }: TProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(itemsList);

  const onSetValue = (value: any) => {
    setValue(value);
  }

  useEffect(()=>{
    onChangeFn(value)
  }, [value])

  return (
    <View style={{flexDirection: "row-reverse",}}>
  <DropDownPicker
      open={open}
      value={(value)}
      items={items}
      setOpen={setOpen}
      setValue={onSetValue}
      setItems={setItems}
      //  containerStyle={{margin:30}}
      // childrenContainerStyle={{
      //   justifyContent: 'flex-end',
      // }}
      //  itemStyle={{justifyContent: 'flex-end', left:100, margin:20}}
      //  dropDownStyle={{backgroundColor: '#fafafa', margin:10}}
    />
    </View>
  
  );
};
export default DropDown;
