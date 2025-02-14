/**
 * Appointment Form
 * RTHA
 * 
 * Created by Thornton on 02/07/2025
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
  View,
  TouchableHighlight,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import { generateBoxShadowStyle, getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, LocationIcon, LocationPinIcon } from '@/utils/svgs';
import { getContactList } from '@/services/contact';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';

type TAppointmentFormProps = {
  appointment?: IAppointment
};

const TimeType = {
  AM: 1,
  PM: 2
}

export default function AppointmentForm({ appointment }: TAppointmentFormProps) {
  const initiatedRef = useRef<boolean>(false);
  const backgroundColor = useThemeColor({}, 'background');
  const theme = useColorScheme();

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
    if (initiatedRef.current) return;

    initiatedRef.current = true;

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
          <LocationPinIcon color={theme === 'light' ? '#1e75e5' : '#eee'} />
          <ThemedText
            type="small"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={{ fontWeight: 500 }}
          >
            {name}
          </ThemedText>
        </ThemedView>
      </TouchableHighlight>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
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
        <View style={styles.providerWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={'#333'}
            lightColor={'#999'}
            style={styles.labelText}
          >
            {t('appointment_manage.provider')}{' : '}
          </ThemedText>
          <View style={styles.providerInfoWrapper}>
            <View style={[styles.logoWrapper, { backgroundColor: getMarkColorFromName(selectedContactInfo?.name?? 'N A').bgColor }]}>
              <ThemedText style={[{ color: getMarkColorFromName(selectedContactInfo?.name?? 'N A').textColor }]}>
                {getMarkLabelFromName(selectedContactInfo?.name?? 'N/A')}
              </ThemedText>
            </View>
            <View>
              <ThemedText
                type="default"
                darkColor={Colors.dark.grayText}
                lightColor={Colors.light.grayText}
                style={{ fontWeight: 500 }}
              >
                {selectedContactInfo ? selectedContactInfo.name : t('no_selected')}
              </ThemedText>
              {selectedContactInfo&&
                <ThemedText
                  type="default"
                  darkColor={Colors.dark.grayText}
                  lightColor={Colors.light.grayText}
                  style={{ fontWeight: 500 }}
                >
                  {selectedContactInfo.phone}
                </ThemedText>
              }
            </View>
          </View>
          <TouchableHighlight
            style={{ borderRadius: 5, marginTop: 5 }}
            onPress={() => setContactPopupVisible(true)}
          >
            <View style={styles.providerPickButton}>
              <LocationIcon color={theme === 'light' ? '#87b5f2' : '#87b5f2'} />
              <ThemedText
                type="defaultMedium"
                darkColor={'#87b5f2'}
                lightColor={'#87b5f2'}
              >
                {t('appointment_manage.choose_from_contact')}
              </ThemedText>
            </View>
          </TouchableHighlight>
          {errors.contact&&
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.contact}
            </ThemedText>
          }
        </View>
        <View style={styles.scheduledTimeWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.labelText}
          >
            {t('appointment_manage.scheduled_time')}{' : '}
          </ThemedText>
          <View style={styles.dateWrapper}>
            <TouchableHighlight
              style={{ borderRadius: 5, marginTop: 5 }}
              onPress={() => handleCalendarPopupVisible(true)}
            >
              <ThemedView style={styles.dateControl}>
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={{ fontWeight: 400 }}
                >
                  {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : ''}
                </ThemedText>
                <CalendarIcon color={theme === 'light' ? '#494e50' : '#494e50'} />
              </ThemedView>
            </TouchableHighlight>
            {errors.date&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.date}
              </ThemedText>
            }
          </View>
          <View style={styles.timeWrapper}>
            <ThemedInput
              type="default"
              style={styles.minuteInputControl}
              darkColor={Colors.dark.defaultControlText}
              lightColor={Colors.light.defaultControlText}
              placeholder="00"
              keyboardType="number-pad"
              maxLength={2}
              value={hour}
              onChangeText={(v) => handleTimeChange('hour', v)}
            />
            <ThemedText>:</ThemedText>
            <ThemedInput
              style={styles.minuteInputControl}
              type="default"
              darkColor={Colors.dark.defaultControlText}
              lightColor={Colors.light.defaultControlText}              
              placeholder="00"
              keyboardType="number-pad"
              maxLength={2}
              value={minute}
              onChangeText={(v) => handleTimeChange('minute', v)}
            />
            <ThemedText type="default">:</ThemedText>
            <View style={styles.secondPlaceholderWrapper}>
              <ThemedText
                type="defaultMedium"
                darkColor={Colors.dark.defaultControlText}
                lightColor={Colors.light.defaultControlText}
                style={{ fontWeight: 400 }}
              >
                00
              </ThemedText>
            </View>
            <View style={styles.amWrapper}>
              <Pressable onPress={() => setTimeType(TimeType.AM)}>
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={[
                    styles.amText, timeType === TimeType.AM&& styles.amActive,
                    { fontWeight: 400, borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }
                  ]}
                >
                  AM
                </ThemedText>
              </Pressable>
              <Pressable onPress={() => setTimeType(TimeType.PM)}>
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={[
                    styles.amText, timeType === TimeType.PM&& styles.amActive,
                    { fontWeight: 400, borderBottomRightRadius: 5, borderTopRightRadius: 5 }
                  ]}
                >
                  PM
                </ThemedText>
              </Pressable>
            </View>
          </View>
          {errors.time&&
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.time}
            </ThemedText>
          }
        </View>
        <View style={styles.descriptionWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.labelText}
          >
            {t('appointment_manage.description')}{' : '}
          </ThemedText>
          <ThemedInput
            style={styles.descriptionInputControl}
            darkColor={Colors.dark.defaultControlText}
            lightColor={Colors.light.defaultControlText}
            type="default"
            multiline={true}
            autoCapitalize="none"
            placeholder=""
            value={description}
            onChangeText={(v) => handleDescriptionChange(v)}
          />
          {errors.description&&
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.description}
            </ThemedText>
          }
        </View>
      </Animated.ScrollView>
      <View style={styles.actionWrapper}>
        <CustomButton onPress={handleSchedule}>
          <ThemedText
            type="button"
            darkColor={Colors.dark.defaultButtonText}
            lightColor={Colors.light.defaultButtonText}
          >
            {t('appointment_manage.schedule')}
          </ThemedText>
        </CustomButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textDecorationColor: '#0066ff',
    textDecorationLine: 'underline',
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
  },
  amWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  amText: {
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
    paddingHorizontal: 13
  },
  actionWrapper: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5
  },
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
    minHeight: 200,
    maxHeight: 250
  },
  contactNameWrapper: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    columnGap: 10
  },
});