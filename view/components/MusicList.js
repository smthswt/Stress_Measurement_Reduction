import {
    Button,
    Center,
    HStack,
    ScrollView,
    Text,
    useDisclose,
    View,
    VStack,
    Actionsheet,
    Box,
    Icon,
    FlatList
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {useNavigation} from "@react-navigation/native";



export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const  IsButton = () => {
        console.log("button is pressed23")
    };

    const navigation = useNavigation();

// const navigateToSubPage = () => {
//     onClose(); // 액션시트를 닫습니다.
//     navigation.navigate(SubPage); // SubPage로 이동합니다. SubPage는 React Navigation 스택 내에서 정의되어 있어야 합니다.
// };



    const Music_ActionSheet = () => {
        return(
            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <Actionsheet.Content paddingBottom={5} paddingTop={3} justifyContent={"center"} alignItems={"center"}>
                    <Box w="100%" h={60} px={4} marginBottom={5} justifyContent="center" alignItems={"center"}>
                        <Text fontSize="17" color="black" fontWeight={"bold"} lineHeight={32}>
                            음원 변경 방식을
                        </Text>
                        <Text fontSize="17" color="black" fontWeight={"bold"}>
                            선택해주세요.
                        </Text>
                    </Box>

                    <Actionsheet.Item onPress={IsButton}
                        // onPress={navigation.navigate('MovetoNextActionSheetPage')}
                    >
                        <HStack p={1}>
                            <HStack space={3}>
                                <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
                                <Text fontWeight={600}>핸드폰 내 MP3 지정</Text>
                            </HStack>
                            {/*<HStack justifyContent={"flex-end"}>*/}
                            {/*    <MaterialIcons name={"arrow-forward-ios"} size={22} color={"#222222"} />*/}
                            {/*</HStack>*/}
                        </HStack>
                    </Actionsheet.Item>

                    <Actionsheet.Item onPress={IsButton}>
                        <HStack p={1}>
                            <HStack space={3} >
                                <Ionicons name={"settings-sharp"} size={22} color={"#ADAEB3"} />
                                <Text fontWeight={600}>설정 초기화</Text>
                            </HStack>
                            {/*    <HStack justifyContent={"flex-end"}>*/}
                            {/*<MaterialIcons name={"arrow-forward-ios"} size={22} color={"#222222"} marginRight={1}/>*/}
                            {/*    </HStack>*/}
                        </HStack>
                    </Actionsheet.Item>

                </Actionsheet.Content>
            </Actionsheet>
        )
    };

    const music_icon = <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
    const folderMusic_icon = <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />


    const data = [{
        id: "david's song number 1",
        musicType : music_icon,
        stressLevel : 1,
        nameOfSong : "J.S Bach - Air on the G String",
    }, {
        id: "david's song number 2",
        musicType : music_icon,
        stressLevel : 2,
        nameOfSong : "Maroon 5 - Memories",
    }, {
        id: "david's song number 3",
        musicType : music_icon,
        stressLevel : 3,
        nameOfSong : "Adele - Rolling in the Deep",
    }, {
        id: "david's song number 4",
        musicType : folderMusic_icon,
        stressLevel : 4,
        nameOfSong : "Sleepy Fish - Butterfly",
    }, {
        id: "david's song number 5",
        musicType : folderMusic_icon,
        stressLevel : 5,
        nameOfSong : "Mariah Carey - All I Want for Christmas Is You",
    },
    ]

    return(
        <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20, }}>

            {/*<Center width={"100%"} backgroundColor={'white'} paddingY={5}>*/}
            {/*    <VStack space={3} width={"96%"} alignItems={"center"} justifyContent={'center'}>*/}

                    <FlatList data={data}
                              keyExtractor={(item) => item.id}
                              renderItem={({item}) => (

                                  <Center width={"100%"} backgroundColor={'white'} paddingY={2} paddingX={1}>
                        <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>

                            <HStack space={6} margin={2} width={"72%"} alignItems={"center"} justifyContent={'flex-start'}>
                                {item.musicType}

                                <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                    <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 {item.stressLevel}</Text>
                                    <Text color={"#616161"}>{item.nameOfSong}</Text>
                                </VStack>

                            </HStack>
                            <Button variant={"unstyled"} onPress={onOpen}>
                                <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                    <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
                                </View>
                                <Music_ActionSheet />
                            </Button>

                        </HStack>

                                  </Center>

                              )}
                              />



            {/*    </VStack>*/}
            {/*</Center>*/}
        </ScrollView>
    );
};









//
// return(
//     <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20, }}>
//
//         <Center width={"100%"} backgroundColor={'white'} paddingY={5}>
//             <VStack space={3} width={"96%"} alignItems={"center"} justifyContent={'center'}>
//
//                 <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
//                     <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
//                         <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
//                         <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
//                             <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 1</Text>
//                             <Text color={"#616161"}>J.S Bach - Air on the G String</Text>
//                         </VStack>
//                     </HStack>
//                     <Button variant={"unstyled"} onPress={onOpen}>
//                         <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
//                             <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
//                         </View>
//                         <Music_ActionSheet onPress={onOpen} />
//                     </Button>
//                 </HStack>
//
//                 <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
//                     <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
//                         <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
//                         <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
//                             <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 2</Text>
//                             <Text color={"#616161"}>Maroon 5 - Memories</Text>
//                         </VStack>
//                     </HStack>
//                     <Button variant={"unstyled"} onPress={onOpen}>
//                         <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
//                             <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
//                         </View>
//                     </Button>
//                 </HStack>
//
//                 <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
//                     <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
//                         <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
//                         <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
//                             <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 3</Text>
//                             <Text color={"#616161"}>Adele - Rolling in the Deep</Text>
//                         </VStack>
//                     </HStack>
//                     <Button variant={"unstyled"} onPress={onOpen}>
//                         <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
//                             <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
//                         </View>
//                     </Button>
//                 </HStack>
//
//                 <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
//                     <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
//                         <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
//                         <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
//                             <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 4</Text>
//                             <Text color={"#616161"}>Sleepy Fish - Butterfly</Text>
//                         </VStack>
//                     </HStack>
//                     <Button variant={"unstyled"} onPress={onOpen}>
//                         <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
//                             <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
//                         </View>
//                     </Button>
//                 </HStack>
//
//                 <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
//                     <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
//                         <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
//                         <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
//                             <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 5</Text>
//                             <Text color={"#616161"}>Marian Carey - All i Want for</Text>
//                         </VStack>
//                     </HStack>
//                     <Button variant={"unstyled"} onPress={onOpen}>
//                         <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
//                             <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
//                         </View>
//                     </Button>
//                 </HStack>
//
//             </VStack>
//         </Center>
//     </ScrollView>
// );
// };

