/**
 * Appointment Form
 * RTHA
 * 
 * Created By Thornton at 02/07/2025
 */
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import Modal from 'react-native-modal';
import Calendar from '@/components/Calendar';

import { IAppointment } from '@/@types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, LocationIcon } from '@/utils/assets';
import dayjs from 'dayjs';

type TAppointmentFormProps = {
  appointment?: IAppointment
};

export default function AppointmentForm({ appointment }: TAppointmentFormProps) {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarPopupVisible, setCalendarPopupVisible] = useState<boolean>(false);

  const handleCalendarPopupVisible = (visible: boolean): void => {
    setCalendarPopupVisible(visible);
  }

  const handleSelectedDate = (date: Date): void => {
    setSelectedDate(date);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        isVisible={calendarPopupVisible}
        onBackdropPress={() => handleCalendarPopupVisible(false)}
        onBackButtonPress={() => handleCalendarPopupVisible(false)}
      >
        <Calendar date={selectedDate} onSelectedDate={handleSelectedDate} />
      </Modal>
      <Animated.ScrollView>
        <ThemedView style={styles.providerWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.provider')}{' : '}</ThemedText>
          <ThemedView style={styles.providerInfoWrapper}>
            <ThemedView style={[styles.logoWrapper, { backgroundColor: getMarkColorFromName(appointment?.name?? 'N A').bgColor }]}>
              <ThemedText style={[{ color: getMarkColorFromName(appointment?.name?? 'N A').textColor }]}>
                {getMarkLabelFromName(appointment?.name?? 'N/A')}
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.nameText}>No Selected</ThemedText>
          </ThemedView>
          <TouchableHighlight
            style={{ borderRadius: 5, marginTop: 5 }}
            onPress={() => {}}
          >
            <ThemedView style={styles.providerPickButton}>
              <LocationIcon />
              <Text style={styles.providerPickButtonText}>{t('appointment_manage.choose_from_contact')}</Text>
            </ThemedView>
          </TouchableHighlight>
        </ThemedView>
        <ThemedView style={styles.scheduledTimeWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.scheduled_time')}{' : '}</ThemedText>
          <ThemedView style={styles.dateWrapper}>
            <TouchableHighlight
              style={{ borderRadius: 5, marginTop: 5 }}
              onPress={() => handleCalendarPopupVisible(true)}
            >
              <ThemedView style={styles.dateControl}>
                <ThemedText style={styles.dateText}>{selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : ''}</ThemedText>
                <CalendarIcon />
              </ThemedView>
            </TouchableHighlight>
          </ThemedView>
          <ThemedView style={styles.timeWrapper}>
            <TextInput style={styles.minuteInputControl} />
            <ThemedText>:</ThemedText>
            <ThemedView style={styles.secondPlaceholderWrapper}>
              <ThemedText style={styles.secondPlaceholderText}>00</ThemedText>
            </ThemedView>          
            <ThemedView style={styles.amWrapper}>
              <ThemedText
                style={[styles.amText, styles.amActive, { borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }]}
              >
                AM
              </ThemedText>
              <ThemedText
                style={[styles.amText, { borderBottomRightRadius: 5, borderTopRightRadius: 5 }]}
              >
                PM
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.descriptionWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.description')}{' : '}</ThemedText>
          <TextInput
            style={styles.descriptionInputControl}
            multiline={true}
            autoCapitalize="none"
            placeholder=""
          />
        </ThemedView>
      </Animated.ScrollView>
      <ThemedView style={styles.actionWrapper}>
        <CustomButton onPress={() => {}}>
          <Text style={styles.scheduleButtonText}>{t('appointment_manage.schedule')}</Text>
        </CustomButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  providerWrapper: {
    rowGap: 5
  },
  providerInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 5,
  },
  logoWrapper: {
    width: 70,
    height: 70,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  labelText: {
    fontWeight: 500,
    fontSize: 16,
    color: '#333',
    textDecorationColor: '#0066ff',
    textDecorationLine: 'underline',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#777',
  },
  providerPickButton: {
    backgroundColor: '#eff6ff',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    columnGap: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  providerPickButtonText: {
    color: '#87b5f2',
    fontWeight: 600,
    fontSize: 16
  },
  scheduledTimeWrapper: {
    marginTop: 20
  },
  dateWrapper: {
    marginTop: 5
  },
  dateControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#32a9ea',
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
  }, 
  dateText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 400
  },
  timeWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    columnGap: 10
  },
  minuteInputControl: {
    borderColor: '#32a9ea',
    borderWidth: 1,
    borderRadius: 5,
    width: 50,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
  },
  amWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  amText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2'
  },
  amActive: {
    backgroundColor: '#2196f3',
    color: '#fff',
    borderColor: '#2196f3'
  },
  secondPlaceholderWrapper: {
    backgroundColor: '#eee',
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  secondPlaceholderText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
  },
  descriptionWrapper: {
    marginTop: 20,
  },
  descriptionInputControl: {
    borderWidth: 1,
    borderColor: '#e2e2e2', 
    borderRadius: 5,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
    paddingHorizontal: 13
  },
  actionWrapper: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
  }, 
});