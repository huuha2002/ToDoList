
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';

import Router from './src/Routers/Router';
const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'}></StatusBar>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;
