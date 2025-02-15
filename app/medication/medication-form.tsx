/**
 * Medication Form
 * RTHA
 * 
 * Created by Thornton on 01/28/2025
 */
import React, { useState, useEffect, useContext } from 'react';
import CustomButton from '@/components/CustomButton';
import Animated from 'react-native-reanimated';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import Calendar from '@/components/Calendar';
import ApplicationContext from '@/context/ApplicationContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableHighlight
} from 'react-native';
import { IMedication } from '@/@types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors, DosageUnitType } from '@/config/constants';
import { SelectList } from 'react-native-dropdown-select-list'
import { ThemedView } from '@/components/ThemedView';
import { CalendarIcon, MinusIcon, PlusIcon } from '@/utils/svgs';

type TMedicationFormProps = {
  medication?: IMedication
};

const dosageUnitList = [
  { key: DosageUnitType.PL, value: 'Pill' },
  { key: DosageUnitType.MG, value: 'Milligram' },
  { key: DosageUnitType.ML, value: 'Milliliter' },
];
const hourList = Array.from(new Array(24), (_, index: number) => new String(index) .padStart(2, '0')).map((v, index) => ({ key: index, value: v }));
const cycleList = [
  { key: 1, value: '1 Day', selected: true },
  { key: 2, value: '2 Days' },
  { key: 3, value: '3 Days' },
]
export default function MedicationForm({ medication }: TMedicationFormProps) {
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();
  const { appState } = useContext(ApplicationContext);

  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [timeErrors, setTimeErrors] = useState<string[]>(medication ? Array.from(new Array(medication.frequency.times.length), () => '') : ['']);
  const [name, setName] = useState<string>(medication ? medication.name : '');
  const [dosage, setDosage] = useState<string>(medication ? `${medication.frequency.dosage}` : '');
  const [dosageUnit, setDosageUnit] = useState<string>(medication ? `${medication.frequency.dosageUnit}` : '');
  const [cycle, setCycle] = useState<string>(medication ? `${medication.frequency.cycle}` : '');
  const [times, setTimes] = useState<string[]>(medication ? medication.frequency.times : ['00:00']);
  const [startDate, setStartDate] = useState<string>(medication ? medication.startDate : dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(medication ? medication.endDate : dayjs().format('YYYY-MM-DD'));
  const [stock, setStock] = useState<string>(medication ? `${medication.stock}` : '');
  const [miniStock, setMiniStock] = useState<string>(medication ? `${medication.miniStock}` : '');
  const [calendarPopupOptions, setCalendarPopupOptions] = useState({ opened: false, type: 0 });

  useEffect(() => {
    if (!medication) return;
    
    setName(medication?.name?? '');
    setDosage(medication?.frequency.dosage ? `${medication.frequency.dosage}` : '');
    setDosageUnit(medication?.frequency.dosageUnit ? `${medication.frequency.dosageUnit}` : '');
    setCycle(medication?.frequency.cycle ? `${medication.frequency.cycle}` : '');
    setTimes(medication?.frequency.times ? medication?.frequency.times : ['00:00']);
    setStock(medication?.stock ? `${medication.stock}` : '');
    setStock(medication?.miniStock ? `${medication.miniStock}` : '');
    setStartDate(medication?.startDate?? '');
    setEndDate(medication?.endDate?? '');
    setTimeErrors(medication?.frequency.times ? Array.from(new Array(medication.frequency.times.length), () => '') : ['']);
  }, [medication]);

  const handleFormValueChange = (type: string, value: string): void => {
    
    if (type === 'name') {
      setName(value);  
      if (value.length > 0) {
        const { name, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['name'] = t('message.alert_input_name');
      }

      return;
    }

    if (type === 'dosage') {
      setDosage(value);
      if (value.length > 0) {
        const { dosage, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['dosage'] = t('message.alert_input_dosage');
      }

      return;
    }

    if (type === 'dosageUnit') {
      setDosageUnit(value);
      if (`${value}`.length > 0) {
        const { dosageUnit, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['dosageUnit'] = t('message.alert_select_dosage_unit');
      }

      return;
    }

    if (type === 'cycle') {
      setCycle(value);
      if (`${value}`.length > 0) {
        const { cycle, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['cycle'] = t('message.alert_select_cycle');
      }

      return;
    }

    if (type === 'stock') {
      setStock(value);
      if (value.length > 0) {
        const { stock, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['stock'] = t('message.alert_input_stock');
      }

      return;
    }

    if (type === 'miniStock') {
      setMiniStock(value);
      if (value.length > 0) {
        const { miniStock, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['miniStock'] = t('message.alert_mini_input_stock');
      }

      return;
    }

    if (type === 'startDate') {
      setStartDate(value);
      if (value.length > 0) {
        const { startDate, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['startDate'] = t('message.alert_select_start_date');
      }

      return;
    }

    if (type === 'endDate') {
      setEndDate(value);
      if (value.length > 0) {
        const { endDate, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['endDate'] = t('message.alert_select_end_date');
      }

      return;
    }
  }

  const handleMedicationAdd = (): void => {
    let errors: {[k: string]: string} = {};
    if (name.length === 0) {
      errors['name'] = t('message.alert_input_name');
    }

    if (dosage.length === 0) {
      errors['dosage'] = t('message.alert_input_dosage');
    }

    if (dosageUnit.length === 0) {
      errors['dosageUnit'] = t('message.alert_select_dosage_unit');
    }

    if (cycle.length === 0) {
      errors['cycle'] = t('message.alert_select_cycle');
    }

    if (times.length === 0) {
      errors['times'] = t('message.alert_add_time');
    }

    let tes = Array.from(new Array(times.length), () => '');
    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      const filter = times.filter(v => v === time);
      if (filter.length > 1) {
        tes[i] = t('message.alert_select_unique_time');
      }
    }

    if (miniStock.length === 0) {
      errors['miniStock'] = t('message.alert_mini_input_stock');
    }

    if (stock.length === 0) {
      errors['stock'] = t('message.alert_input_stock');
    }

    if (startDate.length === 0) {
      errors['startDate'] = t('message.alert_select_start_date');
    }

    if (endDate.length === 0) {
      errors['endDate'] = t('message.alert_select_end_date');
    }

    setErrors(errors);
    setTimeErrors(tes);
    if (Object.keys(errors).length > 0) return;
    if (tes.filter(v => v.length > 0).length > 0) return;
  }

  const handleTimeAdd = (): void => {
    setTimes([...times, '00:00']);
    setTimeErrors([...timeErrors, '']);
  }

  const handleTimeRemove = (index: number): void => {
    times.splice(index, 1);
    setTimes([...times]);
  }

  const handleTimeChange = (index: number, hour: string): void => {
    const ts = [...times];
    const tes = [...timeErrors];
    const tt = `${new String(hour).padStart(2, '0')}:00`;
    ts[index] = tt;
    if (ts.filter(v => v === tt).length > 1) {
      tes[index] = t('message.alert_select_unique_time');
    } else {
      tes[index] = '';
    }
    setTimes(ts);
    setTimeErrors(tes);
  }

  const handleCalendarPopupOpstions = (option: {opened: boolean, type: number}): void => {
    setCalendarPopupOptions(option);
  }

  const handleDateSelect = (date: Date): void => {
    if (calendarPopupOptions.type === 1) {
      setStartDate(dayjs(date).format('YYYY-MM-DD'));
    } else if (calendarPopupOptions.type === 2) {
      setEndDate(dayjs(date).format('YYYY-MM-DD'));
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Modal
        isVisible={calendarPopupOptions.opened}
        onBackdropPress={() => handleCalendarPopupOpstions({ opened: false, type: 0 })}
        onBackButtonPress={() => handleCalendarPopupOpstions({ opened: false, type: 0 })}
      >
        <Calendar
          date={calendarPopupOptions.type === 1 ? new Date(startDate) : calendarPopupOptions.type === 2 ? new Date(endDate) : new Date()}
          onSelectedDate={handleDateSelect}
        />
      </Modal>
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
                errors.name ? { borderColor: 'red' } : {}
              ]}
              type="default"
              value={name}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(v) => handleFormValueChange('name', v)}
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
                errors.dosage ? { borderColor: 'red' } : {}
              ]}
              value={dosage}
              keyboardType="number-pad"
              onChangeText={(v) => handleFormValueChange('dosage', v)}
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
            {t('dosage_unit')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <SelectList
              setSelected={(v: string) => handleFormValueChange('dosageUnit', v)}
              data={dosageUnitList}
              save="key"
              placeholder="--Select--"
              defaultOption={dosageUnitList.find(v => v.key === parseInt(dosageUnit, 10))}
              boxStyles={{
                borderColor: errors.dosageUnit ? 'red' : '#e2e2e2',
                paddingHorizontal: 10,
              }}
              inputStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
              }}
              dropdownStyles={{
                borderColor: '#e2e2e2',
              }}
              dropdownTextStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
              }}
            />
            {errors.dosageUnit&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.dosageUnit}
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
            {t('cycle')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <SelectList
              setSelected={(v: string) => handleFormValueChange('cycle', v)}
              data={cycleList}
              save="key"
              placeholder="--Select--"
              defaultOption={cycleList.find(v => v.key === parseInt(cycle, 10))}
              boxStyles={{
                borderColor: errors.cycle ? 'red' : '#e2e2e2',
                paddingHorizontal: 10,
              }}
              inputStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
              }}
              dropdownStyles={{
                borderColor: '#e2e2e2',
              }}
              dropdownTextStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
              }}
            />
            {errors.cycle&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.cycle}
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
            {t('times')}{':'}
          </ThemedText>
          <View style={[styles.formControlWrapper, { rowGap: 5 }]}>
            {times.map((v, index) => 
              <View key={index}>
                <View style={styles.timeWrapper}>
                  <SelectList
                    setSelected={(v: string) => handleTimeChange(index, v)}
                    data={hourList}
                    save="key"
                    placeholder="HH"
                    defaultOption={hourList.find(v => v.key === parseInt(times[index].split(':')[0], 10))}
                    boxStyles={{
                      borderColor: timeErrors[index].length > 0 ? 'red' : '#e2e2e2',
                      paddingHorizontal: 10,
                      width: 70
                    }}
                    inputStyles={{
                      color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
                    }}
                    dropdownStyles={{
                      borderColor: '#e2e2e2',
                      width: 70
                    }}
                    dropdownTextStyles={{
                      color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
                    }}
                  />
                  <ThemedText type="default">:</ThemedText>
                  <View style={styles.secondPlaceholderWrapper}>
                    <ThemedText
                      type="defaultMedium"
                      darkColor={Colors.dark.defaultControlText}
                      lightColor={Colors.light.defaultControlText}
                      style={{ fontWeight: 400 }}
                    >
                      00
                    </ThemedText>
                  </View>
                  {index === times.length - 1&&
                    <TouchableHighlight onPress={() => handleTimeAdd()}>
                      <ThemedView style={styles.iconButtonWrapper}>
                        <PlusIcon color={appState.setting.theme === 'light' ? '#454b60' : '#fff'} />
                      </ThemedView>
                    </TouchableHighlight>
                  }
                  {index < times.length - 1&&
                    <TouchableHighlight onPress={() => handleTimeRemove(index)}>
                      <ThemedView style={styles.iconButtonWrapper}>
                        <MinusIcon color={appState.setting.theme === 'light' ? '#454b60' : '#fff'} />
                      </ThemedView>
                    </TouchableHighlight>
                  }
                </View>
                {timeErrors[index].length > 0&&
                  <ThemedText
                    type="small"
                    darkColor={Colors.dark.redText}
                    lightColor={Colors.light.redText}
                  >
                    {timeErrors[index]}
                  </ThemedText>
                }
              </View>
            )}
            
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
                errors.stock ? { borderColor: 'red' } : {}
              ]}
              value={stock}
              onChangeText={(v) => handleFormValueChange('stock', v)}
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
                errors.miniStock ? { borderColor: 'red' } : {}
              ]}
              value={miniStock}
              onChangeText={(v) => handleFormValueChange('miniStock', v)}
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
            <TouchableHighlight
              style={{ borderRadius: 10 }}
              onPress={() => handleCalendarPopupOpstions({ opened: true, type: 1 })}
            >
              <ThemedView style={styles.dateControl}>
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={{ fontWeight: 400 }}
                >
                  {startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
                </ThemedText>
                <CalendarIcon color={appState.setting.theme === 'light' ? '#494e50' : '#aaa'} />
              </ThemedView>
            </TouchableHighlight>
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
            <TouchableHighlight
              style={{ borderRadius: 10 }}
              onPress={() => handleCalendarPopupOpstions({ opened: true, type: 1 })}
            >
              <ThemedView style={styles.dateControl}>
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={{ fontWeight: 400 }}
                >
                  {endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
                </ThemedText>
                <CalendarIcon color={appState.setting.theme === 'light' ? '#494e50' : '#aaa'} />
              </ThemedView>
            </TouchableHighlight>
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
        <CustomButton onPress={handleMedicationAdd}>
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
  },
  formGroup: {
    flexDirection: 'row',
    columnGap: 15,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  controlLabel: {
    width: 70,
    marginTop: 12
  },
  formControlWrapper: {
    flex: 1,
  },
  actionWrapper: {
    padding: 15
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10
  },
  secondPlaceholderWrapper: {
    backgroundColor: '#eee',
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  iconButtonWrapper: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    fontSize: 16,
    fontWeight: 400,
    height: 45,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 10,
    paddingHorizontal: 10
  },
});