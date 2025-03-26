import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as Notifications from 'expo-notifications';
import i18next from 'i18next';

import { getCombinedMedicationList, sendEmail, updateMedication } from '@/services/medication';
import { IMedication, INotification } from '@/@types';
import { NotificationStatus, NotificationType } from '@/config/constants';
import { addNotification } from '@/services/notification';
import { getToCalendar } from './google-calendar';
import { getAppState } from '@/config/global';

// const getCombinedMedicationList = async (): Promise<IMedication[]> => {
//   const medicationList = await getAllData(Tables.MEDICATIONS);
//   const frequencyList = await getAllData(Tables.FREQUENCIES);
//   const resultList: IMedication[] = medicationList.map((v1: any) => {
//     const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);

//     return {
//       id: v1.id,
//       name: v1.name,
//       stock: v1.stock,
//       miniStock: v1.mini_stock,
//       startDate: v1.start_date,
//       endDate: v1.end_date,
//       stockDate: v1.stock_date,
//       threshold: v1.threshold,
//       emailAlert: v1.email_alert,
//       pushAlert: v1.push_alert,
//       frequency: f ? {
//         id: f.id,
//         medicationId: f.medication_id,
//         dosage: f.dosage,
//         dosageUnit: f.dosage_unit,
//         cycle: f.cycle,
//         times: f.times.split(',')
//       } : null
//     }
//   });
//   return resultList;
// }

export const eventMedicationNotification = async (userId: string) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const one_day = 1000 * 60 * 60 * 24;
  const medicationList: IMedication[] = await getCombinedMedicationList(userId);
  const appState = getAppState();

  for (let i = 0; i < medicationList.length; i++) {
    const medication: IMedication = medicationList[i];
    const sDate = medication.startDate;
    const eDate = medication.endDate;
    let stockDate: string | null = null;
    const _cDate = dayjs(currentDate).format('YYYY-MM-DD');
    const _sDate = dayjs(sDate).format('YYYY-MM-DD');
    const _eDate = dayjs(eDate).format('YYYY-MM-DD');
    
    dayjs.extend(isBetween);
    if (dayjs(_cDate).isBetween(_sDate, _eDate)) {
      console.log('start medication stock check...')
      if (medication.stockDate === "") {
        stockDate = sDate;
      } else {
        stockDate = medication.stockDate;
      }

      const dosageAmount =
        (dayjs(_cDate).diff(dayjs(stockDate)) / one_day) *
        medication.frequency.dosage *
        medication.frequency.times.length /
        medication.frequency.cycle;
      stockDate = currentDate;
      const data = {
        ...medication,
        stockDate: stockDate,
        stock: medication.stock - dosageAmount,
        image: '',
      };

      updateMedication(data);

      if (medication.stock - dosageAmount < medication.threshold) {
        const notification: INotification = {
          userId: userId,
          type: NotificationType.MEDICATION,
          var1: `${medication.name}`,
          var2: "",
          var3: "",
          status: NotificationStatus.PENDING,
          targetId: medication.id as number,
        };

        addNotification(notification);

        if (medication.pushAlert === 'on' && appState.setting.push === 'on') {
          Notifications.scheduleNotificationAsync({
            content: {
              title: i18next.t('notification_manage.low_stock_alert'),
              body: i18next.t('notification_manage.message_low_stock').replace('${var1}', medication.name),
            },
            trigger: null,
          });
        }

        if (medication.emailAlert === 'on') {
          sendEmail(medication.name, appState.user?.email as string, appState.user?.name as string)
            .then(res => {
              console.log('Send medication replenishment email', res);
            }); 
        }
      }
      console.log(medication);
    }
  }
};

export const eventAppointmentNotification = async (userId: string) => {
  let currentDate = new Date().toISOString().split('T')[0];
  let res = await getToCalendar();
  const appState = getAppState();

  for (let i = 0; i < res?.message.length; i++) {
    let _cDate = dayjs(currentDate).format("YYYY-MM-DD");
    let eachEvent = res?.message[i];
    let eventDate = eachEvent.start.dateTime.split("T")[0];
    let _eventDate = dayjs(eventDate).format("YYYY-MM-DD");

    if (_eventDate === _cDate) {
      const notification: INotification = {
        userId: userId,
        type: NotificationType.APPOINTMENT,
        var1: `${eachEvent.summary}`,
        var2: "",
        var3: "",
        status: NotificationStatus.PENDING,
        targetId: 11,
      };

      addNotification(notification);

      if (appState.setting.push === 'on') {
        Notifications.scheduleNotificationAsync({
          content: {
            title: i18next.t("notification_manage.appointment_alert"),
            body: i18next.t("notification_manage.message_appointment", {
              var1: eachEvent.summary,
            }),
          },
          trigger: null,
        });
      }
    }
  }
}