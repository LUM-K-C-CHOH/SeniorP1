/**
 * Appointment Form
 * RTHA
 * 
 * Created By Thornton at 02/07/2025
 */
import React, { useEffect, useState, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import { default as AnimatedModal } from 'react-native-modal';
import Calendar from '@/components/Calendar';
import dayjs from 'dayjs';
import Animated from 'react-native-reanimated';

import { IAppointment, IContact, TResponse } from '@/@types';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { generateBoxShadowStyle, getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, LocationIcon, LocationPinIcon } from '@/utils/svgs';
import { getContactList } from '@/services/contact';

type TAppointmentFormProps = {
  appointment?: IAppointment
};

const TimeType = {
  AM: 1,
  PM: 2
}

export default function AppointmentForm({ appointment }: TAppointmentFormProps) {
  const initialRef = useRef<boolean>(false);

  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarPopupVisible, setCalendarPopupVisible] = useState<boolean>(false);
  const [contactPopupVisible, setContactPopupVisible] = useState<boolean>(false);
  const [contactList, setContactList] = useState<IContact[]>([]);
  const [selectedContactInfo, setSelectedContactInfo] = useState<IContact>();
  const [timeType, setTimeType] = useState<number>(TimeType.AM);
  const [hour,setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;

    getContactList()
      .then((res: TResponse) => {
        if (res.success) {
          setContactList(res.data?? []);          
        } else {
        }
      });
  }, []);

  useEffect(() => {
    if (appointment) {            
      const contactId = appointment.contactId;
      const find = contactList.find((v: IContact) => v.id === contactId);
      setSelectedContactInfo(find);
    }
  }, [appointment]);

  const handleCalendarPopupVisible = (visible: boolean): void => {
    setCalendarPopupVisible(visible);
  }

  const handleDateSelect = (date: Date): void => {
    if (date) {
      const { date, ...rest } = errors;
      setErrors(rest);
    }
    setSelectedDate(date);
  }

  const handleContactSelect = (id: number): void => {
    const find = contactList.find(v => v.id === id);
 
    if (!find) return;

    const { contact, ...rest } = errors;
    setErrors(rest);

    setSelectedContactInfo(find);
    setContactPopupVisible(false);
  }

  const handleTimeChange = (type: string, value: string): void => {
    if (type === 'hour') {
      setHour(value);

      if (value.length > 0 && minute.length > 0) {
        const { time, ...rest } = errors;
        setErrors(rest);
      }
    }

    if (type === 'minute') {
      setMinute(value);

      if (value.length > 0 && hour.length > 0) {
        const { time, ...rest } = errors;
        setErrors(rest);
      }
    }
  }

  const handleDescriptionChange = (desc: string): void => {
    setDescription(desc);

    if (desc.length > 0) {
      const { description, ...rest } = errors;
      setErrors(rest);
    }
  }

  const handleSchedule  = (): void => {
    const errors: {[k: string]: string} = {};

    if (!selectedContactInfo) {
      errors['contact'] = t('message.alert_select_provider');
    }

    if (!selectedDate) {
      errors['date'] = t('message.alert_select_schedule_date');
    }

    if (hour.length === 0 || minute.length === 0) {
      errors['time'] = t('message.alert_input_schedule_time');
    }

    if (description.length === 0) {
      errors['description'] = t('message.alert_input_description');
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;

  }

  type ContactItemProps = {
    id: number,
    name: string,
    onSelectedContact: (id: number) => void
  };

  const ContactItem = ({ id, name, onSelectedContact }: ContactItemProps): JSX.Element => {
    return (
      <TouchableHighlight onPress={() => onSelectedContact(id)}>
        <ThemedView style={cstyles.contactNameWrapper}>
          <LocationPinIcon />
          <ThemedText style={cstyles.contactNameText}>{name}</ThemedText>
        </ThemedView>
      </TouchableHighlight>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedModal
        isVisible={calendarPopupVisible}
        onBackdropPress={() => handleCalendarPopupVisible(false)}
        onBackButtonPress={() => handleCalendarPopupVisible(false)}
      >
        <Calendar date={selectedDate} onSelectedDate={handleDateSelect} />
      </AnimatedModal>
      <Modal
        visible={contactPopupVisible}
        transparent={true}
      >
        <Pressable style={cstyles.contactPopupOverlay} onPress={() => setContactPopupVisible(false)} />
        <ThemedView
          style={[
            cstyles.contactPopupContainer,
            generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
          ]}
        >
          <FlatList
            data={contactList}
            renderItem={({item}) => <ContactItem id={item.id} name={item.name} onSelectedContact={handleContactSelect}/>}
            keyExtractor={item => `${item.id}`}
          />
        </ThemedView>
      </Modal>
      <Animated.ScrollView>
        <ThemedView style={styles.providerWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.provider')}{' : '}</ThemedText>
          <View style={styles.providerInfoWrapper}>
            <View style={[styles.logoWrapper, { backgroundColor: getMarkColorFromName(selectedContactInfo?.name?? 'N A').bgColor }]}>
              <ThemedText style={[{ color: getMarkColorFromName(selectedContactInfo?.name?? 'N A').textColor }]}>
                {getMarkLabelFromName(selectedContactInfo?.name?? 'N/A')}
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.nameText}>
                {selectedContactInfo ? selectedContactInfo.name : t('no_selected')}
              </ThemedText>
              {selectedContactInfo&&
              <ThemedText style={styles.nameText}>{selectedContactInfo.phone}</ThemedText>
              }
            </View>
          </View>
          <TouchableHighlight
            style={{ borderRadius: 5, marginTop: 5 }}
            onPress={() => setContactPopupVisible(true)}
          >
            <View style={styles.providerPickButton}>
              <LocationIcon />
              <Text style={styles.providerPickButtonText}>{t('appointment_manage.choose_from_contact')}</Text>
            </View>
          </TouchableHighlight>
          {errors.contact&&
            <ThemedText style={styles.errorText}>{errors.contact}</ThemedText>
          }
        </ThemedView>
        <ThemedView style={styles.scheduledTimeWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.scheduled_time')}{' : '}</ThemedText>
          <View style={styles.dateWrapper}>
            <TouchableHighlight
              style={{ borderRadius: 5, marginTop: 5 }}
              onPress={() => handleCalendarPopupVisible(true)}
            >
              <View style={styles.dateControl}>
                <ThemedText style={styles.dateText}>{selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : ''}</ThemedText>
                <CalendarIcon />
              </View>
            </TouchableHighlight>
            {errors.date&&
              <ThemedText style={styles.errorText}>{errors.date}</ThemedText>
            }
          </View>
          <View style={styles.timeWrapper}>
            <TextInput
              style={styles.minuteInputControl}
              placeholder="00"
              value={hour}
              onChangeText={(v) => handleTimeChange('hour', v)}
            />
            <ThemedText>:</ThemedText>
            <TextInput
              style={styles.minuteInputControl}
              placeholder="00"
              value={minute}
              onChangeText={(v) => handleTimeChange('minute', v)}
            />
            <ThemedText>:</ThemedText>
            <View style={styles.secondPlaceholderWrapper}>
              <ThemedText style={styles.secondPlaceholderText}>00</ThemedText>
            </View>   
            <View style={styles.amWrapper}>
              <Pressable onPress={() => setTimeType(TimeType.AM)}>
                <ThemedText
                  style={[styles.amText, timeType === TimeType.AM&& styles.amActive, { borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }]}
                >
                  AM
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => setTimeType(TimeType.PM)}>
                <ThemedText
                  style={[styles.amText, timeType === TimeType.PM&& styles.amActive, { borderBottomRightRadius: 5, borderTopRightRadius: 5 }]}
                >
                  PM
                </ThemedText>
              </Pressable>
            </View>
          </View>
          {errors.time&&
            <ThemedText style={styles.errorText}>{errors.time}</ThemedText>
          }
        </ThemedView>
        <ThemedView style={styles.descriptionWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.description')}{' : '}</ThemedText>
          <TextInput
            style={styles.descriptionInputControl}
            multiline={true}
            autoCapitalize="none"
            placeholder=""
            value={description}
            onChangeText={(v) => handleDescriptionChange(v)}
          />
          {errors.description&&
            <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
          }
        </ThemedView>
      </Animated.ScrollView>
      <ThemedView style={styles.actionWrapper}>
        <CustomButton onPress={handleSchedule}>
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
    backgroundColor: '#fff',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 400
  }
});

const cstyles = StyleSheet.create({
  contactPopupOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  contactPopupContainer: {
    position: 'absolute',
    top: 220,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    minHeight: 200,
    maxHeight: 250
  },
  contactNameWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    columnGap: 10
  },
  contactNameText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#666'
  }
});