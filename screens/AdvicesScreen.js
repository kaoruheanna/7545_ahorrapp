import React from 'react';
import {Button, Text, View, FlatList, StyleSheet} from 'react-native';
import DrawerComponent from '../components/DrawerComponent.js';
import {NavigationActions, StackActions} from "react-navigation";
import {formatItem,getData} from "../components/AdviceGenerator";

export default class AdvicesScreen extends React.Component {

    static navigationOptions = {
        drawerLabel: (params) => {
            return (<DrawerComponent title="Consejos" type="info" focused={params.focused}/>)
        }
    };

    constructor(props){
      super(props);
      this.state ={
        data: []
      }
    }


    async componentDidMount() {
      return 
    }


    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('willFocus', () => {
            getData().then( (data) => {
                this.setState({ //recordar que re-renderea cada vez que se llama a setState
                    data:  data});
            });
        });
    }

    async componentWillMount() {
        if (this.focusListener) this.focusListener.remove();
    }


  render() {
        return (
            <View style={styles.container}>

                <FlatList
                  data={this.state.data}
                  renderItem = {
                    ({item}) =>
                        <Text style={styles.item}>
                          {formatItem(item)}
                        </Text>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    flex:1,
    padding: 10,
    fontSize: 18,
  },
})