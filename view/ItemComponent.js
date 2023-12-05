import {Box, HStack, Progress, Text, VStack} from "native-base";
import React from "react";

export const ItemComponent = ({stressIndex, sdnn, hr}) => {
    // 현재 날짜와 시간을 가져옵니다.
    const now = new Date();

    // 날짜와 시간을 원하는 형식의 문자열로 변환합니다.

    // 'YYYY-MM-DD' 형식으로 날짜
    const dateString = now.toISOString().split('T')[0];
    // 'HH:MM:SS' 형식으로 시간
    const timeString = now.toTimeString().split(' ')[0];

    return (
        <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
            <VStack>
                <Text fontWeight={'bold'}>{dateString} {timeString}</Text>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>HR (BPM)</Text>
                    <Progress flex={1} colorScheme="secondary" shadow={0} value={hr} min={0} max={200}/>
                    <Text w={"5%"} textAlign={'right'}>{hr}</Text>
                </HStack>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>SDNN</Text>
                    <Progress flex={1} colorScheme="secondary" shadow={0} value={sdnn} min={0} max={300}/>
                    <Text w={"5%"} textAlign={'right'}>{parseFloat(sdnn).toFixed(2)}</Text>
                </HStack>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>Stress Level</Text>
                    <Progress flex={1} colorScheme={"emerald"} shadow={0} value={stressIndex} min={0} max={5}/>
                    <Text w={"5%"} textAlign={'right'}>{stressIndex}</Text>
                </HStack>
            </VStack>
        </Box>
    );
}