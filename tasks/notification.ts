import i18next from 'i18next';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import { getRefillMedicationList } from '@/services/medication';
import { IMedication, INotification, TResponse } from '@/@types';
import { NotificationStatus, NotificationType } from '@/config/constants';
import { addNotification } from '@/services/notification';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification';
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    getRefillMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            const medication: IMedication = res.data[i];
            const notification: INotification = {
              type: NotificationType.MEDICATION,
              var1: `${medication.name}`,
              var2: '',
              var3: '',
              status: NotificationStatus.PENDING,
              targetId: medication.id as number,
            }
            addNotification(notification);

            // Todo: Push Notification
            Notifications.scheduleNotificationAsync({
              content: {
                title: i18next.t('notfication_manage.low_stock_alert'),
                body: i18next.t('notification_manage.message_low_stock').replace('${var1}', medication.name),
              },
              trigger: null,
            });
          }
        }
      });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("background notification failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundNotificationTask = async () => {
  try {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("registered tasks:", tasks);

    const status = await BackgroundFetch.getStatusAsync();
    console.log("checking background notification status:", status);

    if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
      console.log("background notification is denied. Requesting permission...");
      return;
    }

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log("bacgkround notification is restricted.");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 3600 * 24, // Run every day
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("background notification registered successfully!");
    } else {
      console.log("background notification already registered.");
    }
  } catch (error) {
    console.error("failed to register background notification:", error);
  }
}

async function unregisterBackgroundNotificationTask() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}