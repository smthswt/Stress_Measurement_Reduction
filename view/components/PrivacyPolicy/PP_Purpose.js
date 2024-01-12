import React from "react";
import Tab from "native-base/src/components/composites/Tabs/Tab";
import {HStack, ScrollView, Text, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PP_Purpose = ({navigation}) => {

    return(
        <VStack flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>개인정보의 처리 목적</Text>
            </HStack>

            <View m={6} backgroundColor={'white'} shadow={2}>
                {/*<ScrollView m={6} backgroundColor={'white'} shadow={2}>*/}
                <VStack space={5} p={5}>
        <Text id={'title'} fontSize={16} fontWeight={'bold'} letterSpacing={0.5}>
        개인정보의 처리 목적
        </Text>
                    <Text id={"body"} fontSize={14}>
                        RENST는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                        이용 목적이 변경된 경우에는 [ 개인정보 보호법 ] 제 18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                    </Text>
                    <Text id={"body2"} fontSize={14}>
                        1. 홈페이지 회원 가입 및 관리 {'\n'}
                        회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별, 인증, 회원자격 유지, 관리, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시
                        법정 대리인의 동의여부 확인, 각종 고지,통지, 고충처리 목적으로 개인정보를 처리합니다.
                    </Text>
                    <Text id={"body3"} fontSize={14}>
                        2. 재화 또는 서비스 제공 {'\n'}
                        물품배송, 서비스 제공, 계약서,청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제 정산, 채권추심을 목적으로 개인정보를 처리합니다.
                    </Text>
                    <Text id={"body4"} fontSize={14}>
                        3. 고충처리 {'\n'}
                        민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락 통지, 처리결과 통보 목적으로 개인정보를 처리합니다.
                    </Text>



                </VStack>
            </View>

        </VStack>
    )
};