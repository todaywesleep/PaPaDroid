import React, {Component} from 'react';
import {MainScreen} from "./app/View/MainScreen";
import {Router, Scene, Tabs, Drawer} from "react-native-router-flux";
import {Image, StyleSheet, Text, View} from "react-native";
import {StartScreen} from "./app/View/StartScreen";
import {Device} from "./app/View/Device";
import {BatteryInfo} from "./app/View/Battery";
import {CPU} from "./app/View/CPU";
import {Memory} from "./app/View/Memory";
import {colors} from "./app/Utils/Consts";
import {CustomButton} from "./app/Component/CustomButton";

export default Application = () => (
    <Router key={'key0'}>
        <Scene key={"Initial"}>
            <Scene
                key="Home"
                component={StartScreen}
                hideNavBar
            />

            <Scene key={'Root'}>
                <Drawer
                    contentComponent={MainScreen}
                    hideNavBar
                >
                    <Tabs
                        activeBackgroundColor={colors.mainBackgroundColor}
                        activeTintColor={'white'}
                        inactiveBackgroundColor={colors.cardBackgroundColor}
                        inactiveTintColor={'black'}
                        tabBarStyle={{
                            borderTopWidth: 2,
                            borderBottomColor: colors.cardBackgroundColor,
                            borderBottomWidth: 2,
                            borderTopColor: colors.cardBackgroundColor
                        }}
                    >
                        <Scene component={BatteryInfo}
                               title={"BatteryInfo info"}
                               hideNavBar
                               icon={TabIcon}
                        />
                        <Scene component={CPU}
                               title={"CPU info"}
                               hideNavBar
                               icon={TabIcon}
                        />
                        <Scene component={Memory}
                               title={"Memory info"}
                               hideNavBar
                               icon={TabIcon}
                        />
                        <Scene component={Device}
                               title={"Device info"}
                               hideNavBar
                               icon={TabIcon}
                        />
                    </Tabs>
                </Drawer>
            </Scene>
        </Scene>
    </Router>
);

const TabIcon = ({focused, title}) => {
    let style = focused ? styles.imageSelectedStyle : styles.imageNotSelectedStyle;

    switch (title) {
        case 'BatteryInfo info':
            return (
                <Image source={require("./src/icons/battery.png")}
                       style={style}/>
            );
        case 'CPU info':
            return (
                <Image source={require("./src/icons/cpu.png")}
                       style={style}
                       resizeMode='cover'/>
            );
        case 'Device info':
            return (
                <Image source={require("./src/icons/phone.png")}
                       style={style}/>
            );
        case 'Memory info':
            return (
                <Image source={require("./src/icons/memory.png")}
                       style={style}/>
            )
    }
};

const styles = StyleSheet.create({
    imageNotSelectedStyle: {
        height: 25,
        width: 25,
        tintColor: 'black',
        alignItems: 'stretch'
    },

    imageSelectedStyle: {
        height: 25,
        width: 25,
        tintColor: 'white',
        alignItems: 'stretch'
    }
});