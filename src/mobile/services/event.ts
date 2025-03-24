import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as Notifications from 'expo-notifications';
import i18next from 'i18next';

import { getCombinedMedicationList, updateMedication } from '@/services/medication';
import { IMedication, INotification } from '@/@types';
import { NotificationStatus, NotificationType } from '@/config/constants';
import { addNotification } from '@/services/notification';
import { getToCalendar } from './google-calendar';

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
  const resultList: IMedication[] = await getCombinedMedicationList(userId);

  for (let i = 0; i < resultList.length; i++) {
    const eachList: IMedication = resultList[i];
    const sDate = eachList.startDate;
    const eDate = eachList.endDate;
    let stockDate: string | null = null;
    const _cDate = dayjs(currentDate).format('YYYY-MM-DD');
    const _sDate = dayjs(sDate).format('YYYY-MM-DD');
    const _eDate = dayjs(eDate).format('YYYY-MM-DD');
    
    dayjs.extend(isBetween);
    if (dayjs(_cDate).isBetween(_sDate, _eDate)) {
      if (eachList.stockDate === "") {
        stockDate = sDate;
      } else {
        stockDate = eachList.stockDate;
      }

      const dosageAmount =
        (dayjs(_cDate).diff(dayjs(stockDate)) / one_day) *
        eachList.frequency.dosage *
        eachList.frequency.times.length /
        eachList.frequency.cycle;
      stockDate = currentDate;
      const data = {
        ...eachList,
        stockDate: stockDate,
        stock: eachList.stock - dosageAmount,
        image: "",
      };

      updateMedication(data);

      if (eachList.stock - dosageAmount < eachList.threshold) {
        const notification: INotification = {
          userId: userId,
          type: NotificationType.MEDICATION,
          var1: `${eachList.name}`,
          var2: "",
          var3: "",
          status: NotificationStatus.PENDING,
          targetId: eachList.id as number,
        };
        addNotification(notification);

        Notifications.scheduleNotificationAsync({
          content: {
            title: i18next.t("notification_manage.low_stock_alert"),
            body: i18next.t("notification_manage.message_low_stock", {
              var1: eachList.name,
            }),
          },
          trigger: null,
        });
      }
      console.log(eachList);
    }
  }
};

export const eventAppointmentNotification = async (userId: string) => {
  let currentDate = new Date().toISOString().split('T')[0];
  let res = await getToCalendar();

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