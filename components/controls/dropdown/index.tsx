import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { View } from "react-native";

export type TProps = {
  itemsList: any;
  defaultValue: any;
  onChangeFn: (value:any) => void;
  onHandleOpen?: (value:any) => void;
};
const DropDown = ({ itemsList, defaultValue, onChangeFn, onHandleOpen }: TProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(itemsList);

  const onSetValue = (value: any) => {
    setValue(value);
  }
  const handleOpen = (value: any) => {
    setOpen(value);
    onHandleOpen && onHandleOpen(value);
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
      setOpen={handleOpen}
      setValue={onSetValue}
      setItems={setItems}
      style={{height:60, marginTop:8}}
        
      // childrenContainerStyle={{
      //   justifyContent: 'flex-end',
      //   zIndex:20
      // }}
      //   itemStyle={{justifyContent: 'flex-end', left:100, margin:20,zIndex:20}}
      //  dropDownStyle={{backgroundColor: '#fafafa', margin:10,zIndex:20}}
    />
    </View>
  
  );
};
export default DropDown;
