import {Actionsheet, Box, Button, HStack, Pressable, Text, useDisclose, View, VStack} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import DocumentPicker, {types} from 'react-native-document-picker'
import {Alert, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";
import * as RNFS from "react-native-fs";


const ManualActionSheet  = ({onOpen, onClose, isOpen, MusicData}) => {
    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState("")
    const [audioFile, setAudioFile] = useState(null);
    const [audioSize, setAudioSize] = useState(null)
    const [metaMusicTitle, setMetaMusicTitle] = useState("")
    const [metaMusicArtist, setMetaMusicArtist] = useState();
    const [manualCopyfilePath, setManualCopyFilePath] = useState();


    const handleMp3FilePicker = useCallback(async () => {
        console.log("핸드폰 내 Mp3 파일 찾기")
        try {
            const fileResponse = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                type: [types.audio]
            });
            setFileSelected(true);
            console.log('파일이 선택되었습니다.')
            console.log("파일 정보:", fileResponse)
            setAudioFile(fileResponse)

            console.log("음원 이름: ", fileResponse.name);
            setFileName(fileResponse.name);

            const sizeInMB = fileResponse.size / 1024**2;
            console.log("파일 용량: ", sizeInMB)
            setAudioSize(sizeInMB)
            console.log("파일 URI: ", fileResponse.uri)

            // await TrackPlayer.reset(); // 재생 목록 초기화
            // await TrackPlayer.add({
            //     title: fileResponse.name,
            //     url: fileResponse.uri,
            // });
            console.log("fileResponse.name: ", fileResponse.name)
            console.log("fileResponse.uri: ", fileResponse.uri)
            console.log("track uri 수신")

            // let metadataReceived = false;
            //
            //     // AudioCommonMetadataReceived 이벤트를 구독하여 수신된 메타데이터를 콘솔에 출력합니다.
            //     TrackPlayer.addEventListener("metadata-common-received", (data) => {
            //         if (!metadataReceived) {
            //             console.log('Received metadata:', data);
            //
            //             const metaTitle = data.metadata.title
            //             const metaArtist = data.metadata.artist
            //
            //             console.log('Received1 metadata title:', metaTitle);
            //             console.log('Received1 metadata artist:', metaArtist);
            //
            //             setMetaMusicTitle(metaTitle)
            //             setMetaMusicArtist(metaArtist)
            //             metadataReceived = true
            //         }
            //     });

            // 앱 데이터 디렉토리 경로 가져오기, 백업
            const appDataDir = Platform.select({
                // ios: `${RNFS.DocumentDirectoryPath}/RENST`,
                android: `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.renst`,
            });

            const parseName = fileResponse.name
            const parseUri = fileResponse.uri

            // 백업할 위치 경로 설정
            const backupPath = `${appDataDir}/${parseName}`;
            console.log("backupPath :", backupPath)
            setManualCopyFilePath(backupPath)

            // 파일을 백업 경로로 복사 또는 이동
            // 예시: 파일을 복사하는 경우
            await RNFS.copyFile(parseUri, backupPath);
            console.log("음원 파일이 백업되었습니다.")


            console.log(">>>>>>>>>>>>>>>>>>>>>>>")

        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('파일 선택이 취소되었습니다.')
            } else {
                console.log("에러 :", error);
            }
        }
    }, []);


    const audioSize2MB = Number(audioSize).toFixed(2);
    const fileFullName = fileName.replace('.mp3', '');

    //음원 파일 저장
    const handleUploadMusic = async () => {
        console.log("선택한 파일을 업로드합니다...")
        try {
            const {fileCopyUri, name, size, type, uri} = audioFile;
            const dataToStore = { fileCopyUri, name, size, type, uri };
            // const jsonValue = JSON.stringify(dataToStore);
            // await AsyncStorage.setItem('manualmusic', jsonValue)
            // console.log("저장된 내용 jsonValue: ", dataToStore)
            // console.log("저장된 내용 savedData: ", jsonValue)
            // console.log("선택한 음원 파일이 저장되었습니다.")
            // await AsyncStorage.setItem('selectedMusicUri', JSON.stringify(uri));
            // const getSavedDataUri = await AsyncStorage.getItem("selectedMusicUri")
            //
            // const getJsonValue = await AsyncStorage.getItem('manualmusic');
            // const parseData = JSON.parse(getJsonValue)
            // const musicName = parseData.name
            //
            // console.log("전체 데이터: ", parseData)
            // console.log("데이터가 정상적으로 불러와졌습니다.");
            // console.log("musicName:", musicName )
            //
            // await AsyncStorage.setItem('selectedMusicName', JSON.stringify(name));
            // const getSavedDataName = await AsyncStorage.getItem("selectedMusicName")
            //
            // console.log("음원 이름이 selectedMusicName에 저장되었습니다", JSON.parse(getSavedDataName))
            // console.log("음원 주소가 selectedMusicUri에 저장되었습니다", getSavedDataUri)


                    MusicData(uri, name, manualCopyfilePath)


            console.log(">>>>>>>>>>>>>>>>>>>>>>>")

            setFileSelected(false);
            onClose();
        } catch (error) {
            console.error("에러: ", error)
            Alert.alert("실패: ", "음원 파일 업로드 실패, \n 다시 시도해주세요." )
        }
    };


    const handleOnClose = () => {
        console.log("닫기")
        setFileSelected(false);
        onClose();
    }



    return(

        <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >
                    <Box w="100%" h={60} marginTop={1} marginBottom={5} justifyContent="center" alignItems={"center"}>
                        {(fileSelected) ?
                            <>
                                <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                                    음원 파일이 선택되었습니다.
                                </Text>
                            </>
                            :
                            <>
                            <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                                핸드폰 내 음원(.mp3)
                            </Text>
                            <Text fontSize={18} color="black" fontWeight={"bold"}>
                                파일을 선택해주세요.
                            </Text>
                            </>
                        }
                    </Box>


                {(fileSelected) ?
                <Box display={'flex'} flexDir={"row"} justifyContent={'space-between'} alignItems={'center'}
                     width={"320px"} height={'119px'} py={4} px={4} borderWidth={1} borderRadius={3} backgroundColor={'#F5F5F6'} borderColor={'#E6E6E7'}>
                    <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} style={{padding: 2}}/>
                    <Box width={'230px'} height={'auto'}>
                    <Text style={{fontSize: 14, fontWeight: 500, color:'#616161'}}>{fileFullName.length > 40 ? '"' + fileFullName.substring(0, 30) + '...' + '"\n'  : '"' + fileFullName + '"\n'}</Text>

                        <Text style={{fontSize: 12, fontWeight: 500, color:'#ADADAD'}}>{audioSize2MB}MB
                        </Text>
                    </Box>
                </Box>
                    :
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
                }

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

