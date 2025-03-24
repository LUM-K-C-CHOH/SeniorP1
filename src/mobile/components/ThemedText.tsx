import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'small' | 'title' | 'subtitle' | 'mediumTitle' | 'bigTitle' | 'defaultMedium' | 'link' | 'button' | 'defaultSize' | 'contactSize';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'defaultText');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'mediumTitle' ? styles.mediumTitle : undefined,
        type === 'bigTitle' ? styles.bigTitle : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultMedium' ? styles.defaultMedium : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'defaultSize' ? styles.defaultSize : undefined,
        type === 'contactSize' ? styles.contactSize : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontWeight: 400,
  },
  defaultMedium: {
    fontSize: 16,
    fontWeight: 500,
  },
  small: {
    fontSize: 12,
    fontWeight: 400
  },
  bigTitle: {
    fontSize: 30,
    fontWeight: 700,
  },
  mediumTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  link: {
    fontSize: 16,
    fontWeight: 400
  },
  button: {
    fontSize: 18,
    fontWeight: 500
  },
  defaultSize: {
    width: 240,
    flexWrap: "wrap"
  },
  contactSize: {
    width: 140,
    flexWrap: "wrap"
  }
});
