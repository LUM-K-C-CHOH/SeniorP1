/**
 * Mock Data
 * RTHA
 * 
 * Created By Thornton at 01/23/2025
 */
import axios from 'axios';

import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './instance';
import { NotificationType } from '@/config/constants';

const mock = new MockAdapter(axiosInstance);

mock.onPost('/auth/login').reply(200, {
  id: 1,
  email: 'morgan.thornton@bison.howard.edu',
  name: 'Tester'
});

mock.onGet('/medication/list').reply(200, [
  {
    id: 1,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/first_aid_dual_head_stethoscope_2_170x170_crop_top.png?v=1552665562',
    name: 'Aspirin',
    dosage: '100mg',
    stock: 32,
    frequency: '1/1d',
    notifications: 0,
  },
  {
    id: 2,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/drive_medical_clinical_care_geri_chair_recliner_2_170x170_crop_top.png?v=1552665466',
    name: 'Metoprolol',
    dosage: '5mg',
    stock: 16,
    frequency: '1/2d',
    notifications: 1,
  },
  {
    id: 3,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/drive_medical_deluxe_folding_exercise_peddler_with_electronic_display_2_170x170_crop_top.png?v=1552665478',
    name: 'Lisinoprill',
    dosage: '50mg',
    stock: 4,
    frequency: '1/1d',
    notifications: 1,
  },
  {
    id: 4,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-5_370x370_crop_center.png?v=1613531679',
    name: 'Amoxicilin',
    dosage: '500mg',
    stock: 14,
    frequency: '2/1d',
    notifications: 0,
  },
  {
    id: 5,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-4_370x370_crop_center.png?v=1613531679',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    frequency: '1/3d',
    notifications: 0,
  },
  {
    id: 6,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/files/Gallery-6_370x370_crop_center.png?v=1613531679',
    name: 'Aspirin',
    dosage: '100mg',
    stock: 32,
    frequency: '1/1d',
    notifications: 4,
  },
  {
    id: 7,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/polar_ft4_heart_rate_monitor_1_170x170_crop_top.png?v=1552665646',
    name: 'Metoprolol',
    dosage: '5mg',
    stock: 16,
    frequency: '1/2d',
    notifications: 0,
  },
  {
    id: 8,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/collections/gowise_usa_advanced_control_digital_blood_pressure_monitor_4_270x255_crop_top.png?v=1552667445',
    name: 'Lisinoprill',
    dosage: '50mg',
    stock: 4,
    frequency: '1/1d',
    notifications: 0,
  },
  {
    id: 9,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/polar_h7_bluetooth_smart_heart_rate_sensor_1_170x170_crop_top.png?v=1552665655',
    name: 'Amoxicilin',
    dosage: '500mg',
    stock: 14,
    frequency: '2/1d',
    notifications: 2,
  },
  {
    id: 10,
    image: 'https://theme635-medical.myshopify.com/cdn/shop/products/gowise_usa_advanced_control_digital_blood_pressure_monitor_2_170x170_crop_top.png?v=1552665575',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    frequency: '1/3d',
    notifications: 1,
  }
]);

mock.onGet('/appointment/list').reply(200, [
  {
    id: 1,
    contactId: 1,
    scheduledTime: '2025-01-24 14:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 2,
    contactId: 2,
    scheduledTime: '2025-01-26 16:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 3,
    contactId: 3,
    scheduledTime: '2025-02-02 16:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 4,
    contactId: 4,
    scheduledTime: '2025-02-04 15:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 5,
    contactId: 5,
    scheduledTime: '2025-02-04 16:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 6,
    contactId: 6,
    scheduledTime: '2025-02-05 15:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 7,
    contactId: 7,
    scheduledTime: '2025-02-05 17:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 8,
    contactId: 8,
    scheduledTime: '2025-02-06 14:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 9,
    contactId: 9,
    scheduledTime: '2025-02-06 16:30:00',
    description: 'Consulting on health...',
  },
  {
    id: 10,
    contactId: 10,
    scheduledTime: '2025-02-07 15:30:00',
    description: 'Consulting on health...',
  },
]);

mock.onGet('/contact/list').reply(200, [
  {
    id: 1,
    name: 'Gabi Emilson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 2,
    name: 'Malcom Stewart',
    phone: '+1(123) 456 7890'
  },
  {
    id: 3,
    name: 'Jhon Smith',
    phone: '+1(123) 456 7890'
  },
  {
    id: 4,
    name: 'Robert Wilson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 5,
    name: 'David Anderson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 6,
    name: 'Joseph Martin',
    phone: '+1(123) 456 7890'
  },
  {
    id: 7,
    name: 'William Thomas',
    phone: '+1(123) 456 7890'
  },
  {
    id: 8,
    name: 'Jacob Harris',
    phone: '+1(123) 456 7890'
  },
  {
    id: 9,
    name: 'Liam Lopez',
    phone: '+1(123) 456 7890'
  },
  {
    id: 10,
    name: 'Daniel Allen',
    phone: '+1(123) 456 7890'
  },
]);

mock.onGet('/emergency/contact/list').reply(200, [
  {
    id: 1,
    name: 'Gabi Emilson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 2,
    name: 'Malcom Stewart',
    phone: '+1(123) 456 7890'
  },
  {
    id: 3,
    name: 'Jhon Smith',
    phone: '+1(123) 456 7890'
  },
  {
    id: 4,
    name: 'Robert Wilson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 5,
    name: 'David Anderson',
    phone: '+1(123) 456 7890'
  },
  {
    id: 6,
    name: 'Joseph Martin',
    phone: '+1(123) 456 7890'
  },
  {
    id: 7,
    name: 'William Thomas',
    phone: '+1(123) 456 7890'
  },
  {
    id: 8,
    name: 'Jacob Harris',
    phone: '+1(123) 456 7890'
  },
  {
    id: 9,
    name: 'Liam Lopez',
    phone: '+1(123) 456 7890'
  },
  {
    id: 10,
    name: 'Daniel Allen',
    phone: '+1(123) 456 7890'
  },
]);
mock.onGet('/notification/list').reply(200, [
  {
    id: 1,
    type: NotificationType.MEDICATION,
    targetId: 1,
    var1: 'Aspirin 81mg'
  },
  {
    id: 2,
    type: NotificationType.MEDICATION,
    targetId: 2,
    var1: 'Aspirin 81mg'
  },
  {
    id: 3,
    type: NotificationType.MEDICATION,
    targetId: 3,
    var1: 'Metoprolol 30mg'
  },
  {
    id: 4,
    type: NotificationType.MEDICATION,
    targetId: 4,
    var1: 'Metoprolol 30mg'
  },
]);

export default mock;