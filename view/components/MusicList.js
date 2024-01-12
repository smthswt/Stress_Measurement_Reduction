import {
    Button,
    Center,
    HStack,
    Text,
    useDisclose,
    View,
    VStack,
    FlatList
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import Music_ActionSheet from "./MusicActionSheet";


export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();

    const music_icon = <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
    const folderMusic_icon = <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />


    const data = [{
        id: "song number 1",
        musicType : music_icon,
        stressLevel : 1,
        Song : "Air on the G String",
        Artist : "J.S Bach",
    }, {
        id: "song number 2",
        musicType : music_icon,
        stressLevel : 2,
        Song : "Memories",
        Artist : "Maroon",
    }, {
        id: "song number 3",
        musicType : music_icon,
        stressLevel : 3,
        Song : "Rolling in the Deep",
        Artist : "Adele",
    }, {
        id: "song number 4",
        musicType : folderMusic_icon,
        stressLevel : 4,
        Song : "All I Want for Christmas Is You",
        Artist : "Mariah Carey",
    },
    ]

    return (
        // <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20}}>
        <VStack p={5} flex={1}>

            <View width={"100%"} shadow={2} backgroundColor={'white'}>
                <FlatList showsVerticalScrollIndicator={false}
                          data={data}
                          keyExtractor={(item) => item.id}
                          renderItem={({item}) => (

                              <Center flex={1} backgroundColor={'white'} paddingY={2} paddingX={1}>
                                  <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>

                                      <HStack space={6} margin={2} width={"70%"} alignItems={"center"} justifyContent={'flex-start'}>
                                          {item.musicType}
                                          <VStack space={1.5} alignItems={'flex-start'} justifyContent={'center'}>
                                              <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 {item.stressLevel}</Text>
                                              <Text color={"#616161"}>{item.Artist} - {item.Song}</Text>
                                          </VStack>
                                      </HStack>

                                      <Button variant={"unstyled"} onPress={onOpen}>
                                          <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                              <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
                                          </View>
                                          <Music_ActionSheet onOpen={onOpen} onClose={onClose} isOpen={isOpen} data={item}/>
                                      </Button>

                                  </HStack>
                              </Center>
                          )}
                />
            </View>
        </VStack>

    );
};

