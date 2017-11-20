import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    Dimensions, StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from './../Strings/LocalizedStrings';
import {colors} from '../Utils/Consts';
import BackgroundTask from 'react-native-background-task';
import {DataBase} from '../Utils/DataBase';
import {backgroundBattery} from './Battery';
import {backgroundTaskForMemory} from './Memory';

BackgroundTask.define(() => {
    let battery = backgroundBattery();
    let memory = backgroundTaskForMemory();

    DataBase.writeAll(
        battery.status === 'Charging',
        new Date(),
        'afk',
        memory.totalStorage,
        memory.freeStorage,
        memory.totalRam,
        memory.freeRam,
    );

    BackgroundTask.finish();
});

export class StartScreen extends Component {
    constructor(props) {
        super(props);

        let realm = new Realm();
        realm.write(() => {
            realm.deleteAll();
        });

        BackgroundTask.schedule({period: 900});
        strings.setLanguage('en');
    }

    onPress() {
        Actions.reset('Root');
    }

    render() {
        let img = require('../../src/logo.png');
        return (
            <View style={styles.grouping}>
                <StatusBar backgroundColor={colors.cardBackgroundColor} barStyle='light-content' />
                <View style={styles.imageBox}>
                    <Image
                        style={styles.image}
                        source={img}
                        resizeMode='stretch'
                    />
                </View>
                <View
                    style={{flex: 1, justifyContent: 'center'}}
                >
                    <TouchableHighlight
                        style={styles.buttonBox}
                        onPress={() => this.onPress()}
                        underlayColor={'transparent'}
                    >
                        <Text style={styles.textStyle}> {strings.start} </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageBox: {
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 25,
        flex: 1,
    },

    image:{
        height: 300,
        width: 300,
    },

    buttonBox: {
        backgroundColor: colors.cardBackgroundColor,
    },

    grouping: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainBackgroundColor,
    },

    textStyle:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    }
});