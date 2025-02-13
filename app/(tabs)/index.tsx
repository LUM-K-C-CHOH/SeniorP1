/**
 * index.tsx
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import Animated from 'react-native-reanimated';

import { StyleSheet, SafeAreaView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Animated.ScrollView>
        <View style={styles.titleContainer}>
          <ThemedText type="title">{t('dashboard.dashboard')}</ThemedText>
        </View>
        <View style={{ alignItems: 'center' }}>
        <Link href="/emergency" style={{ marginTop: 50 }}>
          <View style={styles.emergencyButton}>
            <ThemedText style={styles.emergencyButtonText}>{t('dashboard.alert_emergency')}</ThemedText>
          </View>
        </Link>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emergencyButton: {
    backgroundColor: '#da1d1d',
    width: 235,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: 500,
    color: '#fff'
  }
});
