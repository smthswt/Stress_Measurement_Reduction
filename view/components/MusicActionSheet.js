import {Actionsheet, Box, Button, HStack, Pressable, Text, View, VStack} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import DocumentPicker, {types} from "react-native-document-picker";
import TrackPlayer from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from "react-native";


const Music_ActionSheet = ({onOpen, onClose, isOpen, data, MusicData, handleInitialSelectedMusic}) => {
    const [showMp3UploadView, setShowMp3UploadView] = useState(false);
    const [showInitializeView, setShowInitializeView] = useState(true);
    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState("")
    const [audioFile, setAudioFile] = useState(null);
    const [audioSize, setAudioSize] = useState(null)
    const [metaMusicTitleAI, setMetaMusicTitleAI] = useState("")
    const [metaMusicArtistAI, setMetaMusicArtistAI] = useState("");
    const [metadataReceived, setMetadataReceived] = useState(false)


    const handleMp3Button = () => {
        console.log("핸드폰 내 Mp3 지정 버튼 클릭")
        setShowMp3UploadView(true);
    };


    const handleMp3Picker = useCallback(async () => {
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

            await TrackPlayer.reset(); // 재생 목록 초기화
            await TrackPlayer.add({
                title: fileResponse.name,
                url: fileResponse.uri,
            });
            console.log("fileResponse.name: ", fileResponse.name)
            console.log("fileResponse.uri: ", fileResponse.uri)
            console.log("track uri 수신")

            // metadata 수신 여부를 나타내는 변수
            let metadataReceived = false;

            // AudioCommonMetadataReceived 이벤트를 구독하여 수신된 메타데이터를 처리합니다.
            const metadataListener = TrackPlayer.addEventListener("metadata-common-received", (data) => {
                if (!metadataReceived) {
                    console.log('Received metadata:', data);

                    const metaTitle = data.metadata.title;
                    const metaArtist = data.metadata.artist;

                    console.log('Received metadata title:', metaTitle);
                    console.log('Received metadata artist:', metaArtist);

                    setMetaMusicTitleAI(metaTitle);
                    setMetaMusicArtistAI(metaArtist);
                    metadataReceived = true;
                }
            });

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
            const jsonValue = JSON.stringify(dataToStore);
            await AsyncStorage.setItem('AIMusic', jsonValue)
            console.log("저장된 내용 jsonValue: ", jsonValue)
            console.log("저장된 내용 savedData: ", jsonValue)
            console.log("선택한 음원 파일이 저장되었습니다.")
            await AsyncStorage.setItem('AIselectedMusicUri', JSON.stringify(uri));
            const getSavedDataUri = await AsyncStorage.getItem("AIselectedMusicUri")

            const getJsonValue = await AsyncStorage.getItem('AIMusic');
            const parseData = JSON.parse(getJsonValue)
            const musicName = parseData.name

            console.log("전체 데이터: ", parseData)
            console.log("데이터가 정상적으로 불러와졌습니다.");
            console.log("musicName:", musicName )

            await AsyncStorage.setItem('AIselectedMusicName', JSON.stringify(name));
            const getSavedDataName = await AsyncStorage.getItem("AIselectedMusicName")

            console.log("음원 이름이 AIselectedMusicName에 저장되었습니다", JSON.parse(getSavedDataName))
            console.log("음원 주소가 AIselectedMusicUri에 저장되었습니다", getSavedDataUri)

            // await TrackPlayer.reset(); // 재생 목록 초기화
            // await TrackPlayer.add({
            //     title: name,
            //     url: uri,
            // });
            // console.log("name: ", name)
            // console.log("파일 uri: ", uri)
            // console.log("track add 수신")

            // // AudioCommonMetadataReceived 이벤트를 구독하여 수신된 메타데이터를 콘솔에 출력합니다.
            // TrackPlayer.addEventListener("metadata-common-received", async (data) => {
            //     if (!metadataReceived) {
            //         console.log('Received metadata:', data);

            //         const metaTitle = data.metadata.title
            //         const metaArtist = data.metadata.artist

            //         console.log('Received metadata title:', data.metadata.title);
            //         console.log('Received metadata artist:', data.metadata.artist);
            //         console.log('Received metadata title2:', metaTitle);
            //         console.log('Received metadata artist2:', metaArtist);

            //         setMetaMusicTitleAI(metaTitle)
            //         setMetaMusicArtistAI(metaArtist)
            //         setMetadataReceived(true)

            //         console.log(">>>>>>>>>>>>>>>>>>>>>>>")

            //         console.log('전달2:', metaTitle);
            //         console.log('전달3:', metaArtist);

            //         // MusicData(uri, metaMusicTitleAI, metaMusicArtistAI)
            //     }
            // });

            console.log('전달0:', name);
            console.log('전달1:', uri);

            MusicData(name, uri)

            setFileSelected(false);
            onClose();
        } catch (error) {
            console.error("에러: ", error)
            Alert.alert("실패: ", "음원 파일 업로드 실패, \n 다시 시도해주세요." )
        }
    };

    const handleInitialButton = () => {
        console.log("설정 초기화 버튼 클릭")
        setShowInitializeView(false);
    };

    const handleConfirmInitialMusic = () => {
        handleInitialSelectedMusic();
        console.log("음원 초기화 완료.")
        onClose();
    }

    const handleOnClose = () => {
        console.log("닫기")
        onClose();
        setShowMp3UploadView(false);
        setShowInitializeView(true);
    }

    const pressableStyle = (isPressed, isHovered) => {
        return {
            transform: [{scale: isPressed ? 0.95 : isHovered ? 1.05 : 1}],
            transition: "transform 0.2s",
        };
    };


    const Mp3ActionSheet = React.memo(() => {

        return(
            <VStack style={{width: "100%"}} justifyContent="center" alignItems={"center"}>

                <Box w="100%" h={60} marginTop={0.5} marginBottom={4} justifyContent="center" alignItems={"center"}>
                    <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                        핸드폰 내 MP3
                    </Text>
                    <Text fontSize={18} color="black" fontWeight={"bold"}>
                        파일을 선택해주세요.
                    </Text>
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
                        onPress={handleMp3Picker}
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

            </VStack>

        )
    });

    const InitializeActionSheet = React.memo (() => {

        const stressLevel = data.stressLevel;

        return(
            <VStack style={{width: "100%"}} justifyContent="center" alignItems={"center"}>

                <Box w="100%" h={60} marginTop={0.5} marginBottom={4} justifyContent="center" alignItems={"center"}>
                    <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                        스트레스 레벨 {stressLevel}
                    </Text>
                    <Text fontSize={18} color="black" fontWeight={"bold"}>
                        음원 설정 초기화 하겠습니까?
                    </Text>
                </Box>

                <HStack p={1} justifyContent="center" alignItems={"center"} marginTop={3} marginBottom={1}
                         width={"92%"}>
                    <Text color={"red.500"} fontWeight={600}> 초기화 이후 복원이 불가능합니다. </Text>
                </HStack>

                <VStack width={"92%"} marginTop={8}>
                    <Button size={"lg"} bg={"#2785F4"} onPress={handleConfirmInitialMusic}>
                        <Text fontWeight={800} fontSize={'18px'} color={"white"}>초기화 하기</Text>
                    </Button>
                </VStack>

            </VStack>

        )
    });


    return(

            <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

                <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >

                    {showMp3UploadView ? (
                        <Mp3ActionSheet />

                    ) : showInitializeView ? (

                        <>
                            <Box w="100%" h={60} marginTop={0.5} marginBottom={5} justifyContent="center" alignItems={"center"}>
                                <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                                    음원 변경 방식을
                                </Text>
                                <Text fontSize={18} color="black" fontWeight={"bold"}>
                                    선택해주세요.
                                </Text>
                            </Box>

                            <Actionsheet.Item onPress={handleMp3Button} >

                                <HStack p={1}>
                                    <HStack space={3}>
                                        <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
                                        <Text fontWeight={600}>핸드폰 내 MP3 지정</Text>
                                    </HStack>

                                </HStack>
                            </Actionsheet.Item>

                            <Actionsheet.Item onPress={handleInitialButton}>
                                <HStack p={1}>
                                    <HStack space={3} >
                                        <Ionicons name={"settings-sharp"} size={22} color={"#ADAEB3"} />
                                        <Text fontWeight={600}>설정 초기화</Text>
                                    </HStack>

                                </HStack>
                            </Actionsheet.Item>
                        </>
                    ) : (
                        <InitializeActionSheet />
                    )}
                </Actionsheet.Content>

            </Actionsheet>
    )
};

export default Music_ActionSheet;

