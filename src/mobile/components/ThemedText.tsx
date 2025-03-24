import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useFontSizeRatio } from '@/hooks/useFontSize';

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
  const fzRatio = useFontSizeRatio();

  return (
    <Text
      style={[
        { color },
        type === 'default' ? { ...styles.default, fontSize: styles.default.fontSize * fzRatio} : undefined,
        type === 'small' ? { ...styles.small, fontSize: styles.small.fontSize * fzRatio } : undefined,
        type === 'mediumTitle' ? { ...styles.mediumTitle, fontSize: styles.mediumTitle.fontSize * fzRatio} : undefined,
        type === 'bigTitle' ? { ...styles.bigTitle, fontSize: styles.bigTitle.fontSize * fzRatio} : undefined,
        type === 'title' ? { ...styles.title, fontSize: styles.title.fontSize * fzRatio} : undefined,
        type === 'defaultMedium' ? { ...styles.defaultMedium, fontSize: styles.defaultMedium.fontSize * fzRatio} : undefined,
        type === 'subtitle' ? { ...styles.subtitle, fontSize: styles.subtitle.fontSize * fzRatio} : undefined,
        type === 'link' ? { ...styles.link, fontSize: styles.link.fontSize * fzRatio} : undefined,
        type === 'button' ? { ...styles.button, fontSize: styles.button.fontSize * fzRatio} : undefined,
        type === 'defaultSize' ? { ...styles.defaultSize, fontSize: styles.defaultSize.fontSize * fzRatio} : undefined,
        type === 'contactSize' ? { ...styles.contactSize, fontSize: styles.contactSize.fontSize * fzRatio} : undefined,
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
    flexWrap: "wrap",
    fontSize: 16,
  },
  contactSize: {
    width: 140,
    flexWrap: "wrap",
    fontSize: 16
  }
});
