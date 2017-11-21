import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    Dimensions,
    StatusBar,
    Modal,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from './../Strings/LocalizedStrings';
import {colors} from '../Utils/Consts';
import BackgroundTask from 'react-native-background-task';
import {DataBase} from '../Utils/DataBase';
import {backgroundBattery} from './Battery';
import {backgroundTaskForMemory} from './Memory';
import Application from "../../App";

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

        // let realm = new Realm();
        // realm.write(() => {
        //     realm.deleteAll();
        // });

        BackgroundTask.schedule({period: 900});
        this.state = {
            modalVisible: false
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onPress() {
        Actions.reset('Root');
    }

    render() {
        let img = require('../../src/logo.png');
        return (
            <View style={styles.grouping}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}
                >
                    <TouchableHighlight style={{flex: 1}} onPress={() => {
                        this.setModalVisible(false)
                    }}>
                        <View style={{flex: 1}}/>
                    </TouchableHighlight>

                    <View>
                        <TouchableHighlight
                            style={styles.buttonBox}
                            onPress={() => {
                                strings.setLanguage('en');
                                this.setModalVisible(false);
                                Application.upd();
                                this.forceUpdate();
                            }}
                            underlayColor={colors.cardBackgroundColor}
                        >
                            <Text style={styles.textStyle}> {strings.en} </Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={styles.buttonBox}
                            onPress={() => {
                                strings.setLanguage('ru');
                                this.setModalVisible(false);
                                Application.upd();
                                this.forceUpdate();
                            }}
                            underlayColor={colors.cardBackgroundColor}
                        >
                            <Text style={styles.textStyle}> {strings.ru} </Text>
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight style={{flex: 1}} onPress={() => {
                        this.setModalVisible(false)
                    }}>
                        <View style={{flex: 1}}/>
                    </TouchableHighlight>
                </Modal>

                <StatusBar backgroundColor={colors.cardBackgroundColor} barStyle='light-content'/>
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
                        underlayColor={colors.cardBackgroundColor}
                    >
                        <Text style={styles.textStyle}> {strings.start} </Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.buttonBox}
                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        underlayColor={colors.cardBackgroundColor}
                    >
                        <Text style={styles.textStyle}> {strings.changeLanguage} </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        flex: 1,
    },

    image: {
        height: 300,
        width: 300,
    },

    buttonBox: {
        backgroundColor: colors.cardBackgroundColor,
        marginBottom: 20,
    },

    grouping: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainBackgroundColor,
    },

    textStyle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    }
});