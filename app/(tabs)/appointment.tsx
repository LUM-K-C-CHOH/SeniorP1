import Animated from 'react-native-reanimated';
import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function Appointment() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Function to handle button press
  const handleAppointmentPress = () => {
    // Navigate to an appointment details or booking screen
    navigation.navigate('AppointmentDetails'); 
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Animated.ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{t('appointment')}</ThemedText>
        </ThemedView>

        {/* Appointment Button */}
        <TouchableOpacity style={styles.appointmentButton} onPress={handleAppointmentPress}>
          <ThemedText type="button">{t('bookAppointment')}</ThemedText>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  appointmentButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff', // Blue button
    borderRadius: 10,
    alignItems: 'center',
  },
});
