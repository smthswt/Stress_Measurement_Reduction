import React from "react";
import Tab from "native-base/src/components/composites/Tabs/Tab";
import {HStack, ScrollView, Text, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PP_delegation = ({navigation}) => {

    return(
        <VStack flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>개인정보의 처리의 위탁에 관한 사항</Text>
            </HStack>

            <View m={6} backgroundColor={'white'} shadow={2}>
                {/*<ScrollView m={6} backgroundColor={'white'} shadow={2}>*/}
                <VStack space={5} p={5}>
                    <Text id={'title'} fontSize={16} fontWeight={'bold'} letterSpacing={0.5}>
                        개인정보의 처리의 위탁에 관한 사항
                    </Text>
                    <Text id={"body"} fontSize={14}>
                        RENST는 다음의 목적을 위하여 개인정보를 처리합니다. //내용 필요
                    </Text>



                </VStack>
            </View>

        </VStack>
    )
};