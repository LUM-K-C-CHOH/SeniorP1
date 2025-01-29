import React, { useState, useEffect, useRef } from 'react';

import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Animated from 'react-native-reanimated';

import { getMedicationList } from '@/services/medication';
import { IMedication, TResponse } from '@/@types';
import { BellIcon, FlyIcon, PillIcon, SettingIcon, StockIcon } from '@/utils/assets';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const initialRef = useRef<boolean>();
  
  const { t } = useTranslation();

  const [medicationList, setMedicationList] = useState<IMedication[]>([]);

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;
    getMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      });
  }, []);

  const getColorByLevel = (stock: number): string => {
    if (stock > 15) {
      return '#34C759';
    } else if (stock > 5) {
      return '#FF9500';
    } else {
      return 'red';
    }
  }

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ThemedView style={styles.listHeader}>
        <ThemedText
          style={[
            styles.listHeaderText,
            { width: '20%' }
          ]}
        >
          {t('medication_manage.item')}
        </ThemedText>
        <ThemedText
          style={[
            styles.listHeaderText,
            { width: '40%' }
          ]}
        >
          {t('medication_manage.description')}
        </ThemedText>
        <ThemedText
          style={[
            styles.listHeaderText,
            { width: '40%' }
          ]}
        >
          {t('medication_manage.refill_reminder')}
        </ThemedText>
      </ThemedView>
      <Animated.ScrollView style={styles.mainWrapper}>
        {medicationList.map((medication: IMedication, index: number) => 
          <ThemedView key={index} style={styles.itemWrapper}>
            <Image source={{ uri: medication.image }} width={60} height={60}/>
            <ThemedView style={styles.infoWrapper}>
              <ThemedView style={{ flexGrow: 1 }}>
                <ThemedText style={styles.itemTitle}>{medication.name}</ThemedText>
                <ThemedView style={styles.itemTextWrapper}>
                  <PillIcon />
                  <ThemedText style={styles.normalText}>{medication.dosage}</ThemedText>
                  <ThemedText>{'•'}</ThemedText>
                  <ThemedText style={styles.normalText}>{medication.frequency}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.itemTextWrapper}>
                  <StockIcon color={getColorByLevel(medication.stock)} />
                  <ThemedText
                    style={[
                      styles.normalText,
                      {
                        color: getColorByLevel(medication.stock)
                      }
                    ]}
                  >
                    {`${medication.stock} Tablets`}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={{ rowGap: 5 }}>
                <ThemedView style={{ flexDirection: 'row', columnGap: 5 }}>
                  <BellIcon />
                  <FlyIcon />
                </ThemedView>
                <ThemedView>
                  <TouchableOpacity onPress={() => {}}>
                    <SettingIcon />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  listHeader: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  listHeaderText: {
    textAlign: 'center',
    fontSize: 14
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    columnGap: 10,
  },
  infoWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#777',    
  },
  itemTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#000',
    columnGap: 5,
  },
  normalText: {
    fontSize: 14,
    fontWeight: 400,
  }
});
