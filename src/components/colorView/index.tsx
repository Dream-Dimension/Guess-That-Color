import { useWindowDimensions, View } from 'react-native';
import { ColorRGB, rgbToHex } from 'src/utils/colors';

type Props = {
    color:ColorRGB;
};

const SWATCH_SIZE = 80;
export default function ColorView ({ color }: Props) {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const idealSize = Math.min(windowHeight * 0.15, windowWidth * 0.30);
    const size = Math.max(SWATCH_SIZE, idealSize);
    return <View
        style={{
            backgroundColor: rgbToHex(color),
            borderRadius: size,
            width: size,
            height: size,
            // Shadow :
            // elevation: 8, // android shadow fix, works but gets in the way in
            // ios + web
            shadowColor: '#171717',
            shadowOffset: {width: 4, height: 9},
            shadowOpacity: 0.2,
            shadowRadius: 3,
        }}
    />
};