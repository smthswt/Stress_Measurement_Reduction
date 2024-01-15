import {Actionsheet, Box, Button, HStack, Pressable, Text, View, VStack} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";


const Music_ActionSheet = ({onOpen, onClose, isOpen, data}) => {
    const [showMp3UploadView, setShowMp3UploadView] = useState(false);
    const [showInitializeView, setShowInitializeView] = useState(true);

    const handleMp3Button = () => {
        console.log("핸드폰 내 Mp3 지정 버튼 클릭")
        setShowMp3UploadView(true);
    };

    const handleInitialButton = () => {
        console.log("설정 초기화 버튼 클릭")
        setShowInitializeView(false);
    };

    const handleFindMp3File = () => {
        console.log("핸드폰 내 Mp3 파일 찾기")
    };

    const handleUploadMusic = () => {
        console.log("업로드 할 핸드폰 내 파일을 선택해주세요. 선택 완료.")
    };

    const handleInitialMusicList = () => {
        console.log("음원 리스트. 초기화 완료.")
    };

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


                <Pressable
                    onPress={handleFindMp3File}
                    width={"92%"}
                    alignItems={'center'}
                    justifyContent={'center'}
                    bg={(props) =>
                        props.isPressed ? "blue.200" : props.isHovered ? "blue.100" : "blue.50"}>
                    {({ isPressed, isHovered }) => (
                        <HStack p={1} justifyContent="center" alignItems={"center"} marginTop={2}
                                bgColor={"#F5F5F6"} marginBottom={1} borderColor={"#E6E6E7"} borderRadius={3}
                                borderWidth={1} height={"120px"} width={"100%"}
                            style={pressableStyle(isPressed, isHovered)}>

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
                    <Button size={"lg"} bg={"#2785F4"} onPress={handleInitialMusicList}>
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

