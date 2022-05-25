// import {axios} from '../lib/axios';

import api from './api.js';

const base_url = '/api/test';

export const tesseractService = {
  getEmptyFormData,
  save,
  sendFile
};

function save(formData) {
  return api()
    .post(base_url, formData)
    .then((res) => {
      console.log('res from  back', res);
      return res.data
    });
}
function sendFile(file) {
  console.log('the front file', file);
  // const data = JSON.stringify(file)
  return api()
    .post(base_url, { file })
    .then((res) => {
      console.log('res', res);
      return res.data
    });
}

function getEmptyFormData() {
  return {
    name: '',
    price: '',
  };
}
