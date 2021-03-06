import * as React from 'react';
import Svg, { Circle, G, Mask, Path, Rect, SvgProps } from 'react-native-svg';

export const IconOngoingRequest = (props: SvgProps) => {
  return (
    <Svg
      width={116}
      height={116}
      viewBox="0 0 116 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={58} cy={58} r={57} fill="#6CE787" stroke="#6CE787" strokeWidth={2} />
      <Mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={-29} width={116} height={145}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M116-29H0v91h.136C2.19 92.167 27.312 116 58 116s55.809-23.833 57.864-54H116v-91z"
          fill="white"
        />
      </Mask>
      <G mask="url(#prefix__a)">
        <Path
          d="M22.25 31.815c0-1.057 1.237-1.632 2.045-.95l5.217 4.407c.633.535 1.51.676 2.28.368l7.265-2.906c.297-.118.627-.118.924 0l7.519 3.008c.588.235 1.248.21 1.818-.067l7.46-3.647c.33-.162.714-.169 1.05-.02l7.433 3.304c.58.258 1.242.258 1.822 0l7.47-3.32a1.243 1.243 0 011.009 0l7.208 3.204c.765.34 1.657.226 2.312-.298l5.225-4.18c.813-.65 2.019-.071 2.019.97v96.132c0 .686-.557 1.243-1.243 1.243h-67.59a1.243 1.243 0 01-1.243-1.243V31.815z"
          fill="#fff"
          stroke="#000"
        />
        <Rect
          x={30.564}
          y={112.564}
          width={25.871}
          height={3.871}
          rx={1.936}
          fill="#fff"
          stroke="#000"
          strokeWidth={0.871}
        />
        <Rect
          x={30.564}
          y={103.564}
          width={51.871}
          height={3.871}
          rx={1.936}
          fill="#fff"
          stroke="#000"
          strokeWidth={0.871}
        />
        <Rect
          x={30.564}
          y={93.564}
          width={51.871}
          height={3.871}
          rx={1.936}
          fill="#fff"
          stroke="#000"
          strokeWidth={0.871}
        />
        <Circle cx={43} cy={70} r={15} fill="#6CE787" />
        <Mask
          id="prefix__b"
          maskUnits="userSpaceOnUse"
          x={35.669}
          y={55.683}
          width={29}
          height={21}
          fill="#000"
        >
          <Path fill="#fff" d="M35.669 55.683h29v21h-29z" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M41.823 74.273c.05.155.116.305.2.446.565.949 1.714 1.149 2.566.447L62.34 60.54c.852-.702 1.086-2.041.52-2.99-.564-.95-1.713-1.15-2.566-.447L43.748 70.736l-4.204-3.464c-.853-.703-2.002-.503-2.567.447-.565.949-.331 2.288.521 2.99l4.325 3.564z"
          />
        </Mask>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M41.823 74.273c.05.155.116.305.2.446.565.949 1.714 1.149 2.566.447L62.34 60.54c.852-.702 1.086-2.041.52-2.99-.564-.95-1.713-1.15-2.566-.447L43.748 70.736l-4.204-3.464c-.853-.703-2.002-.503-2.567.447-.565.949-.331 2.288.521 2.99l4.325 3.564z"
          fill="#fff"
        />
        <Path
          d="M42.023 74.719l.749-.446-.75.446zm-.2-.446l.83-.264-.077-.245-.199-.164-.554.673zm2.766.893l.554.672-.554-.672zM62.34 60.54l-.554-.672.554.672zm.52-2.99l.75-.446-.75.446zm-2.566-.447l.555.672-.554-.672zM43.748 70.736l-.554.672.554.457.554-.457-.554-.672zm-4.204-3.464l-.555.672.555-.672zm-2.567.447l.75.445-.75-.445zm.521 2.99l.554-.672-.554.672zm5.274 3.564a1.273 1.273 0 01-.118-.264l-1.661.528c.068.215.161.427.28.627l1.499-.89zm1.263.22c-.44.363-.972.27-1.263-.22l-1.498.891c.838 1.409 2.605 1.716 3.87.674l-1.11-1.345zm17.75-14.625l-17.75 14.625 1.108 1.345 17.751-14.625-1.108-1.345zm.327-1.873c.345.58.194 1.444-.326 1.873l1.108 1.345c1.185-.976 1.5-2.79.716-4.109l-1.498.891zm-1.263-.22c.44-.362.971-.27 1.263.22l1.498-.89c-.838-1.409-2.605-1.717-3.87-.675l1.109 1.345zM44.302 71.408L60.85 57.775 59.74 56.43 43.194 70.063l1.108 1.345zm-5.313-3.464l4.205 3.464 1.108-1.345-4.204-3.464-1.109 1.345zm-1.263.22c.292-.49.823-.582 1.263-.22l1.109-1.345c-1.265-1.042-3.032-.734-3.87.674l1.498.891zm.326 1.873c-.52-.43-.67-1.293-.326-1.873l-1.498-.89c-.785 1.318-.469 3.132.716 4.108l1.108-1.345zm4.325 3.563l-4.325-3.563-1.108 1.345 4.325 3.563 1.108-1.345z"
          fill="#000"
          mask="url(#prefix__b)"
        />
      </G>
    </Svg>
  );
};
