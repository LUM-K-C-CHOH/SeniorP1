/**
 * DB Sync
 * RTHA
 * 
 * Created by Morgn on 02/22/2025
 */
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { getAppState } from '@/config/global';
import { eventMedicationNotification, eventAppointmentNotification } from '@/services/event';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification';
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  const appState = getAppState();
  eventMedicationNotification(appState.user?.id as string);
  eventAppointmentNotification(appState.user?.id as string);
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
    console.log("failed to register background notification:", error);
  }
}

async function unregisterBackgroundNotificationTask() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}