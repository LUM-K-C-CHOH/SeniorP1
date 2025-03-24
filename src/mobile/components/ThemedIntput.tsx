/**
 * Themed Input Control Component
 * RTHA
 * 
 * Created by Morgan on 02/11/2025
 */
import React from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  borderLightColor?: string;
  borderDarkColor?: string;
  type?: 'default';
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  borderLightColor,
  borderDarkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'defaultControlText');
  const borderColor = useThemeColor({ light: borderLightColor, dark: borderDarkColor }, 'defaultControlBorder');

  return (
    <TextInput
      placeholderTextColor="#999"
      style={[
        { color: textColor },
        { borderColor: borderColor },
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
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10
  },
});