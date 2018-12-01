import React from 'react';
import {Button, Text, View, FlatList, StyleSheet} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import {formatItem,getData} from "../components/AdviceGenerator";

export default class AdvicesScreen extends React.Component {

    static navigationOptions = {
        title: 'Consejos',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text> Esta es la pantalla de consejos </Text>

                <FlatList
                  data={getData()}
                  renderItem = {
                    ({item}) =>
                        <Text style={styles.item}>
                          {formatItem(item)}
                        </Text>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />

                <Button
                    title="Go to Home"
                    onPress={() => {
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Home' })
                            ],
                        }))
                    }}
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