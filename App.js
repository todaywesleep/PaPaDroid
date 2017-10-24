import React, {Component} from 'react';
import {MainScreen} from "./app/View/MainScreen";
import {Router, Stack, Scene, Tabs, Drawer} from "react-native-router-flux";
import {Image, StyleSheet} from "react-native";

export default Application = () => (
    <Router>
        <Scene key={"Root"}>
            <Drawer contentComponent={MainScreen}
                    hideNavBar>
                <Scene key={"Tabs"}>
                    <Tabs>
                        <Scene component={MainScreen} title={"Battery info"} hideNavBar={true} icon={TabIcon}/>
                        <Scene component={MainScreen} title={"Memory info"} hideNavBar={true} icon={TabIcon}/>
                        <Scene component={MainScreen} title={"Device info"} hideNavBar={true} icon={TabIcon}/>
                    </Tabs>
                </Scene>
            </Drawer>
        </Scene>
    </Router>
);

const TabIcon = ({focused, title}) => {
    let style = focused ? styles.imageSelectedStyle : styles.imageNotSelectedStyle;

    switch (title) {
        case 'Battery info':
            return (
                <Image source={require("./src/icons/battery.png")}
                       style={style}/>
            );
        case 'Memory info':
            return (
                <Image source={require("./src/icons/ssd.png")}
                       style={style}
                       resizeMode='cover'/>
            );
        case 'Device info':
            return (
                <Image source={require("./src/icons/phone.png")}
                       style={style}/>
            )
    }
};

const styles = StyleSheet.create({
    imageNotSelectedStyle: {
        height: 25,
        width: 25,
        tintColor: 'white',
        alignItems: 'stretch'
    },

    imageSelectedStyle: {
        height: 25,
        width: 25,
        tintColor: 'black',
        alignItems: 'stretch'
    }
});