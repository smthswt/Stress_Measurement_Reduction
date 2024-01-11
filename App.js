import * as React from 'react';
import {useEffect} from 'react';
import {Animated, PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Box, Center, HStack, Icon, NativeBaseProvider, Pressable, VStack, Text} from "native-base";
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Ionicons from "react-native-vector-icons/Ionicons";
//CustomizedVectorImages

// BLE Import
import {BLEProvider} from "./view/module/BLEProvider";``

// View Import
import {HomeView} from "./view/HomeView";
import {MusicView} from "./view/MusicView";
import {CalendarView} from "./view/CalendarView";
import {SettingsView} from "./view/SettingsView";
import {ECGMeasurementView} from "./view/ECGMeasurementView";
import {AnalysisResultView} from "./view/AnalysisResultView";
import {HealingView} from "./view/HealingView";
import {BeforeAfterResultComparison} from "./view/BeforeAfterResultComparison";
import {AllRecordsListView} from "./view/AllRecordsListView"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeView_AllResults} from "./view/HomeView_AllResults";
import {HomeView_AllStress} from "./view/HomeView_AllStress";
import {LoginView} from "./view/LoginView";
import {RegisterView} from "./view/RegisterView";
import {RegisterSuccessView} from "./view/RegisterSuccessView";
import {SettingsView_Device} from "./view/SettingsView_Device";
import {SettingsView_Regular} from "./view/SettingsView_Regular";
import {SettingsView_Manual} from "./view/SettingsView_Manual";
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
                    next ? next.progress : 0
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
const Tab = createBottomTabNavigator()
const StackNative = createNativeStackNavigator()

const LoginScreens =() => {
    return (
        <StackNative.Navigator initialRouteName={LoginView}>
            <StackNative.Screen name="Login" component={LoginView}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="Register" component={RegisterView}
                                options={crossFadeTransition}/>
            <StackNative.Screen name="RegisterSuccess" component={RegisterSuccessView}
                                options={crossFadeTransition}/>
        </StackNative.Navigator>
    )
}

const TabScreens = () => {
    return (
        <Tab.Navigator initialRouteName="Home"
                       screenOptions={({route}) => ({
                           tabBarIcon: ({focused, color, size}) => {
                               let iconName
                               let rn = route.name

                               if (rn === "Home") {
                                   iconName = 'home'
                               } else if (rn === "Music") {
                                   iconName = 'musical-notes'
                               } else if (rn === "Calendar") {
                                   iconName = 'calendar'
                               } else if (rn === "Settings") {
                                   iconName = 'settings'
                               }
                               return <Ionicons name={iconName} size={size} color={color}></Ionicons>
                           }
                       })}
        >
            <Tab.Screen name="Home" component={HomeView} options={crossFadeTransition}/>
            <Tab.Screen name="Music" component={MusicView} options={crossFadeTransition}/>
            <Tab.Screen name="Calendar" component={CalendarView}
                        options={crossFadeTransition}/>
            <Tab.Screen name="Settings" component={SettingsView}
                        options={crossFadeTransition}/>
            {/*Analysis Sub Screen
                                <Stack.Screen name="AnalysisStart" component={ElectrocardiogramMeasurementView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="AnalysisEnd" component={AnalysisResultView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="Healing" component={MassageHealingView}
                                              options={crossFadeTransition}/>
                                 */}
        </Tab.Navigator>
    )
}
/**
 * Represents the main application component.
 * @constructor
 */

const AnalysisViewScreens = () => {
    return (
        <StackNative.Navigator initialRouteName={AnalysisResultView}>
            <StackNative.Screen name="AnalysisEnd" component={AnalysisResultView}
                          options={crossFadeTransition}/>
            <StackNative.Screen name="RecentResultCompare" component={BeforeAfterResultComparison}
                          options={crossFadeTransition}/>
            <StackNative.Screen name="AllRecordsList" component={AllRecordsListView}
                                options={crossFadeTransition}/>
        </StackNative.Navigator>
    )
}
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
    )
};

// const EnrollingDeviceScreens = () => {
//     return(
//         <StackNative.Navigator initialRouteName={EnrollingDeviceView}>
//             <StackNative.Screen name={}
//         </StackNative.Navigator>
//     )
// }

const App = () => {

    /**
     * Requests location permission from the user.
     *
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the location permission is granted or not.
     */
    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            let locationPermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (locationPermission === RESULTS.DENIED) {
                const newPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                return newPermission === RESULTS.GRANTED;
            }

            return locationPermission === RESULTS.GRANTED;
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "위치 서비스 권한",
                        message: "이 앱은 BLE 기능을 사용하기 위해 위치 서비스 접근 권한이 필요합니다.",
                        buttonNeutral: "나중에 묻기",
                        buttonNegative: "거부",
                        buttonPositive: "허용"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("위치 권한 획득");
                } else {
                    console.log("위치 권한 거부");
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

    useEffect(() => {
        requestLocationPermission();
    }, []);

    return (
        // <Provider store={store}>
        <BLEProvider>
            <NativeBaseProvider>
                <SafeAreaView style={{flex: 1}}>
                    <NavigationContainer>
                        <VStack flex={1} justifyContent={'space-between'}>
                            <Stack.Navigator initialRouteName={LoginView} screenOptions={{
                                headerShown: false,
                                cardStyle: {backgroundColor: 'transparent'}
                            }}>
                                <Stack.Screen name={"LoginScreens"} component={LoginScreens}/>
                                <Stack.Screen name="TabScreens" component={TabScreens} />
                                <Stack.Screen name="AnalysisStart" component={ECGMeasurementView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="AnalysisViewScreens" component={AnalysisViewScreens}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name={"HomeView_AllResults"} component={HomeView_AllResults}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name={"HomeView_AllStress"} component={HomeView_AllStress}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="Healing" component={HealingView}
                                              options={crossFadeTransition}/>
                                <StackNative.Screen name="SettingScreens" component={SettingScreens}
                                                    options={crossFadeTransition}/>
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
        // </Provider>
    );
};

export default App;
