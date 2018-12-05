import React from "react";
import {View, Text} from 'react-native';
import { Icon } from 'react-native-elements'
import Button from 'react-native-really-awesome-button/src/themes/rick';

export default class HomeButton extends React.Component {
    render() {

        let icon = '';

        let backgroundColor = "#0000FF";
        if (this.props.type === 'income'){
            backgroundColor = "#a4c639";
            icon = 'plus-circle';
        } else if (this.props.type === 'expenditure') {
            backgroundColor = "#cc0000";
            icon = 'minus-circle';
        } else if (this.props.type === 'balance') {
            icon = 'balance-scale';
        } else if (this.props.type === 'info') {
            icon = 'info-circle';
        }

        return (
            <Button
                width={130}
                height={70}
                backgroundColor={backgroundColor}
                onPress={() => {
                    this.props.onPress(this.props.screen);
                }}
            >
                <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                    <Icon name={icon} type='font-awesome' color='white'/>
                    <Text style={{color:'white', marginLeft: 10}}>{this.props.title}</Text>
                </View>
            </Button>
        )
    };
}