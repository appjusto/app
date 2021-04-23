import * as React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';

export const IconShareBig = (props: SvgProps) => {
  return (
    <Svg width={114} height={114} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={57} cy={57} r={57} fill="#F6F6F6" />
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M43.385 73.336L32.397 55.238a4 4 0 01.208-4.461l16.054-21.612c1.672-2.25 5.08-2.127 6.586.238L77.37 64.169c1.525 2.396.135 5.575-2.66 6.083l-27.19 4.943a4 4 0 01-4.134-1.86z"
          fill="#FFE493"
        />
        <Path
          d="M38.866 67.09a1.524 1.524 0 10-1.525-2.639 1.524 1.524 0 001.525 2.64z"
          fill="#000"
        />
        <Path
          d="M32.623 77.605l7.672 13.29c1.655 2.87 5.38 3.933 8.324 2.23a6.091 6.091 0 002.23-8.324l-4.57-7.917 3.958-2.285a1.524 1.524 0 00.557-2.081l-1.98-3.432 29.18-5.723c3.385-.184 5.414-3.887 3.704-6.848l-5.063-8.77 3.235-4.9a1.524 1.524 0 00.048-1.601l-3.047-5.278a1.527 1.527 0 00-1.41-.758l-5.862.351-5.62-9.735a4.53 4.53 0 00-3.901-2.285h-.059a4.53 4.53 0 00-3.847 2.107L36.27 50.998l-12.938 7.47c-5.089 2.936-6.852 9.464-3.904 14.567 2.694 4.665 8.372 6.5 13.194 4.57zm15.588 8.72a3.045 3.045 0 01-1.116 4.161 3.05 3.05 0 01-4.162-1.115l-7.617-13.195 5.277-3.047 7.618 13.196zm-3.456-12.08l-1.523-2.64 2.639-1.523 1.523 2.64-2.639 1.523zm29.948-35.94l2.106 3.647-1.878 2.843-3.629-6.286 3.401-.204zM58.72 27.316a1.49 1.49 0 011.32-.73c.26.002.908.083 1.3.76l17.719 30.692c.577 1-.124 2.256-1.282 2.284-.208.005-.303.043-.835.142L58.198 27.999c.393-.506.444-.555.522-.683zm-2.55 3.265l17.611 30.503-26.578 5.213L39.122 52.3 56.17 30.58zm-34.102 40.93a7.606 7.606 0 01-1.022-3.8 7.646 7.646 0 013.81-6.605l11.874-6.855 7.617 13.193L32.473 74.3c-3.638 2.1-8.305.849-10.405-2.789z"
          fill="#000"
        />
        <Path
          d="M34.147 68.056a1.524 1.524 0 00-2.081-.557l-2.64 1.523c-.726.42-1.66.17-2.08-.558a1.524 1.524 0 00-2.639 1.524 4.576 4.576 0 006.243 1.673l2.639-1.524c.728-.42.978-1.352.558-2.08zm59.589-41.259l-8.49 4.724a1.524 1.524 0 001.483 2.663l8.488-4.724a1.523 1.523 0 10-1.481-2.663zm-.89 15.779l-5.886-1.577a1.523 1.523 0 10-.789 2.942l5.887 1.577a1.523 1.523 0 10.788-2.942zM78.055 21.262l-1.579 5.887a1.524 1.524 0 002.944.79l1.578-5.887a1.523 1.523 0 10-2.943-.79z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" transform="translate(18 18)" d="M0 0h78v78H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};