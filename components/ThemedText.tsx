import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'small' | 'title' | 'bigTitle' | 'defaultMedium' | 'subtitle' | 'link' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'bigTitle' ? styles.bigTitle : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultMedium' ? styles.defaultMedium : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'button' ? styles.button : undefined,
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
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  button: {
    fontSize: 18,
    fontWeight: 500
  }
});
