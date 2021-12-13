import { Component } from 'react';
import { Keyboard } from 'react-native';

export var keyboardStatus = "0";

export class KeyboardListener extends Component {

    componentWillMount() {
        Keyboard.addListener('keyboardDidShow', (e) => {
            keyboardStatus = "1";
            //alert(e.endCoordinates.height);
        });
        Keyboard.addListener('keyboardDidHide', () => {
            keyboardStatus = "0";
        })
    }

    componentWillUnmount() {
        Keyboard.removeAllListeners;
    }

    render() {
        return false;
    }
}

export default KeyboardListener;

