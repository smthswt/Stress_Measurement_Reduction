import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml =`
<svg viewBox="0 0 320 69" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.2" y="18.2571" width="8" height="58.9714" rx="4" fill="url(#paint0_linear_1_1727)"/>
<rect opacity="0.2" x="312" y="31.5144" width="8" height="45.7143" rx="4" fill="url(#paint1_linear_1_1727)"/>
<rect opacity="0.2" x="24" y="38.3713" width="8" height="18.7429" rx="4" fill="url(#paint2_linear_1_1727)"/>
<rect opacity="0.2" x="48" y="25.5715" width="8" height="44.3429" rx="4" fill="url(#paint3_linear_1_1727)"/>
<rect opacity="0.2" x="72" y="40.2" width="8" height="34.2857" rx="4" fill="url(#paint4_linear_1_1727)"/>
<rect opacity="0.2" x="96" y="31.5144" width="8" height="45.7143" rx="4" fill="url(#paint5_linear_1_1727)"/>
<rect opacity="0.2" x="120" y="32.8857" width="8" height="44.3429" rx="4" fill="url(#paint6_linear_1_1727)"/>
<rect opacity="0.2" x="144" y="52.543" width="8" height="24.6857" rx="4" fill="url(#paint7_linear_1_1727)"/>
<rect opacity="0.2" x="168" y="0.885742" width="8" height="76.3429" rx="4" fill="url(#paint8_linear_1_1727)"/>
<rect opacity="0.2" x="192" y="61.6858" width="8" height="15.5429" rx="4" fill="url(#paint9_linear_1_1727)"/>
<rect opacity="0.2" x="216" y="32.8857" width="8" height="44.3429" rx="4" fill="url(#paint10_linear_1_1727)"/>
<rect opacity="0.2" x="240" y="63.5144" width="8" height="13.7143" rx="4" fill="url(#paint11_linear_1_1727)"/>
<rect opacity="0.2" x="264" y="36.543" width="8" height="40.6857" rx="4" fill="url(#paint12_linear_1_1727)"/>
<rect opacity="0.2" x="288" y="64.8857" width="8" height="12.3429" rx="4" fill="url(#paint13_linear_1_1727)"/>
<defs>
<linearGradient id="paint0_linear_1_1727" x1="4" y1="18.2571" x2="4" y2="77.2285" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_1_1727" x1="316" y1="31.5144" x2="316" y2="77.2287" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_1_1727" x1="28" y1="38.3713" x2="28" y2="57.1142" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_1_1727" x1="52" y1="25.5715" x2="52" y2="69.9144" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_1_1727" x1="76" y1="40.2" x2="76" y2="74.4857" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_1_1727" x1="100" y1="31.5144" x2="100" y2="77.2287" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint6_linear_1_1727" x1="124" y1="32.8857" x2="124" y2="77.2286" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint7_linear_1_1727" x1="148" y1="52.543" x2="148" y2="77.2287" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint8_linear_1_1727" x1="172" y1="0.885742" x2="172" y2="77.2286" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint9_linear_1_1727" x1="196" y1="61.6858" x2="196" y2="77.2286" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint10_linear_1_1727" x1="220" y1="32.8857" x2="220" y2="77.2286" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint11_linear_1_1727" x1="244" y1="63.5144" x2="244" y2="77.2287" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint12_linear_1_1727" x1="268" y1="36.543" x2="268" y2="77.2287" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint13_linear_1_1727" x1="292" y1="64.8857" x2="292" y2="77.2286" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
`

const HomeBarWave = ({width, height}) => {
    return (
        <SvgXml xml={xml} width={width} height={height}/>
    )
}
export default HomeBarWave;
