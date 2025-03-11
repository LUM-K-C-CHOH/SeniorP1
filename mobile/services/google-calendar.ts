/**
 * Google Calendar Service
 * RTHA
 * 
 * Created by Thornton on 03/09/2025
 */

import React, { useEffect } from 'react';

import { IAppointment, TResponse } from '@/@types';
import { GoogleSignin, statusCodes, User, SignInResponse } from '@react-native-google-signin/google-signin';
import { t } from 'i18next';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: `746634592236-vf85rn84rraaq3b2git4ssalrdkromji.apps.googleusercontent.com`, 
  scopes: [
    // 'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
});

let user = null;
const checkCurrentUser = async () => {
  try {
    const hasSignedInBefore = GoogleSignin.hasPreviousSignIn();
    if (hasSignedInBefore) {
      getCurrentUser();
    }
  } catch (error) {
    console.error('Check user error:', error);
  }
};

const getCurrentUser = async () => {
  try {
    const currentUser = GoogleSignin.getCurrentUser();
    user = currentUser;
  } catch (error) {
    console.error('Get current user error:', error);
  }
}

const signIn = async () => {
  try {
    const userInfo: SignInResponse = await GoogleSignin.signIn();
    user = userInfo.data as User
    
    // Get user's ID token
    const { accessToken, idToken } = await GoogleSignin.getTokens();
    return accessToken;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Sign in cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available');
    } else {
      console.error('Sign-in error:', error);
    }
    return null;
  }
}

const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    user = null;
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

const createGoogleCalendarEvent = async (accessToken ?: string, data?: IAppointment): Promise<TResponse> => {
  const event = {
    summary: `Meeting with ${data?.name}`,
    location: "Online",
    description: `${data?.description}`,
    start: {
      dateTime: `${data?.scheduledTime}`,
      timeZone: "Asia/Tokyo",
    },
    end: {
      dateTime: `${data?.scheduledTime}`,
      timeZone: "Asia/Tokyo",
    },
  };

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      }
    );
  
    const result = await response.json();
    if (result.error) {
      console.log('google calendar event reuslt: ', result.error.errors, event, accessToken);
      await signOut();
      return { success: false, message: t('message.alert_link_google_calendar_fail') };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'unknown' };
  }    
}

export const linkToCalendar = async (data: IAppointment): Promise<TResponse> => {
  const token = await signIn();
  if (!token) {
    return { success: false, message: t('message.alert_google_authentication_fail') };
  }

  // Send these tokens to your backend for verification
  const res = createGoogleCalendarEvent(token, data);
  return res;
}