import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg viewBox="0 0 92 97" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="10" width="38" height="46" rx="2" transform="rotate(-15 0 10)" fill="#59BCFF"/>
<path d="M14.1849 21.1275C14.1358 20.9442 14.1616 20.7489 14.2566 20.5846C14.3515 20.4203 14.5079 20.3005 14.6912 20.2514C14.8745 20.2024 15.0698 20.2282 15.2341 20.3232C15.3984 20.4181 15.5182 20.5744 15.5672 20.7578L19.4491 35.2727L33.9641 31.3908C34.1474 31.3418 34.3427 31.3676 34.507 31.4626C34.6713 31.5575 34.7911 31.7138 34.8402 31.8972C34.8892 32.0805 34.8634 32.2758 34.7684 32.44C34.6735 32.6043 34.5171 32.7242 34.3338 32.7732L19.1277 36.84C18.9443 36.889 18.7491 36.8632 18.5848 36.7682C18.4205 36.6733 18.3006 36.5169 18.2516 36.3336L14.1849 21.1275ZM30.1304 19.8255C30.0961 19.6971 30.0267 19.5808 29.93 19.4897C29.8333 19.3985 29.7132 19.3361 29.583 19.3094C29.4528 19.2827 29.3178 19.2928 29.1931 19.3385C29.0683 19.3842 28.9587 19.4638 28.8766 19.5683L24.7509 24.8192L20.6769 23.6908C20.5621 23.6589 20.4411 23.6562 20.3249 23.683C20.2088 23.7097 20.1011 23.7651 20.0118 23.844L17.8841 25.7284L20.1243 34.1047L33.0265 30.6541L30.1304 19.8255Z" fill="white"/>
<g filter="url(#filter0_di_470_2749)">
<rect x="34" y="16" width="50" height="62" rx="2" transform="rotate(9 34 16)" fill="#2785F4"/>
</g>
<path d="M43.8163 36.9526C43.8603 36.6999 44.0028 36.4751 44.2126 36.3276C44.4223 36.1801 44.6821 36.1219 44.9348 36.1659C45.1874 36.2099 45.4122 36.3525 45.5597 36.5623C45.7073 36.772 45.7654 37.0318 45.7214 37.2844L42.237 57.2885L62.2411 60.7729C62.4937 60.8169 62.7185 60.9595 62.8661 61.1692C63.0136 61.379 63.0717 61.6387 63.0277 61.8914C62.9837 62.144 62.8412 62.3688 62.6314 62.5164C62.4217 62.6639 62.1619 62.722 61.9092 62.678L40.9526 59.0277C40.7 58.9837 40.4751 58.8412 40.3276 58.6314C40.1801 58.4216 40.1219 58.1619 40.1659 57.9092L43.8163 36.9526ZM64.1092 44.4132C64.14 44.2363 64.121 44.0543 64.0542 43.8876C63.9874 43.7209 63.8755 43.5761 63.731 43.4695C63.5866 43.3628 63.4153 43.2984 63.2363 43.2836C63.0574 43.2688 62.8778 43.3042 62.7178 43.3857L54.6761 47.4812L50.3212 43.7834C50.1985 43.6791 50.0516 43.6071 49.894 43.5739C49.7364 43.5407 49.573 43.5475 49.4186 43.5935L45.7391 44.6957L43.7283 56.2396L61.5097 59.3369L64.1092 44.4132Z" fill="white"/>
<defs>
<filter id="filter0_di_470_2749" x="16.589" y="12.2878" width="74.5074" height="84.4827" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_470_2749"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_470_2749" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-1" dy="-1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_470_2749"/>
</filter>
</defs>
</svg>`

export default AllResultsIcon = ({width, height}) => {
    return (
        <SvgXml xml={xml} width={width} height={height}/>
    )
}
