/**
 * Themed Input Control Component
 * RTHA
 * 
 * Created By Thornton at 02/11/2025
 */
import React from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default';
};

const ThemedInput = ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps): JSX.Element => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontWeight: 400,
  },
});

export default ThemedInput;