/**
 * Calendar Component
 * RTHA
 * 
 * Created by Thornton on 02/07/2025
 */
import React, { useEffect, useState, useReducer } from 'react';

import {
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';
import { ThemedView } from './ThemedView';
import { LeftArrowIcon, RightArrowIcon } from '@/utils/svgs';
import { ThemedText } from './ThemedText';

type TCalendarProps = {
  date?: Date,
  onSelectedDate: (date: Date) => void
};

type TDay = { day: number, status: boolean };
type TData = TDay |number;
type TAction = | { type: 'add_week', data: TData[] } | { type: 'init_days' };
type TState = {
  days: TData[][]
};

const reducer = (state: TState, action: TAction): TState => {
  if (action.type == 'add_week') {
    return { days: [...state.days, action.data] }
  }
  else if (action.type == 'init_days') {
    return { days: [] }
  }
  else {
    return state
  }
}

const ViewMode = {
  Day: 1,
  Month: 2,
  Year: 3
}
const Calendar = ({ date, onSelectedDate }: TCalendarProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(date);

  const MonthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MonthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DayFullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DayMiddleNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DayShortNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const [viewMode, setViewMode] = useState<number>(ViewMode.Day);
  const [state, dispatch] = useReducer(reducer, { days: []});
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0)

  useEffect(() => {
    init()
  }, [selectedDate]);

  const init = (): void => {
    if (!selectedDate || (!(selectedDate instanceof Date))) {
      const date = new Date();
      let y = date.getFullYear(),
        m= date.getMonth();
      
      makeCalendar(y, m);
      return;
    }

    let y = selectedDate?.getFullYear(),
        m= selectedDate?.getMonth(),
        d = selectedDate?.getDate();

    makeCalendar(y, m);
  }

  const nextMonth = (): void => {
    let y = year, m = month;
    if (m == 11) {
      y++;
      m = 0;
    }
    else {
      m++;
    }
    makeCalendar(y, m);
  }

  const prevMonth = (): void => {
    let y = year, m = month;
    if (m == 0) {
      y--;
      m = 11;
    }
    else {
      m--;
    }
    makeCalendar(y, m);
  }

  const makeCalendar = (year: number, month: number): void => {
    dispatch({ type: 'init_days' });

    let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let startingDayIndexOfMonth = new Date(year, month, 1).getDay();

    setYear(year);
    setMonth(month);
   
    let dayIndexOfMonth = startingDayIndexOfMonth;
    let weekData: TDay[]|number[] = [];
    let weekIndexOfMonth = 0;
    for (let i = 1; i <= lastDayOfMonth; i++) {
      let dayIndexOfWeek = dayIndexOfMonth % 7;

      if (i === 1 || dayIndexOfWeek === 0)
        weekData = Array.from(new Array(7), () => 0);

      if (startingDayIndexOfMonth > 1 && i == 1) {
        let lastDayOfLastM = new Date(year, month, 0).getDate();

        for (let j = startingDayIndexOfMonth - 1; j >= 0; j--)
        {
          weekData[j % 7] = { day: lastDayOfLastM - (startingDayIndexOfMonth - 1 - j), status: false };
        }
      }

      weekData[dayIndexOfWeek] = { day: i, status: true };

      if (i == lastDayOfMonth) {
        if (dayIndexOfWeek < 6) {
          for (let j = dayIndexOfWeek + 1; j <= 6; j++) {
            weekData[j] = { day: 1 + (j - dayIndexOfWeek - 1), status: false };
          }
        }

        dispatch({type: 'add_week', data: weekData});
      }
      else if (dayIndexOfWeek == 6) {
        dispatch({type: 'add_week', data: weekData});
        weekIndexOfMonth++;
      }

      dayIndexOfMonth++;
    }
  }

  const isSelectedDay = (day: TDay): boolean => {
    if (!day.status)
      return false;

    if (!selectedDate || (!(selectedDate instanceof Date))) return false;

    let y = selectedDate.getFullYear(),
        m= selectedDate.getMonth(),
        d = selectedDate.getDate();

    if (year === y && month === m && day.day === d)
      return true;

    return false;
  }

  const isToday = (day: TDay): boolean => {
    if (!day.status)
      return false;

    const date = new Date();
    let y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    
    if (year === y && month === m && day.day === d)
      return true;
    return false;
  }

  const handleDaySelect = (day: TDay): void => {
    if (!day.status) return;

    const date = new Date(year, month, day.day);
    setSelectedDate(date);
    onSelectedDate(date);
  }

  const handleViewModeChange = (mode: number): void => {
    if (viewMode === mode) {
      setViewMode(ViewMode.Day);
      return;
    }

    setViewMode(mode);
  }

  const handleMonthSelect = (m: number): void => {
    if (m === month) {
      return;
    }

    makeCalendar(year, m);
  }

  const handleYearSelect = (y: number): void => {
    if (y === year) {
      return;
    }

    makeCalendar(y, month);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.controlBar}>
        <TouchableHighlight style={{ width: 30, height: 30 }} onPress={prevMonth}>
          <ThemedView style={styles.navButton}>
            <LeftArrowIcon />
          </ThemedView>
        </TouchableHighlight>
        <ThemedView style={styles.yymmWrapper}>
          <TouchableHighlight onPress={() => handleViewModeChange(ViewMode.Month)}>
            <ThemedView style={styles.mmButtonWrapper}>
              <ThemedText style={styles.navbarLabelText}>{MonthFullNames[month]}</ThemedText>
            </ThemedView>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => handleViewModeChange(ViewMode.Year)}>
            <ThemedView style={styles.yyButtonWrapper}>
              <ThemedText style={styles.navbarLabelText}>{year}</ThemedText>
            </ThemedView>
          </TouchableHighlight>
        </ThemedView>
        <TouchableHighlight style={{ width: 30, height: 30 }} onPress={nextMonth}>
          <ThemedView style={styles.navButton}>
            <RightArrowIcon />
          </ThemedView>
        </TouchableHighlight>
      </ThemedView>
      {viewMode === ViewMode.Year&&
        <ThemedView style={styles.yearWrapper}>
          {Array.from(new Array(20), (_, index) => year - 5 + index).map((v: number, index: number) =>
            <TouchableHighlight key={index} onPress={() => handleYearSelect(v)}>
              <ThemedView style={styles.yearTextWrapper}>
                <ThemedText
                  style={[styles.yearText, year === v&& styles.selectedYearText]}
                >
                  {v}
                </ThemedText>
              </ThemedView>
            </TouchableHighlight>
          )}
        </ThemedView>
      }
      {viewMode === ViewMode.Month&&
        <ThemedView style={styles.monthWrapper}>
          {MonthFullNames.map((v: string, index: number) =>
            <TouchableHighlight key={index} onPress={() => handleMonthSelect(index)}>
              <ThemedView style={styles.monthTextWrapper}>
                <ThemedText
                  style={[styles.monthText, month === index&& styles.selectedMonthText]}
                >
                  {v}
                </ThemedText>
              </ThemedView>
            </TouchableHighlight>
          )}
        </ThemedView>
      }
      {viewMode === ViewMode.Day&&
        <>
          <ThemedView style={styles.labelBar}>
            {DayShortNames.map((v: string, index: number) =>
              <ThemedText style={styles.dayLabelText} key={index}>{v}</ThemedText>
            )}
          </ThemedView>
          <ThemedView>
            {state.days.map((week, index1) =>
              <ThemedView key={index1} style={styles.weekWrapper}>
                {week.map((day: TData, index2: number) =>
                  (day as TDay).status
                    ? <TouchableHighlight
                        key={index1 * 10 + index2}
                        style={{ flex: 1, height: 40, borderRadius: 5 }}
                        onPress={() => handleDaySelect(day as TDay)}
                      >
                        <ThemedView
                          style={[
                            styles.dayTextWrapper,
                            isSelectedDay(day as TDay)&& styles.selectedDayTextWrapper
                          ]}
                        >
                          <ThemedText                  
                            style={[
                              styles.dayText,
                              !(day as TDay).status&& styles.inactiveDayText,
                              isToday(day as TDay)&& styles.todayText,
                              isSelectedDay(day as TDay)&& styles.selectedDayText
                            ]}
                          >
                            {(day as TDay).day}
                          </ThemedText>
                          {isToday(day as TDay)&& <View style={styles.circle} />}
                        </ThemedView>
                      </TouchableHighlight>
                    : <ThemedView style={styles.dayTextWrapper}>
                        <ThemedText                  
                          style={[
                            styles.dayText,
                            !(day as TDay).status&& styles.inactiveDayText,
                            isToday(day as TDay)&& styles.todayText,
                            isSelectedDay(day as TDay)&& styles.selectedDayText
                          ]}
                        >
                          {(day as TDay).day}
                        </ThemedText>
                        {isToday(day as TDay)&& <View style={styles.circle} />}
                      </ThemedView>
                )}
              </ThemedView>
            )}
          </ThemedView>
        </>
      }      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 355,
    maxWidth: 355,
    minWidth: 355,
    borderRadius: 20,
    alignSelf: 'center'
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
    alignItems: 'center',
  },
  navButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  yymmWrapper: {
    flexDirection: 'row',
    columnGap: 10
  },
  yyButtonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  mmButtonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  navbarLabelText: {
    fontSize: 14,
    color: '#494E50',
    fontWeight: 500
  },
  labelBar: {
    backgroundColor: '#f5f7fa',
    flexDirection: 'row',
    paddingVertical: 8
  },
  dayLabelText: {
    fontSize: 14,
    fontWeight: 400,
    flex: 1,
    textAlign: 'center',
    color: '#424242'
  },
  monthWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 5,
    rowGap: 5,
    padding: 15
  },
  monthTextWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
  },
  selectedMonthText: {
    color: '#fff',
    backgroundColor: '#2196f3'
  },
  yearWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 5,
    rowGap: 5,
    padding: 15
  },
  yearTextWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  yearText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#222',
  },
  selectedYearText: {
    color: '#fff',
    backgroundColor: '#2196f3'
  },
  weekWrapper: {
    flexDirection: 'row',
  },
  dayTextWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {    
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 400,
  },
  inactiveDayText: {
    color: '#999'
  },
  todayText: {
    color: '#2196f3',
  },
  selectedDayTextWrapper: {
    backgroundColor: '#2196f3',
    borderRadius: 5
  },
  selectedDayText: {
    color: '#fff',
  },
  circle: {
    position: 'absolute',
    bottom: 3,
    backgroundColor: '#2196f3',
    width: 4,
    height: 4,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 1
  }
});

export default Calendar;