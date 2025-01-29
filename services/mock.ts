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
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/imd-author-interviews-background-800x266.jpg?versionId=83608',
    name: 'Aspirin',
    dosage: '100mg',
    stock: 32,
    frequency: '1/1d',
    notifications: 0,
  },
  {
    id: 2,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/coronavirus-covid-19-qa-background-800x266.jpg?versionId=83608',
    name: 'Metoprolol',
    dosage: '5mg',
    stock: 16,
    frequency: '1/2d',
    notifications: 1,
  },
  {
    id: 3,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/ped-editors-summary-background-800x266.jpg?versionId=83608',
    name: 'Lisinoprill',
    dosage: '50mg',
    stock: 4,
    frequency: '1/1d',
    notifications: 1,
  },
  {
    id: 4,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/psy-author-interviews-background-800x266.jpg?versionId=83608',
    name: 'Amoxicilin',
    dosage: '500mg',
    stock: 14,
    frequency: '2/1d',
    notifications: 0,
  },
  {
    id: 5,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/jama-editors-summary-background-800x266.jpg?versionId=83608',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    frequency: '1/3d',
    notifications: 0,
  },
  {
    id: 6,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/imd-author-interviews-background-800x266.jpg?versionId=83608',
    name: 'Aspirin',
    dosage: '100mg',
    stock: 32,
    frequency: '1/1d',
    notifications: 4,
  },
  {
    id: 7,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/coronavirus-covid-19-qa-background-800x266.jpg?versionId=83608',
    name: 'Metoprolol',
    dosage: '5mg',
    stock: 16,
    frequency: '1/2d',
    notifications: 0,
  },
  {
    id: 8,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/ped-editors-summary-background-800x266.jpg?versionId=83608',
    name: 'Lisinoprill',
    dosage: '50mg',
    stock: 4,
    frequency: '1/1d',
    notifications: 0,
  },
  {
    id: 9,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/psy-author-interviews-background-800x266.jpg?versionId=83608',
    name: 'Amoxicilin',
    dosage: '500mg',
    stock: 14,
    frequency: '2/1d',
    notifications: 2,
  },
  {
    id: 10,
    image: 'https://cdn.jamanetwork.com/ImageLibrary/JamaNetwork/audio/jama-editors-summary-background-800x266.jpg?versionId=83608',
    name: 'Clopidogrel',
    dosage: '75mg',
    stock: 206,
    frequency: '1/3d',
    notifications: 1,
  }
]);

export default mock;