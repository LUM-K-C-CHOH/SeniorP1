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

import { IAppointment, IContact, TResponse } from '@/@types';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { generateBoxShadowStyle, getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, LocationIcon } from '@/utils/assets';
import { getContactList } from '@/services/contact';

type TAppointmentFormProps = {
  appointment?: IAppointment
};

export default function AppointmentForm({ appointment }: TAppointmentFormProps) {
  const initialRef = useRef<boolean>(false);

  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [calendarPopupVisible, setCalendarPopupVisible] = useState<boolean>(false);
  const [contactPopupVisible, setContactPopupVisible] = useState<boolean>(false);
  const [contactList, setContactList] = useState<IContact[]>([]);
  const [selectedContactInfo, setSelectedContactInfo] = useState<IContact>();

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

  const handleSelectedDate = (date: Date): void => {
    setSelectedDate(date);
  }

  const handleSelectedContact = (id: number): void => {
    const find = contactList.find(v => v.id === id);
    console.log(find)
    if (!find) return;

    setSelectedContactInfo(find);
    setContactPopupVisible(false);
  }

  type ContactItemProps = {
    id: number,
    name: string,
    onSelectedContact: (id: number) => void
  };

  const ContactItem = ({ id, name, onSelectedContact }: ContactItemProps): JSX.Element => {
    return (
      <TouchableHighlight onPress={() => onSelectedContact(id)}>
        <Text style={cstyles.contactNameText}>{name}</Text>
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
        <Calendar date={selectedDate} onSelectedDate={handleSelectedDate} />
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
            renderItem={({item}) => <ContactItem id={item.id} name={item.name} onSelectedContact={handleSelectedContact}/>}
            keyExtractor={item => `${item.id}`}
          />
        </ThemedView>
      </Modal>
      <Animated.ScrollView>
        <ThemedView style={styles.providerWrapper}>
          <ThemedText style={styles.labelText}>{t('appointment_manage.provider')}{' : '}</ThemedText>
          <ThemedView style={styles.providerInfoWrapper}>
            <ThemedView style={[styles.logoWrapper, { backgroundColor: getMarkColorFromName(selectedContactInfo?.name?? 'N A').bgColor }]}>
              <ThemedText style={[{ color: getMarkColorFromName(selectedContactInfo?.name?? 'N A').textColor }]}>
                {getMarkLabelFromName(selectedContactInfo?.name?? 'N/A')}
              </ThemedText>
            </ThemedView>
            <ThemedView>
              <ThemedText style={styles.nameText}>
                {selectedContactInfo ? selectedContactInfo.name : t('no_selected')}
              </ThemedText>
              {selectedContactInfo&&
              <ThemedText style={styles.nameText}>{selectedContactInfo.phone}</ThemedText>
              }
            </ThemedView>
          </ThemedView>
          <TouchableHighlight
            style={{ borderRadius: 5, marginTop: 5 }}
            onPress={() => setContactPopupVisible(true)}
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
  contactNameText: {
    width: '100%',
    paddingLeft: 10,
    backgroundColor: '#fff',
    paddingVertical: 5,
  }
});