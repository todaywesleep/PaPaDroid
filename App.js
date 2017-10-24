import React, {Component} from 'react';
import {MainScreen} from "./app/View/MainScreen";
import {Router, Stack, Scene, Tabs, Drawer} from "react-native-router-flux";

export default Application = () => (
    <Router>
        <Scene key={"Root"}>
            <Drawer contentComponent={MainScreen}
                    hideNavBar>
                <Scene key={"Tabs"}>
                    <Tabs >
                        <Scene key={"BatteryInfo"} component={MainScreen} title={"Battery info"} hideNavBar={true}/>
                        <Scene key={"MemoryInfo"} component={MainScreen} title={"Memory info"} hideNavBar={true}/>
                        <Scene key={"DeviceInfo"} component={MainScreen} title={"Device info"} hideNavBar={true}/>
                    </Tabs>
                </Scene>
            </Drawer>
        </Scene>
    </Router>
);