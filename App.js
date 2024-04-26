import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Animated,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NativeBaseProvider, VStack} from 'native-base';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';
//CustomizedVectorImages

// BLE Import
import {BLEProvider} from './view/module/BLEProvider';
``;

// View Import
import {HomeView} from './view/HomeView';
import {MusicView} from './view/MusicView';
import {CalendarView} from './view/CalendarView';
import {SettingsView} from './view/SettingsView';
import {ECGMeasurementView} from './view/ECGMeasurementView';
import {AnalysisResultView} from './view/AnalysisResultView';
import {HealingView} from './view/HealingView';
import {BeforeAfterResultComparison} from './view/BeforeAfterResultComparison';
import {AllRecordsListView} from './view/AllRecordsListView';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeView_AllResults} from './view/HomeView_AllResults';
import {HomeView_AllStress} from './view/HomeView_AllStress';
import {LoginView} from './view/LoginView';
import {RegisterView} from './view/RegisterView';
import {RegisterSuccessView} from './view/RegisterSuccessView';
import {SettingsView_Device} from './view/SettingsView_Device';
import {SettingsView_Regular} from './view/SettingsView_Regular';
import {SettingsView_Manual} from './view/SettingsView_Manual';
import {ManualView} from './view/ManualView';
import {RemeasureResultView} from './view/ReMeasureResultView';
import {ECGRemeasurementView} from './view/ECGRemeasurementView';
import {SettingsView_DeleteAccount} from "./view/SettingsView_DeleteAccount";
import {UserProvider} from "./view/module/UserProvider";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OnboardingOneScreen1} from "./view/onboarding/OnboardingOneScreen1";
import {OnboardingOneScreen3} from "./view/onboarding/OnboardingOneScreen3";
import {OnboardingOneScreen2} from "./view/onboarding/OnboardingOneScreen2";
import {PrivacyPolicy} from "./view/PrivacyPolicyView";
import {PP_Purpose} from "./view/components/PrivacyPolicy/PP_Purpose";
import {PP_Period} from "./view/components/PrivacyPolicy/PP_Period";
import {PP_ThirdMatters} from "./view/components/PrivacyPolicy/PP_ThirdMatters";
import {PP_Drop} from "./view/components/PrivacyPolicy/PP_drop";
import {PP_delegation} from "./view/components/PrivacyPolicy/PP_delegation";
import {PP_Personal} from "./view/components/PrivacyPolicy/PP_Personal";
import {PP_Safety} from "./view/components/PrivacyPolicy/PP_Safety";
import EnrollingDeviceView from "./view/EnrollingDeviceView";
import DeviceListView from "./view/DeviceListView";
import CompleteSearchingDevice from "./view/CompleteSearchingDevice";
import {ResetIDPW} from "./view/ResetIDPW";
import {Provider} from "react-redux";
import store from "./data/store";
import {initializeRealm} from "./data/RealmDatabase";
import Realm from "realm";



/**
 * Object representing cross-fade transition configuration.
 *
 * @typedef {Object} crossFadeTransition
 * @property {string} gestureDirection - The direction of the gesture ('horizontal' or 'vertical').
 * @property {boolean} headerShown - Whether the header is shown or not.
 * @property {Function} cardStyleInterpolator - A function that returns the animated card style.
 */
const crossFadeTransition = {
    gestureDirection: 'horizontal',
    headerShown: false,
    cardStyleInterpolator: ({current, next, layouts}) => {
        return {
            cardStyle: {
                opacity: Animated.add(
                    current.progress,
                    next ? next.progress : 0,
                ).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 1, 0],
                }),
            },
        };
    },
};

const crossFadeTransitionWithHeader = {
    gestureDirection: 'horizontal',
    headerShown: true,
    cardStyleInterpolator: ({current, next, layouts}) => {
        return {
            cardStyle: {
                opacity: Animated.add(
                    current.progress,
                    next ? next.progress : 0,
                ).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 1, 0],
                }),
            },
        };
    },
};
/**
 * @namespace Stack
 * @description Represents a stack navigator object in React Navigation.
 */
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const StackNative = createNativeStackNavigator();

// const LoginScreens = () => {
//     return (
//         <StackNative.Navigator initialRouteName={LoginView}>
//             <StackNative.Screen
//                 name="Login"
//                 component={LoginView}
//                 options={crossFadeTransition}
//             />
//             <StackNative.Screen
//                 name="Register"
//                 component={RegisterView}
//                 options={crossFadeTransition}
//             />
//             <StackNative.Screen
//                 name="RegisterSuccess"
//                 component={RegisterSuccessView}
//                 options={crossFadeTransition}
//             />
//         </StackNative.Navigator>
//     );
// };

const TabScreens = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === 'Home') {
                        iconName = 'home';
                    } else if (rn === 'Music') {
                        iconName = 'musical-notes';
                    } else if (rn === 'Calendar') {
                        iconName = 'calendar';
                    } else if (rn === 'Settings') {
                        iconName = 'settings';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
            <Tab.Screen
                name="Home"
                component={HomeView}
                options={crossFadeTransition}
            />
            <Tab.Screen
                name="Music"
                component={MusicView}
                options={crossFadeTransition}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarView}
                options={crossFadeTransition}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsView}
                options={crossFadeTransition}
            />
        </Tab.Navigator>
    );
};
/**
 * Represents the main application component.
 * @constructor
 */

const AnalysisViewScreens = () => {
    return (
        <StackNative.Navigator initialRouteName={AnalysisResultView}>
            <StackNative.Screen
                name="AnalysisEnd"
                component={AnalysisResultView}
                options={crossFadeTransition}
            />
            <StackNative.Screen
                name="AllRecordsList"
                component={AllRecordsListView}
                options={crossFadeTransition}
            />
        </StackNative.Navigator>
    );
};

const SettingScreens =() => {
    return (
        <StackNative.Navigator initialRouteName={SettingsView}>
            <StackNative.Screen name="Settings" component={SettingsView}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="Device" component={SettingsView_Device}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="Regular" component={SettingsView_Regular}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="Manual" component={SettingsView_Manual}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="Privacy" component={PrivacyPolicy}
                                options={crossFadeTransition}/>
        </StackNative.Navigator>
    )
}

const RemeasureResultsViewScreens = () => {
    return (
        <StackNative.Navigator initialRouteName={RemeasureResultView}>
            <StackNative.Screen
                name="RemeasureEnd"
                component={RemeasureResultView}
                options={crossFadeTransition}
            />
            <StackNative.Screen
                name="힐링 모드 전 후 비교하기"
                component={BeforeAfterResultComparison}
                options={crossFadeTransitionWithHeader}
            />
        </StackNative.Navigator>
    );
};

const PrivacyPolicyScreens = () => {
    return(
        <StackNative.Navigator initialRouteName={PrivacyPolicy}>
            <StackNative.Screen name={"Purpose"} component={PP_Purpose} options={crossFadeTransition} />
            <StackNative.Screen name={"Period"} component={PP_Period} options={crossFadeTransition} />
            <StackNative.Screen name={"Third"} component={PP_ThirdMatters} options={crossFadeTransition} />
            <StackNative.Screen name={"Drop"} component={PP_Drop} options={crossFadeTransition} />
            <StackNative.Screen name={"delegation"} component={PP_delegation} options={crossFadeTransition} />
            <StackNative.Screen name={"Personal"} component={PP_Personal} options={crossFadeTransition} />
            <StackNative.Screen name={"Safety"} component={PP_Safety} options={crossFadeTransition} />

        </StackNative.Navigator>
    )
};

const DeviceSettingScreens = () => {
    return(
        <StackNative.Navigator initialRouteName={SettingsView_Device}>
            <StackNative.Screen name={"Enroll"} component={EnrollingDeviceView} options={crossFadeTransition} />
            <StackNative.Screen name={"Devicelist"} component={DeviceListView} options={crossFadeTransition} />
            <StackNative.Screen name={"CompleteEnroll"} component={CompleteSearchingDevice} options={crossFadeTransition} />

        </StackNative.Navigator>
    );
};
const App = () => {
    /**
     * Requests location permission from the user.
     *
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the location permission is granted or not.
     */

    const [onboarded, setOnboarded] = useState();

    const getStorage = async () => {
        const onboarded = await AsyncStorage.getItem('ONBOARDED');
        setOnboarded(JSON.parse(onboarded));
    };

    useEffect(() => {
        getStorage();
    }, []);

    useEffect(() => {
        SplashScreen.hide()
    }, []);


    const LoginScreens = () => {
        return (
            <StackNative.Navigator initialRouteName={onboarded ? 'Login' : 'Onboarding1'}>
                <StackNative.Screen
                    name="Onboarding1"
                    component={OnboardingOneScreen1}
                    options={crossFadeTransition}
                />
                <StackNative.Screen
                    name="Onboarding2"
                    component={OnboardingOneScreen2}
                    options={crossFadeTransition}
                />
                <StackNative.Screen
                    name="Onboarding3"
                    component={OnboardingOneScreen3}
                    options={crossFadeTransition}
                />
                <StackNative.Screen
                    name="Login"
                    component={LoginView}
                    options={crossFadeTransition}
                />
                <StackNative.Screen
                    name="회원가입"
                    component={RegisterView}
                    options={crossFadeTransitionWithHeader}
                />
                <StackNative.Screen
                    name="RegisterSuccess"
                    component={RegisterSuccessView}
                    options={crossFadeTransition}
                />
                <StackNative.Screen
                    name="아이디/비밀번호 찾기"
                    component={ResetIDPW}
                    options={crossFadeTransitionWithHeader}
                />
            </StackNative.Navigator>
        );
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            let locationPermission = await check(
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            );

            if (locationPermission === RESULTS.DENIED) {
                const newPermission = await request(
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                );
                return newPermission === RESULTS.GRANTED;
            }

            return locationPermission === RESULTS.GRANTED;
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: '위치 서비스 권한',
                        message:
                            '이 앱은 BLE 기능을 사용하기 위해 위치 서비스 접근 권한이 필요합니다.',
                        buttonNeutral: '나중에 묻기',
                        buttonNegative: '거부',
                        buttonPositive: '허용',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('위치 권한 획득');
                } else {
                    console.log('위치 권한 거부');
                }
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    };

    // useEffect(() => {
    //     requestLocationPermission();
    // }, []);


    const requestBLEPermissions = async () => {
        if (Platform.OS === "android" && Platform.Version >= 31) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            ]);

            if (granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_ADVERTISE'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("All BLE permissions granted");
                // 여기서 BLE 관련 작업을 수행할 수 있습니다.
            } else {
                console.log("BLE permissions denied");
                // 권한이 거부된 경우 처리 로직
            }
        }
    }


    useEffect( () => {

        async function fetch() {
            await initializeRealm().catch(error => {
                console.error("Error opening Realm: ", error);
            });

            if (__DEV__) {
                console.log("Development mode");
                Realm.deleteFile({});
            }
        }

        fetch();
        requestLocationPermission();
        requestBLEPermissions();
    }, []);


    return (
        <Provider store={store}>
        <UserProvider>
        <BLEProvider>
            <NativeBaseProvider>
                <SafeAreaView style={{flex: 1}}>
                    <NavigationContainer>
                        <VStack flex={1} justifyContent={'space-between'}>
                            <Stack.Navigator
                                initialRouteName={LoginView}
                                screenOptions={{
                                    headerShown: false,
                                    cardStyle: {backgroundColor: 'transparent'},
                                }}>
                                <Stack.Screen name={'LoginScreens'} component={LoginScreens} />
                                <Stack.Screen name="TabScreens" component={TabScreens} />
                                <Stack.Screen
                                    name="AnalysisStart"
                                    component={ECGMeasurementView}
                                    options={crossFadeTransition}
                                />
                                <Stack.Screen
                                    name="AnalysisViewScreens"
                                    component={AnalysisViewScreens}
                                    options={crossFadeTransition}
                                />
                                <Stack.Screen
                                    name={'측정 결과 확인'}
                                    component={HomeView_AllResults}
                                    options={crossFadeTransitionWithHeader}
                                />
                                <Stack.Screen
                                    name={'스트레스 정보'}
                                    component={HomeView_AllStress}
                                    options={crossFadeTransitionWithHeader}
                                />
                                <Stack.Screen
                                    name="Healing"
                                    component={HealingView}
                                    options={crossFadeTransition}
                                />
                                <Stack.Screen
                                    name="Manual"
                                    component={ManualView}
                                    options={crossFadeTransition}
                                />
                                <Stack.Screen
                                    name="RemeasureStart"
                                    component={ECGRemeasurementView}
                                    options={crossFadeTransition}
                                />
                                <Stack.Screen
                                    name="RemeasureResultsViewScreens"
                                    component={RemeasureResultsViewScreens}
                                    options={crossFadeTransition}
                                />
                                <StackNative.Screen
                                    name="SettingScreens"
                                    component={SettingScreens}
                                    options={crossFadeTransition}
                                />
                                <StackNative.Screen
                                    name="서비스 탈퇴"
                                    component={SettingsView_DeleteAccount}
                                    options={crossFadeTransitionWithHeader}
                                />
                                <StackNative.Screen name="PrivacyPolicyScreens" component={PrivacyPolicyScreens}
                                                    options={crossFadeTransition}/>
                                <StackNative.Screen name="DeviceSettingScreens" component={DeviceSettingScreens}
                                                    options={crossFadeTransition}/>
                            </Stack.Navigator>
                        </VStack>
                    </NavigationContainer>
                </SafeAreaView>
            </NativeBaseProvider>
        </BLEProvider>
        </UserProvider>
        </Provider>
    );
};

export default App;
