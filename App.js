import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './src/Home';
import Detail from './src/Detail';
import Campaign from './src/Campaign';
import {navigationRef} from './src/Home';

export default class App extends Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="Campaign" component={Campaign} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
