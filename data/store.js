// store.js
import {configureStore, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getDevices, getReport} from './RealmDatabase';

// 초기 상태 정의
const initDeviceState = {
  isConnected: false,
  connectDevice: '',
  deviceList: [],
};

export const fetchDevices = createAsyncThunk(
  'device/fetchDevices',
  async (dispatch, getState) => {
    const devices = await getDevices();
    return devices.map(device => ({
      ...device,
      registrationDate: device.registrationDate.toISOString(),
    }));
  },
);

const deviceSlice = createSlice({
  name: 'device',
  initialState: initDeviceState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload; // 연결 상태 업데이트
    },
    setConnectDevice: (state, action) => {
      state.connectDevice = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.deviceList = action.payload;
    });
  },
});

export const {setConnectionStatus, setConnectDevice} = deviceSlice.actions;

const initReportState = {
  reports: [],
};

export const fetchReports = createAsyncThunk(
  'report/fetchReports',
  async (dispatch, getState) => {
    const reports = await getReport();
    return reports.map(report => ({
      ...report,
      createAt: report.createAt.toISOString(),
      HRList: Array.from(report.HRList),
      RRList: Array.from(report.RRList),
    }));
  },
);

const reportSlice = createSlice({
  name: 'report',
  initialState: initReportState,
  // reducers: {
  //     setReports: (state, action) => {
  //         state.reports = action.payload;
  //     }
  // },
  extraReducers: builder => {
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.reports = action.payload;
    });
  },
});

// export const {
//     setReports,
// } = reportSlice.actions;

const store = configureStore({
  reducer: {
    device: deviceSlice.reducer,
    report: reportSlice.reducer,
  },
});

export default store;
