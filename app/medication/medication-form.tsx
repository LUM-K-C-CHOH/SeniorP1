import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Text
} from 'react-native';
import { IMedication } from '@/@types';

type TMedicationFormProps = {
  medication?: IMedication
};

export default function MedicationForm({ medication }: TMedicationFormProps) {
  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [name, setName] = useState<string>(medication ? medication.name : '');
  const [dosage, setDosage] = useState<string>(medication ? medication.dosage : '');
  const [frequency, setFrequency] = useState<string>(medication ? medication.frequency : '');
  const [startDate, setStartDate] = useState<string>(medication ? medication.startDate : '');
  const [endDate, setEndDate] = useState<string>(medication ? medication.endDate : '');

  useEffect(() => {
    setName(medication?.name?? '');
    setDosage(medication?.dosage?? '');
    setFrequency(medication?.frequency?? '');
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

  const  handleAddMedication = (): void => {
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
    <SafeAreaView style={styles.form}>
      <ThemedView style={styles.formGroup}>
        <ThemedText style={styles.controlLabel}>Name:</ThemedText>
        <ThemedView style={styles.formControlWrapper}>
          <TextInput
            style={[
              styles.formControl,
              errors.name ? { borderColor: 'red' } : {}
            ]}
            value={name}
            onChangeText={(v) => changeFormValue('name', v)}
          />
          {errors.name&&
            <ThemedText style={styles.error}>{errors.name}</ThemedText>
          }
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText style={styles.controlLabel}>Dosage:</ThemedText>
        <ThemedView style={styles.formControlWrapper}>
          <TextInput
            style={[
              styles.formControl,
              errors.dosage ? { borderColor: 'red' } : {}
            ]}
            value={dosage}
            onChangeText={(v) => changeFormValue('dosage', v)}
          />
          {errors.dosage&&
            <ThemedText style={styles.error}>{errors.dosage}</ThemedText>
          }
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText style={styles.controlLabel}>Frequency:</ThemedText>
        <ThemedView style={styles.formControlWrapper}>
          <TextInput
            style={[
              styles.formControl,
              errors.frequency ? { borderColor: 'red' } : {}
            ]}
            value={frequency}
            onChangeText={(v) => changeFormValue('frequency', v)}
          />
          {errors.frequency&&
            <ThemedText style={styles.error}>{errors.frequency}</ThemedText>
          }
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText style={styles.controlLabel}>Start Date:</ThemedText>
        <ThemedView style={styles.formControlWrapper}>
          <TextInput
            style={[
              styles.formControl,
              errors.startDate ? { borderColor: 'red' } : {}
            ]}
            value={startDate}
            onChangeText={(v) => changeFormValue('startDate', v)}
          />
          {errors.startDate&&
            <ThemedText style={styles.error}>{errors.startDate}</ThemedText>
          }
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText style={styles.controlLabel}>End Date:</ThemedText>
        <ThemedView style={styles.formControlWrapper}>
          <TextInput
            style={[
              styles.formControl,
              errors.endDate ? { borderColor: 'red' } : {}
            ]}
            value={endDate}
            onChangeText={(v) => changeFormValue('endDate', v)}
          />
          {errors.endDate&&
            <ThemedText style={styles.error}>{errors.endDate}</ThemedText>
          }
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.action}>
        <CustomButton onPress={handleAddMedication}>
          <Text style={styles.addMedicationButtonText}>Save</Text>
        </CustomButton>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  form: {
    rowGap: 10,
    marginTop: 20
  },
  formGroup: {
    flexDirection: 'row',
    columnGap: 15
  },
  controlLabel: {
    width: 70,
    fontWeight: 400,
    fontSize: 14,
    color: '#666',
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
    fontWeight: 400,
    fontSize: 16,
  },
  action: {
    marginTop: 30
  },
  addMedicationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
  },
  error: {
    color: 'red',
    fontSize: 12,
    fontWeight: 400
  }
});