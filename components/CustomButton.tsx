import React from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'

type TCustomButtonProps = {
  progress?: boolean,
  children: React.ReactNode,
  size?: { width: number, height: number };
  bgColor?: string,
  onPress: () => void
}
const CustomButton = (props: TCustomButtonProps): JSX.Element => {
  const { progress, children, size, bgColor, ...rest } = props;
  let st: any = [
    styles.buttonWrapper,
    {
      backgroundColor: bgColor?? '#0066ff',          
    }
  ];
  if (size?.width) st.push({ width: size.width });
  if (size?.height) st.push({ height: size.height });

  return (
    <TouchableOpacity
      style={st}
      {...rest}
    >
      {progress&& <ActivityIndicator />}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});

export default CustomButton;