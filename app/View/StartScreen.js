import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    StatusBar,
    Modal,
    Animated
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {strings} from './../Strings/LocalizedStrings';
import {colors} from '../Utils/Consts';
import {DataBase} from '../Utils/DataBase';
import Application from "../../App";
import {observer} from 'mobx-react';
import {observable} from "mobx";
import {LoadingView} from "./LoadingView";

export class StartScreen extends Component {
    constructor(props) {
        super(props);

        let realm = new Realm();
        realm.write(() => {
            realm.deleteAll();
        });

        this.state = {
            modalVisible: false,
            startMargin: new Animated.Value(0),
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentWillMount() {
        this.cycleAnimation();
    }

    cycleAnimation() {
        Animated.sequence([
            Animated.timing(this.state.startMargin, {
                toValue: 25,
                duration: 1000,
            }),
            Animated.timing(this.state.startMargin, {
                toValue: 0,
                duration: 1000
            })
        ]).start(() => {
            this.cycleAnimation();
        });
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
                <View style={[styles.imageBox]}>
                    <Animated.Image
                        style={[styles.image, {marginTop: this.state.startMargin}]}
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
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: 25,
    },

    imageBox: {
        justifyContent: 'center',
        alignItems: 'center',
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