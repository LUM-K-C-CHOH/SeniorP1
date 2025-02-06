import Animated from 'react-native-reanimated';

import { StyleSheet, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';

export default function AppointmentScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{t('appointment')}</ThemedText>
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
});
