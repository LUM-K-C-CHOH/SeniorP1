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
  TouchableHighlight,
  Switch
} from 'react-native';
import { IMedication } from '@/@types';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors, DosageUnitType, MedicationCycleType } from '@/config/constants';
import { SelectList } from 'react-native-dropdown-select-list'
import { ThemedView } from '@/components/ThemedView';
import { CalendarIcon, CloseIcon, MinusIcon, PlusIcon, SearchIcon } from '@/utils/svgs';
import { addMedication, updateMedication } from '@/services/medication';
import { showToast } from '@/utils';
import { useRouter } from 'expo-router';

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
  { key: MedicationCycleType.EVERYDAY, value: '1 Day', selected: true },
  { key: MedicationCycleType.TWODAYS, value: '2 Days' },
  { key: MedicationCycleType.THREEDAYS, value: '3 Days' },
]
export default function MedicationForm({ medication }: TMedicationFormProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const router = useRouter();

  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [timeErrors, setTimeErrors] = useState<string[]>(medication ? Array.from(new Array(medication.frequency.times.length), () => '') : ['']);
  const [name, setName] = useState<string>(medication ? medication.name : '');
  const [dosage, setDosage] = useState<string>(medication ? `${medication.frequency.dosage}` : '');
  const [dosageUnit, setDosageUnit] = useState<string>(medication ? `${medication.frequency.dosageUnit}` : '');
  const [cycle, setCycle] = useState<string>(medication ? `${medication.frequency.cycle}` : '');
  const [medicationId, setMedicationId] = useState<string>(medication ? `${medication.frequency.medicationId}` : '');
  const [times, setTimes] = useState<string[]>(medication ? medication.frequency.times : ['00:00']);
  const [startDate, setStartDate] = useState<string>(medication ? medication.startDate : dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(medication ? medication.endDate : dayjs().format('YYYY-MM-DD'));
  const [stock, setStock] = useState<string>(medication ? `${medication.stock}` : '');
  const [threshold, setThreshold] = useState<string>(medication ? `${medication.threshold}` : '');
  const [emailAlert, setEmailAlert] = useState<string>(medication ? medication.emailAlert : 'on');
  const [pushAlert, setPushAlert] = useState<string>(medication ? medication.pushAlert : 'on');
  const [calendarPopupOptions, setCalendarPopupOptions] = useState({ opened: false, type: 0 });
  useEffect(() => {
    if (!medication) return;
    
    setName(medication?.name?? '');
    setDosage(medication?.frequency.dosage ? `${medication.frequency.dosage}` : '');
    setDosageUnit(medication?.frequency.dosageUnit ? `${medication.frequency.dosageUnit}` : '');
    setCycle(medication?.frequency.cycle ? `${medication.frequency.cycle}` : '');
    setMedicationId(medication?.frequency.medicationId ? `${medication.frequency.medicationId}` : '');
    setTimes(medication?.frequency.times ? medication?.frequency.times : ['00:00']);
    setStock(medication?.stock ? `${medication.stock}` : '');
    setThreshold(medication?.threshold ? `${medication.threshold}` : '');
    setEmailAlert(medication?.emailAlert ? medication.emailAlert : '');
    setPushAlert(medication?.pushAlert ? medication.pushAlert : '');
    setStartDate((medication?.startDate && medication.startDate.length > 0) ? medication.startDate : dayjs().format('YYYY-MM-DD'));
    setEndDate((medication?.endDate && medication.endDate.length > 0) ? medication.endDate : dayjs().format('YYYY-MM-DD'));
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
        setErrors({ ...errors });
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
        setErrors({ ...errors });
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
        setErrors({ ...errors });
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
        setErrors({ ...errors });
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
        setErrors({ ...errors });
      }

      return;
    }

    if (type === 'threshold') {
      setThreshold(value);
      if (value.length > 0) {
        const { threshold, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['threshold'] = t('message.alert_input_threshold');
        setErrors({ ...errors });
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
        setErrors({ ...errors });
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
        setErrors({ ...errors });
      }

      return;
    }
  }

  const handleMedicationAdd = async (): Promise<void> => {
    if (appState.lockScreen) return;
    
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

    if (threshold.length === 0) {
      errors['threshold'] = t('message.alert_input_threshold');
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

    let data: IMedication = {
      name: name,
      stock: parseInt(stock, 10),
      threshold: parseInt(threshold, 10),
      pushAlert: pushAlert,
      emailAlert: emailAlert,
      startDate: startDate,
      endDate: endDate,
      image: '',
      frequency: {
        medicationId: parseInt(medicationId, 10),
        dosage: parseInt(dosage, 10),
        dosageUnit: parseInt(dosageUnit, 10),
        cycle: parseInt(cycle, 10),
        times: times
      }
    }
    
    setAppState({ ...appState, lockScreen: true });

    if (medication) {
      // update
      data.id = medication.id;
      data.frequency.id = medication.frequency.id;
      const ret = await updateMedication(data, appState.user?.id);
      if (ret) {
        router.back();
        showToast(t('message.alert_save_success'));
      } else {
        showToast(t('message.alert_save_fail'));
      }
    } else {
      const ret = await addMedication(data, appState.user?.id);
      if (ret) {
        router.back();
        showToast(t('message.alert_save_success'));
      } else {
        showToast(t('message.alert_save_fail'));
      }
    }

    setAppState({ ...appState, lockScreen: false });
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
              searchPlaceholder=""
              searchicon={<SearchIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
              closeicon={<CloseIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
              defaultOption={dosageUnitList.find(v => v.key === parseInt(dosageUnit, 10))}
              boxStyles={{
                borderColor: errors.dosageUnit ? 'red' : appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                paddingHorizontal: 10,
              }}
              inputStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText,
              }}
              dropdownStyles={{
                borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
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
              searchPlaceholder=""
              searchicon={<SearchIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
              closeicon={<CloseIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
              defaultOption={cycleList.find(v => v.key === parseInt(cycle, 10))}
              boxStyles={{
                borderColor: errors.cycle ? 'red' : appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                paddingHorizontal: 10,
              }}
              inputStyles={{
                color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
              }}
              dropdownStyles={{
                borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
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
                    searchPlaceholder=""
                    searchicon={<SearchIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
                    closeicon={<CloseIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
                    defaultOption={hourList.find(v => v.key === parseInt(times[index].split(':')[0], 10))}
                    boxStyles={{
                      borderColor: timeErrors[index].length > 0 ? 'red' : appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                      paddingHorizontal: 10,
                      width: 70
                    }}
                    inputStyles={{
                      color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
                    }}
                    dropdownStyles={{
                      borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                      width: 70
                    }}
                    dropdownTextStyles={{
                      color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
                    }}
                  />
                  <ThemedText type="default">:</ThemedText>
                  <View
                    style={[
                      styles.secondPlaceholderWrapper,
                      {
                        backgroundColor: appState.setting.theme === 'light' ? '#eee' : '#666',
                      }
                    ]}
                  >
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
            {t('threshold')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <ThemedInput
              type="default"
              style={[
                errors.threshold ? { borderColor: 'red' } : {}
              ]}
              value={threshold}
              onChangeText={(v) => handleFormValueChange('threshold', v)}
            />
            {errors.threshold&&
              <ThemedText
                type="small"
                darkColor={Colors.dark.redText}
                lightColor={Colors.light.redText}
              >
                {errors.threshold}
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
            {t('push_notification')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <Switch
              trackColor={{ false: '#eee', true: '#0066ff' }}
              ios_backgroundColor={'#0066ff'}
              thumbColor={pushAlert === 'on' ? '#fff' : '#999'}
              value={pushAlert === 'on'}
              onValueChange={(v) => setPushAlert(v ? 'on' : 'off')}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
            style={styles.controlLabel}
          >
            {t('email_alert')}{':'}
          </ThemedText>
          <View style={styles.formControlWrapper}>
            <Switch
              trackColor={{ false: '#eee', true: '#0066ff' }}
              ios_backgroundColor={'#0066ff'}
              thumbColor={emailAlert === 'on' ? '#fff' : '#999'}
              value={emailAlert === 'on'}
              onValueChange={(v) => setEmailAlert(v ? 'on' : 'off')}
            />
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
              <ThemedView
                style={[
                  styles.dateControl,
                  {
                    borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                  }
                ]}
              >
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={{ fontWeight: 400 }}
                >
                  {startDate}
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
              onPress={() => handleCalendarPopupOpstions({ opened: true, type: 2 })}
            >
              <ThemedView
                style={[
                  styles.dateControl,
                  {
                    borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                  }
                ]}
              >
                <ThemedText
                  type="defaultMedium"
                  darkColor={Colors.dark.defaultControlText}
                  lightColor={Colors.light.defaultControlText}
                  style={{ fontWeight: 400 }}
                >
                  {endDate}
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
    width: 120,
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
    borderRadius: 10,
    paddingHorizontal: 10
  },
});