import {Actionsheet, Box, Button, HStack, Pressable, Text, useDisclose, View, VStack} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import DocumentPicker from 'react-native-document-picker'
// import * as RNFS from "react-native-fs";

const ManualActionSheet  = ({onOpen, onClose, isOpen}) => {
    const [fileResponse, setFileResponse] = useState([]);

    const handleMp3FilePicker = useCallback(async () => {
        console.log("핸드폰 내 Mp3 파일 찾기")
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
            });
            setFileResponse(response);
        } catch (error) {
            console.warn(error);
        }
    }, []);

    // try {
    //     const pickedFile = await DocumentPicker.pickSingle({
    //         type: [DocumentPicker.types.allFiles],
    //     });
    //     console.log('pickedFile :', pickedFile)
    //
    //     await RNFS.readFile(pickedFile.uri, 'base64').then(data => {
    //         console.log('base64', data);
    //     });
    // } catch (err) {
    //     if (DocumentPicker.isCancel(err)) {
    //         console.log(err);
    //     } else {
    //         console.log(error);
    //         throw err;
    //     }
    // }

    const handleUploadMusic = () => {
        console.log("업로드 할 핸드폰 내 파일을 선택해주세요. 선택 완료.")
    };


    const handleOnClose = () => {
        console.log("닫기")
        onClose();
    }


    return(

        <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >
                    <Box w="100%" h={60} marginTop={1} marginBottom={5} justifyContent="center" alignItems={"center"}>
                        <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                            핸드폰 내 MP3
                        </Text>
                        <Text fontSize={18} color="black" fontWeight={"bold"}>
                            파일을 선택해주세요.
                        </Text>
                    </Box>


                    <Pressable
                        onPress={handleMp3FilePicker}
                        width={"92%"}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bg={(props) =>
                            props.isPressed ? "blue.200" : props.isHovered ? "blue.100" : "blue.50"}>
                        {({ isPressed, isHovered }) => (
                            <HStack p={1} justifyContent="center" alignItems={"center"} marginTop={2}
                                    bgColor={"#F5F5F6"} marginBottom={1} borderColor={"#E6E6E7"} borderRadius={3}
                                    borderWidth={1} height={"120px"} width={"100%"}
                                    style={{
                                        transform: [{ scale: isPressed ? 0.95 : isHovered ? 1.05 : 1 }],
                                        transition: "transform 0.2s",
                                    }}>
                                <Box mr={2} p={1} style={{ borderWidth: 1.5, borderColor: '#ADADAD',
                                    borderRadius: 3, borderStyle: 'dashed', }}>
                                    <AntDesign name={"plus"} color={"#ADADAD"} size={26} />
                                </Box>
                                <Text marginLeft={2} fontSize={"14px"} color={'#616161'}>
                                    여기를 눌러 파일을 선택해주세요.
                                </Text>
                            </HStack>
                        )}
                    </Pressable>

                    <VStack width={"92%"} marginTop={8}>
                        <Button size={"lg"} bg={"#2785F4"} onPress={handleUploadMusic}>
                            <Text fontWeight={800} fontSize={'18px'} color={"white"}>업로드 하기</Text>
                        </Button>
                    </VStack>

            </Actionsheet.Content>

        </Actionsheet>
    )
};

export default ManualActionSheet;

