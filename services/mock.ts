import axios from 'axios';

import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './instance';

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

export default mock;