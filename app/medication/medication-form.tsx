/**
 * Medication Form
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import {
  StyleSheet,
  SafeAreaView,
  View
} from 'react-native';
import { IMedication } from '@/@types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';

type TMedicationFormProps = {
  medication?: IMedication
};

export default function MedicationForm({ medication }: TMedicationFormProps) {
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();

  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [name, setName] = useState<string>(medication ? medication.name : '');
  const [dosage, setDosage] = useState<string>(medication ? medication.dosage : '');
  const [frequency, setFrequency] = useState<string>(medication ? medication.frequency : '');
  const [startDate, setStartDate] = useState<string>(medication ? medication.startDate : '');
  const [endDate, setEndDate] = useState<string>(medication ? medication.endDate : '');
  const [stock, setStock] = useState<string>(medication ? `${medication.stock}` : '');
  const [miniStock, setMiniStock] = useState<string>(medication ? `${medication.miniStock}` : '');

  useEffect(() => {
    setName(medication?.name?? '');
    setDosage(medication?.dosage?? '');
    setFrequency(medication?.frequency?? '');
    setStock(medication?.stock ? `${medication.stock}` : '');
    setStock(medication?.miniStock ? `${medication.miniStock}` : '');
    setStartDate(medication?.startDate?? '');
    setEndDate(medication?.endDate?? '');
  }, [medication]);

  const changeFormValue = (type: string, value: string): void => {
    if (type === 'name') {
      setName(value);  
      if (value.length > 0) {
        const { name, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['name'] = 'Invalid name.'
      }

      return;
    }

    if (type === 'dosage') {
      setDosage(value);
      if (value.length > 0) {
        const { dosage, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['dosage'] = 'Invalid dosage.'
      }

      return;
    }

    if (type === 'frequency') {
      setFrequency(value);
      if (value.length > 0) {
        const { frequency, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['frequency'] = 'Invalid frequency.'
      }

      return;
    }

    if (type === 'stock') {
      setStock(value);
      if (value.length > 0) {
        const { stock, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['stock'] = 'Invalid Stock.'
      }

      return;
    }

    if (type === 'miniStock') {
      setMiniStock(value);
      if (value.length > 0) {
        const { miniStock, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['miniStock'] = 'Invalid minimum stock.'
      }

      return;
    }

    if (type === 'startDate') {
      setStartDate(value);
      if (value.length > 0) {
        const { startDate, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['startDate'] = 'Invalid date.'
      }

      return;
    }

    if (type === 'endDate') {
      setEndDate(value);
      if (value.length > 0) {
        const { endDate, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['endDate'] = 'Invalid date.'
      }

      return;
    }
  }

  const handleAddMedication = (): void => {
    let errors: {[k: string]: string} = {};
    if (name.length === 0) {
      errors['name'] = 'Invalid name.'
    }

    if (dosage.length === 0) {
      errors['dosage'] = 'Invalid dosage.';
    }

    if (frequency.length === 0) {
      errors['frequency'] = 'Invalid frequency.';
    }

    if (miniStock.length === 0) {
      errors['miniStock'] = 'Invalid minimum stock.';
    }

    if (stock.length === 0) {
      errors['stock'] = 'Invalid stock.';
    }

    if (startDate.length === 0) {
      errors['startDate'] = 'Invalid date.';
    }

    if (endDate.length === 0) {
      errors['endDate'] = 'Invalid date.';
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Animated.ScrollView>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('name')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              style={[
                styles.formControl,
                errors.name ? { borderColor: 'red' } : {}
              ]}
              type="default"
              value={name}
              onChangeText={(v) => changeFormValue('name', v)}
            />
            {errors.name&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.name}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('dosage')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.dosage ? { borderColor: 'red' } : {}
              ]}
              value={dosage}
              onChangeText={(v) => changeFormValue('dosage', v)}
            />
            {errors.dosage&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.dosage}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('frequency')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.frequency ? { borderColor: 'red' } : {}
              ]}
              value={frequency}
              onChangeText={(v) => changeFormValue('frequency', v)}
            />
            {errors.frequency&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.frequency}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('stock')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.stock ? { borderColor: 'red' } : {}
              ]}
              value={stock}
              onChangeText={(v) => changeFormValue('stock', v)}
            />
            {errors.stock&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.stock}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('stock_limitation')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.miniStock ? { borderColor: 'red' } : {}
              ]}
              value={miniStock}
              onChangeText={(v) => changeFormValue('miniStock', v)}
            />
            {errors.miniStock&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.miniStock}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('start_date')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.startDate ? { borderColor: 'red' } : {}
              ]}
              value={startDate}
              onChangeText={(v) => changeFormValue('startDate', v)}
            />
            {errors.startDate&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.startDate}
              </ThemedText>
            }
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('end_date')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                styles.formControl,
                errors.endDate ? { borderColor: 'red' } : {}
              ]}
              value={endDate}
              onChangeText={(v) => changeFormValue('endDate', v)}
            />
            {errors.endDate&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.endDate}
              </ThemedText>
            }
          </View>
        </View>
      </Animated.ScrollView>
      <View style={styles.actionWrapper}>
        <CustomButton onPress={handleAddMedication}>
          <ThemedText
            type="button"
            darkColor={Colors.dark.defaultButtonText}
            lightColor={Colors.light.defaultButtonText}
          >
            {t('save')}
          </ThemedText>
        </CustomButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  formGroup: {
    flexDirection: 'row',
    columnGap: 15,
    marginTop: 10
  },
  controlLabel: {
    width: 70,
    marginTop: 12
  },
  formControlWrapper: {
    flex: 1,
  },
  formControl: {
    flex: 1,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    borderRadius: 5,
  },
  actionWrapper: {
    paddingTop: 15,
    paddingBottom: 5
  },
});