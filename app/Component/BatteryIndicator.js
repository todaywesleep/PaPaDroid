import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    DeviceEventEmitter,
    NativeModules, Image,
} from 'react-native';
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";
import {observer} from 'mobx-react';
import {observable, computed} from "mobx";

@observer
export class BatteryIndicator extends Component {
    @observable path;
    @observable image;

    constructor(props) {
        super(props);

        this.percentage = props.percentage;
    }

    getImageFrom() {
        let path;
        let percentage = this.props.refresh();

        switch (percentage) {
            case percentage > 90 && percentage < 100:
                path = require('../../src/pics/battery/battery10.png');
                break;
        }

        return <Image source={path}/>
    }
}