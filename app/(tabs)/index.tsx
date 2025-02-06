import Animated from 'react-native-reanimated';

import { StyleSheet, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{t('dashboard.dashboard')}</ThemedText>
        </ThemedView>
        <ThemedView style={{ alignItems: 'center' }}>
        <Link href="/emergency" style={{ marginTop: 50 }}>
          <View style={styles.emergencyButton}>
            <ThemedText style={styles.emergencyButtonText}>{t('dashboard.alert_emergency')}</ThemedText>
          </View>
        </Link>
        </ThemedView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20
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
