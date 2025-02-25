/**
 * Mock Data
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import axios from 'axios';

import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './instance';
import { NotificationType, DosageUnitType } from '@/config/constants';
import dayjs from 'dayjs';

const mock = new MockAdapter(axiosInstance);

const frequencyData = [
  {
    id: 1,
    medicationId: 1,
    dosage: 1,
    dosageUnit: DosageUnitType.PL,
    cycle: 1,
    times: ['09:00']
  },
  {
    id: 2,
    medicationId: 2,
    dosage: 5,
    dosageUnit: DosageUnitType.ML,
    cycle: 1,
    times: ['09:00', '21:00']
  },
  {
    id: 3,
    medicationId: 3,
    dosage: 10,
    dosageUnit: DosageUnitType.ML,
    cycle: 1,
    times: ['06:00', '14:00', '22:00']
  },
  {
    id: 4,
    medicationId: 4,
    dosage: 500,
    dosageUnit: DosageUnitType.ML,
    cycle: 2,
    times: ['06:00']
  },
  {
    id: 5,
    medicationId: 5,
    dosage: 500,
    dosageUnit: DosageUnitType.ML,
    cycle: 2,
    times: ['06:00']
  },
  {
    id: 6,
    medicationId: 6,
    dosage: 10,
    dosageUnit: DosageUnitType.ML,
    cycle: 1,
    times: ['06:00', '14:00', '22:00']
  },
  {
    id: 7,
    medicationId: 7,
    dosage: 1,
    dosageUnit: DosageUnitType.PL,
    cycle: 1,
    times: ['09:00']
  },
  {
    id: 8,
    medicationId: 8,
    dosage: 10,
    dosageUnit: DosageUnitType.ML,
    cycle: 1,
    times: ['06:00', '14:00', '22:00']
  },
  {
    id: 9,
    medicationId: 9,
    dosage: 5,
    dosageUnit: DosageUnitType.ML,
    cycle: 1,
    times: ['09:00', '21:00']
  },
  {
    id: 10,
    medicationId: 10,
    dosage: 1,
    dosageUnit: DosageUnitType.PL,
    cycle: 1,
    times: ['09:00']
  }
];
const medicationData = [
  {
    id: 1,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/first_aid_dual_head_stethoscope_2_170x170_crop_top.png?v=1552665562',
    name: 'Aspirin',
    stock: 32,
    threshold: 10,
    notifications: 0,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 2,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/drive_medical_clinical_care_geri_chair_recliner_2_170x170_crop_top.png?v=1552665466',
    name: 'Metoprolol',
    stock: 16,
    threshold: 10,
    notifications: 1,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 3,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/drive_medical_deluxe_folding_exercise_peddler_with_electronic_display_2_170x170_crop_top.png?v=1552665478',
    name: 'Lisinoprill',
    stock: 4,
    threshold: 10,
    notifications: 1,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 4,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-5_370x370_crop_center.png?v=1613531679',
    name: 'Amoxicilin',
    stock: 14,
    threshold: 10,
    notifications: 0,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 5,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-4_370x370_crop_center.png?v=1613531679',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    threshold: 10,
    notifications: 0,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 6,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-6_370x370_crop_center.png?v=1613531679',
    name: 'Aspirin',
    dosage: '100mg',
    stock: 32,
    threshold: 10,
    notifications: 4,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 7,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/polar_ft4_heart_rate_monitor_1_170x170_crop_top.png?v=1552665646',
    name: 'Metoprolol',
    dosage: '5mg',
    stock: 16,
    threshold: 10,
    notifications: 0,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 8,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/collections/gowise_usa_advanced_control_digital_blood_pressure_monitor_4_270x255_crop_top.png?v=1552667445',
    name: 'Lisinoprill',
    dosage: '50mg',
    stock: 4,
    threshold: 10,
    notifications: 0,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 9,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/polar_h7_bluetooth_smart_heart_rate_sensor_1_170x170_crop_top.png?v=1552665655',
    name: 'Amoxicilin',
    dosage: '500mg',
    stock: 14,
    threshold: 10,
    notifications: 2,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  },
  {
    id: 10,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/gowise_usa_advanced_control_digital_blood_pressure_monitor_2_170x170_crop_top.png?v=1552665575',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    threshold: 10,
    notifications: 1,
    startDate: '2025-02-19',
    endDate: '',
    pushAlert: 'on',
    emailAlert: 'on'
  }
];

const appointmentData = [
  {
    id: 1,
    name: 'Gabi Emilson',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-01-24 14:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 2,
    name: 'Malcom Stewart',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-01-26 16:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 3,
    name: 'Jhon Smith',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-02 16:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 4,
    name: 'Robert Wilson',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-04 15:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 5,
    name: 'David Anderson',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-04 16:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 6,
    name: 'Joseph Martin',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-05 15:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 7,
    name: 'William Thomas',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-05 17:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 8,
    name: 'Jacob Harris',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-06 14:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 9,
    name: 'Liam Lopez',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-06 16:30:00',
    location: '',
    description: 'Consulting on health...',
  },
  {
    id: 10,
    name: 'Daniel Allen',
    phone: '+1(123) 456 7890',
    image: '',
    scheduledTime: '2025-02-07 15:30:00',
    location: '',
    description: 'Consulting on health...',
  },
];

const contactData = [
  {
    id: 1,
    name: 'Gabi Emilson',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 2,
    name: 'Malcom Stewart',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 3,
    name: 'Jhon Smith',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 4,
    name: 'Robert Wilson',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 5,
    name: 'David Anderson',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 6,
    name: 'Joseph Martin',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 7,
    name: 'William Thomas',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 8,
    name: 'Jacob Harris',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 9,
    name: 'Liam Lopez',
    image: '',
    phone: '+1(123) 456 7890'
  },
  {
    id: 10,
    name: 'Daniel Allen',
    image: '',
    phone: '+1(123) 456 7890'
  },
];

const notificationData = [
  {
    id: 1,
    type: NotificationType.MEDICATION,
    targetId: 1,
    var1: 'Aspirin 81mg',
    var2: '',
    var3: '',
    status: 1
  },
  {
    id: 2,
    type: NotificationType.MEDICATION,
    targetId: 2,
    var1: 'Aspirin 81mg',
    var2: '',
    var3: '',
    status: 1
  },
  {
    id: 3,
    type: NotificationType.MEDICATION,
    targetId: 3,
    var1: 'Metoprolol 30mg',
    var2: '',
    var3: '',
    status: 1
  },
  {
    id: 4,
    type: NotificationType.MEDICATION,
    targetId: 4,
    var1: 'Metoprolol 30mg',
    var2: '',
    var3: '',
    status: 1
  },
];

mock.onPost('/auth/login').reply(200, {
  code: 0,
  data: {
    id: 1,
    email: 'morgan.thornton@bison.howard.edu',
    name: 'Tester'
  }
});

mock.onPost('/auth/register').reply(200, {
  code: 0,
  data: {
    id: 1,
    email: 'morgan.thornton@bison.howard.edu',
    name: 'Tester'
  }
});

mock.onPost('/auth/send-verification-code').reply(200, {
  code: 0
});

mock.onPost('/auth/verify-code').reply(200, {
  code: 0,
  token: '!@32SDf2sd37frd231@#'
});

mock.onPost('/auth/reset-password').reply(200, {
  code: 0
});

mock.onPost('/auth/update-password').reply(200, {
  code: 0
});

mock.onPost('/user/setting').reply(200, {
  code: 0,
  data: {
    userId: 1,
    theme: 'light',
    font: 'normal',
    push: 'on'
  }
});

mock.onGet('/medication/frequency/list').reply(200, {
  code: 0,
  data: frequencyData,
});
mock.onGet('/medication/list').reply(200, {
  code: 0,
  data: medicationData
});

mock.onGet('/appointment/list').reply(200, {
  code: 0,
  data: appointmentData
});

mock.onGet(`/appointment/list?date=${dayjs().format('YYYY-MM-DD')}`).reply(200, {
  code: 0,
  data: appointmentData.filter((_, index) => index % 2 === 0)
});

mock.onGet('/contact/list').reply(200, {
  code: 0,
  data: contactData
});

mock.onGet('/emergency/contact/list').reply(200, {
  code: 0,
  data: contactData
});

mock.onGet('/notification/list').reply(200, {
  code: 0,
  data: notificationData
});

export default mock;