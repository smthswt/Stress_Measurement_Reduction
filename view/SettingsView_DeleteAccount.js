import {
    Button,
    Center,
    Checkbox,
    FormControl,
    Heading,
    HStack,
    Input,
    List,
    ScrollView,
    Text,
    TextArea, View,
    VStack
} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SQLite from "react-native-sqlite-storage";
import {UserContext} from "./module/UserProvider";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 *
 */

const db = SQLite.openDatabase(
    {
        name: 'RENST.db',
        location: 'default',
    },
    () => {},
    error => {
        console.error('Error opening database: ', error);
    }
)

export const SettingsView_DeleteAccount = ({ navigation }) => {

    const[feedback, setFeedback] = useState(null)
    const[check, setCheck] = useState(false)

    const {userId} = useContext(UserContext)
    console.log(userId)

    const handleDeleteAccount = async () => {
        if (check) {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM users WHERE id = ?',
                    [userId],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            console.log('User deleted successfully');
                        } else {
                            console.log('User deletion failed');
                        }
                    },
                    error => {
                        console.error('Error deleting user: ', error);
                        // Handle error case while deleting user
                    }
                );
            })
            await (navigation.navigate("LoginScreens", {screen:"Login"}));
        } else {
            console.log('Please check the confirmation checkbox before deleting');
        }
    };


    return (
        // <ScrollView max p={5} bg={"blue.200"} >
        <VStack space={5} flex={1} p={5} bg={"white"}>
            <Center flex={2}>
                <Text color={"#2785F4"} fontSize={"6xl"}>RENST</Text>
            </Center>
            <VStack space={1}>
                <FormControl>
                    <FormControl.Label _text={{bold: true}}>서비스를 탈퇴하시려는 이유가 있으신가요?</FormControl.Label>
                    <TextArea
                        placeholder="서비스 탈퇴 사유에 대해 알려주시면 고객님의 피드백을 반영하여 더 나은 서비스로 보답 드리겠습니다."
                        onChangeText={value => setFeedback(value)}
                        bg={'gray.50'}
                        h={150}
                        _focus={{
                            bgColor: 'gray.50',
                            borderColor:"#2785F4",
                        }}
                    />
                </FormControl>

                <HStack alignItems={"center"} space={1}>
                    <Ionicons name={"ellipse"} size={5}></Ionicons>
                    <Text>서비스 탈퇴이후 모든 데이터는 복구가 불가능합니다.</Text>
                </HStack>
            </VStack>

            {/*<ScrollView>*/}
            <VStack space={5} justifyContent={"flex-end"}>
                <HStack  alignItems={"center"}>
                    <Checkbox shadow={2} colorScheme="blue" value={check} accessibilityLabel="Delete account checkbox" onChange={newValue => setCheck(newValue)}>
                        안내사항을 모두 확인하였으며, 이에 동의합니다.
                    </Checkbox>
                </HStack>
                <Button height={55} bg={"#2785F4"} isDisabled={!check} onPress={handleDeleteAccount}>
                    <Text bold color={"white"} fontSize={'md'}>탈퇴하기</Text>
                </Button>
            </VStack>
            {/*</ScrollView>*/}
        </VStack>
        // </ScrollView>
    );
};







