import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import Realm from 'realm';

let realm;

const DeviceSchema = {
  name: 'Device',
  properties: {
    id: 'string',
    name: 'string',
    registrationDate: 'date',
    isConnected: 'bool',
  },
  primaryKey: 'id',
};

const ReportSchema = {
  name: 'Report',
  properties: {
    id: 'string',
    name: 'string',
    avgHR: 'double',
    sdnn: 'double',
    stressIndex: 'double',
    HRList: 'int[]',
    RRList: 'int[]',
    createAt: 'date',
  },
  primaryKey: 'id',
};

/** ==============================================================================
 * Realm Initialize
 */

// Realm 초기화
export async function initializeRealm() {
  realm = await Realm.open({
    path: 'myRealm',
    schema: [DeviceSchema, ReportSchema],
  });
  return realm;
}

/** ==============================================================================
 * Analysis Report Table
 */

// 함수로 객체 생성
export function createReport(
  name,
  avgHR,
  sdnn,
  stressIndex,
  HRList,
  RRList,
  createDate,
) {
  realm.write(() => {
    const report = realm.create('Report', {
      id: uuidv4(), // UUID 자동 생성
      name: name,
      avgHR: avgHR,
      sdnn: sdnn,
      stressIndex: stressIndex,
      HRList: HRList,
      RRList: RRList,
      createAt: createDate,
    });
    console.log(`Report Data: ${JSON.stringify(report)}`);
    console.log('Created new Report with ID:', report.id);
  });
}

export function addReport(value) {
  realm.write(() => {
    realm.create('Report', value);
  });
}

export function findReport(id) {
  return realm.objectForPrimaryKey('Report', id);
}

export function getReport() {
  if (realm === null) initializeRealm();

  return realm.objects('Report').sorted('createAt', true);
}

export function deleteReport(id) {
  realm.write(() => {
    let report = realm.objectForPrimaryKey('Report', id);
    realm.delete(report);
  });
}

/** ==============================================================================
 * RENST Device Table
 */

/**
 * Adds a new device to the system.
 *
 * @param {string} id - The ID of the device.
 * @param {string} name - The name of the device.
 * @param {Date} registerAt - The registration date of the device.
 * @param {boolean} isConnected - The connection status of the device.
 *
 * @return {void} - This method does not return any value.
 */
export function addDevice(id, name, registerAt, isConnected) {
  realm.write(() => {
    const device = realm.create('Device', {
      id: id, // UUID 자동 생성
      name: name,
      registrationDate: registerAt,
      isConnected: isConnected,
    });

    console.log(`Device Info: ${JSON.stringify(device)}`);
    console.log('Register new Device with ID:', device.id);
  });
}

/**
 * Gets a device based on its ID.
 *
 * @param {string} id - The ID of the device to get.
 *
 * @return {Object} The device object.
 */
//아이디로 객체 데이터 가져오기
export function getDeviceById(id) {
  return realm.objectForPrimaryKey('Device', id);
}

export function getDevices() {
  return realm.objects('Device');
}

/**
 * Updates the done status of a device.
 *
 * @param {number} id - The id of the device to update.
 * @param {boolean} isConnected - The new done status of the device.
 *
 * @return {void}
 */
export function updateDevice(id, isConnected) {
  realm.write(() => {
    let device = realm.objectForPrimaryKey('Device', id);
    if (device) {
      device.isConnected = isConnected;
    }
  });
}

export function deleteDevice(id) {
  realm.write(() => {
    let device = realm.objectForPrimaryKey('Device', id);
    realm.delete(device);
  });
}

export async function getConnectedDevices() {
  if (!realm) {
    realm = await initializeRealm().catch(error => {
      console.error('Error opening Realm: ', error);
      return null;
    });
  }

  if (!realm) return;

  return realm.objects('Device').filtered('isConnected = true')[0];
}
