import React from 'react';
import { Image } from 'react-native';
import { VRAlimentacaoIcon } from '../../icons';

export const VRAlimentacao = () => <Image source={VRAlimentacaoIcon} />;

// import * as React from 'react';
// import Svg, { Defs, Image, Path, Pattern, Rect, SvgProps, Use } from 'react-native-svg';

// export const VRAlimentacao = (props: SvgProps) => {
//   return (
//     <Svg
//       xmlns="http://www.w3.org/2000/svg"
//       xmlnsXlink="http://www.w3.org/1999/xlink"
//       width={40}
//       height={24}
//       fill="none"
//       {...props}
//     >
//       <Rect width={39.46} height={23.46} x={0.27} y={0.27} fill="#fff" rx={3.73} />
//       <Path fill="url(#a)" d="M11 4h18.255v16H11z" />
//       <Rect
//         width={39.46}
//         height={23.46}
//         x={0.27}
//         y={0.27}
//         stroke="#D9D9D9"
//         strokeWidth={0.54}
//         rx={3.73}
//       />
//       <Defs>
//         <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
//           <Use xlinkHref="#b" transform="scale(.00588 .00671)" />
//         </Pattern>
//         <Image
//           xlinkHref="data:image/png;base64,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"
//           id="b"
//           width={170}
//           height={149}
//         />
//       </Defs>
//     </Svg>
//   );
// };