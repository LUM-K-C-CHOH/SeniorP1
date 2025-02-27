import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { syncLocalUpdatesToServer } from '@/services/sync';

const BACKGROUND_DB_SYNC_TASK = 'background-db-sync';
TaskManager.defineTask(BACKGROUND_DB_SYNC_TASK, async () => {
  try {
    await syncLocalUpdatesToServer();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("background db sync failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundDBSyncTask = async () => {
  try {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("registered tasks:", tasks);

    const status = await BackgroundFetch.getStatusAsync();
    console.log("checking background db sync status:", status);

    if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
      console.log("background db sync is denied. Requesting permission...");
      return;
    }

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log("bacgkround db sync is restricted.");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_DB_SYNC_TASK);
    
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_DB_SYNC_TASK, {
        minimumInterval: 60, // Run every 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("background db sync registered successfully!");
    } else {
      console.log("background db sync already registered.");
    }
  } catch (error) {
    console.error("failed to register background db sync:", error);
  }
}

async function unregisterBackgroundDBSyncTask() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_DB_SYNC_TASK);
}