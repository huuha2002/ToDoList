
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
    <>
      <StatusBar hidden></StatusBar>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;
