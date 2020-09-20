import { Dimensions } from 'react-native';

export default function () {
  const { height } = Dimensions.get('window');
  return height > 700;
}
