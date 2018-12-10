import React from "react";
import {View, Text} from 'react-native';
import { Icon } from 'react-native-elements'

export default class DrawerComponent extends React.Component {
    render() {

        let icon = '';

        if (this.props.type === 'income'){
            icon = 'plus-circle';
        } else if (this.props.type === 'expenditure') {
            icon = 'minus-circle';
        } else if (this.props.type === 'balance') {
            icon = 'balance-scale';
        } else if (this.props.type === 'info') {
            icon = 'info-circle';
        } else if (this.props.type === 'home') {
            icon = 'home';
        }

        return (
            <View style={{paddingLeft: 6, paddingTop: 20, paddingBottom: 20, flex: 1, flexDirection: 'row', alignItems: "center"}}>
                <View style={{alignItems: 'center', justifyContent: 'center', width: 30}}>
                    <Icon name={icon} type='font-awesome' color="black"/>
                </View>
                <Text style={[ this.props.focused ? 
                    {paddingLeft: 8, fontWeight: 'bold', fontSize: 16} : 
                    {paddingLeft: 8, fontSize: 14}
                ]}>{this.props.title}</Text>
            </View>
        )
    };
}