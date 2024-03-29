import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyTabs } from './Screens/navigationBottomTabs';
import { Help } from './Screens/helpScreen';
import { Reader } from './Screens/readerScreen';
import { Edit } from './Screens/editFlashcardScreen';
import { Welcome } from './Screens/welcomeScreen';
import colours from './colours';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerStyle: {backgroundColor: colours.darkContrast}}} />
        <Stack.Screen name="Language Learning" component={MyTabs} options={{headerStyle: {backgroundColor: colours.darkContrast}}} />
        <Stack.Screen name="Reader" component={Reader} options={{headerStyle: {backgroundColor: colours.darkContrast}}}/>
        <Stack.Screen name="Edit" component={Edit} options={{headerStyle: {backgroundColor: colours.darkContrast}}}/>
        <Stack.Screen name="Help" component={Help} options={{headerStyle: {backgroundColor: colours.darkContrast}}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});