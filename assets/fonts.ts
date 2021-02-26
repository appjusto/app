import { Feather, MaterialIcons } from '@expo/vector-icons';
const BarlowBold = require('./fonts/Barlow-Bold.ttf');
const BarlowMedium = require('./fonts/Barlow-Medium.ttf');

export default {
  BarlowMedium,
  BarlowBold,
  ...Feather.font,
  ...MaterialIcons.font,
};
