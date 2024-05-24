import {Box, Image, Pressable, Text, VStack, HStack, Center} from "native-base";
import StressResultsImage from "../images/AllStress.png";
import React from "react";
import SemiCircleProgress from "./SemiCirle";
import {useBLE} from "../module/BLEProvider";


export const StressSemiCircle = ({sdnns}) => {
    // const {getSDNN} = useBLE();
    //
    // const number = getSDNN()
    // const sdnnValue = Math.trunc(number)
    // console.log("sdnn value: ", sdnnValue)

    return (
        <VStack flex={1}>
            <Box>
                <VStack alignItems={"center"} justifyContent={"center"} bg={"white"}
                        shadow={2} p={3}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Text bold fontSize={"lg"}>스트레스 인덱스</Text>
                        <Text bold fontSize={"lg"}>SDNN값</Text>
                    </HStack>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Text fontSize={12} color={"#616161"}>스트레스 정보에요</Text>
                        <Text fontSize={12} color={"#616161"}>스트레스 인덱스</Text>
                    </HStack>
                    <HStack alignItems={'center'} justifyContent={'flex-start'} width={"100%"}>
                        <Text fontSize={12} color={"#616161"}>정정 수치 56~80</Text>
                    </HStack>

                    <Center pb={5}>
                        <SemiCircleProgress
                            progressColor={'#2785F4'}
                            progressWidth={15}
                            // initialPercentage={0}
                            minValue={0}
                            maxValue={1000}
                            currentValue={400} //sdnn
                        >
                            <Text bold fontSize={'3xl'} mb={2}>
                                79
                            </Text>
                        </SemiCircleProgress>
                    </Center>

                </VStack>
            </Box>
        </VStack>
    );
};