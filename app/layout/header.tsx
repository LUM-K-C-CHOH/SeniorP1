/**
 * Header Layout for Screens without Tab
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useState, useContext, useEffect } from 'react';
import ApplicationContext from '@/context/ApplicationContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Modal, Pressable, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { generateBoxShadowStyle } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'expo-router';
import {
  ThreeDotIcon,
  LogoutIcon,
  KeyIcon,
  BackIcon
} from '@/utils/svgs';

export default function Header() {
  const router = useRouter();
  const path = usePathname();

  const { t } = useTranslation();
  const { logout } = useContext(ApplicationContext);
  
  const [isBackable, setIsBackable] = useState(router.canGoBack());
  const [popupMenuVisible, setPopupMenuVisible] = useState<boolean>(false);
  
  const menuList = [
    {
      id: 'manage_password',
      icon: <KeyIcon width={20} height={20} />,
      label: t('manage_password')
    },
    {
      id: 'logout',
      icon: <LogoutIcon width={20} height={20} />,
      label: t('logout')
    },
    
  ];

  useEffect(() => {
    setIsBackable(router.canGoBack())
  }, [path]);

  const getTitle = (): string => {
    const titles: {[k: string]: string} = {
      '/': t('home'),
      '/medication': t('medication_management'),
      '/appointment': t('appointment'),
      '/notification': t('notification'),
      '/emergency': t('emergency_alert'),
      '/emergency/contact': t('emergency_control.emergency_contact'),
      '/medication/add': t('medication_manage.add_medication'),
      '/medication/edit': t('medication_manage.edit_medication'),
      '/appointment/add': t('appointment_manage.add_appointment'),
      '/appointment/edit': t('appointment_manage.edit_appointment')
    }

    return titles[path]?? '';
  }

  const handlePopupMenuItemTap = (menuId: string) => {
    setPopupMenuVisible(false);

    if (menuId === 'logout') {
      logout();
      router.replace('/auth/sign-in');
    }
  }

  return (
    <ThemedView
      style={[
        styles.headerWrapper
      ]}
    >
      <View style={{ marginLeft: 10, width: 36 }}>
        {isBackable&&
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
        }
      </View>
      <ThemedText style={styles.headerTitle}>{getTitle()}</ThemedText>
      <View style={{ marginRight: 10, position: 'relative' }}>
        <TouchableOpacity onPress={() => setPopupMenuVisible(!popupMenuVisible)}>
          <ThreeDotIcon color="#666" />
        </TouchableOpacity>
        <Modal
          style={{ position: 'absolute' }}
          transparent={true}
          visible={popupMenuVisible}
          onRequestClose={() => setPopupMenuVisible(false)}
        >
          <Pressable
            style={styles.popupMenuOverlay}
            onPress={() => setPopupMenuVisible(false)}
          />
          <View
            style={[
              styles.popupMenuContainer,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            {menuList.map((v, index) =>
              <TouchableHighlight key={index} onPress={() => handlePopupMenuItemTap(v.id)}>
                <ThemedView style={styles.popupMenuItem}>
                  {v.icon}
                  <ThemedText>{v.label}</ThemedText>
                </ThemedView>
              </TouchableHighlight>
            )}
          </View>
        </Modal>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    paddingTop: 30,
    paddingBottom: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
  },
  popupMenuOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  popupMenuContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#fff',
  },
  popupMenuItem: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  }
});
