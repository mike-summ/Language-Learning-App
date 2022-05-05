import React, {Component, useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Library } from './libraryScreen';
import { Browse } from './browseScreen';
import { Review } from './reviewScreen';
import { Settings } from './settingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colours from '../colours';
import { storeData, retrieveData } from '../Components/database';

const Tab = createBottomTabNavigator();

// Creates the four different tabs at the bottom of the screen
export function MyTabs() {
    const SETTINGS_KEY = "@settings";
    const [settingsParams, setSettings] = useState({});

    useEffect(() => {
        GetSettings();
    }, []);

    async function GetSettings() {
        try {
            let settings = await retrieveData(SETTINGS_KEY);
            if (typeof settings == 'undefined') {
                let settingsData = {
                "increase": "150",
                "new": "10"
                };
                storeData(settingsData);
                setSettings(settingsData);
            } else {
                setSettings(settings);
            }
        } catch (e) {
            console.log("Get Settings error: " + e);
        }
    }

    return (
        <Tab.Navigator
        >
            <Tab.Screen 
                name="Library" 
                component={Library} 
                options={{
                    tabBarIcon:({color, size}) => (
                        <Ionicons name="library" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: colours.contrastAccent,
                    },
                }}
            />
            <Tab.Screen 
                name="Browse" 
                component={Browse}
                options={{
                    tabBarIcon:({color, size}) => (
                        <Feather name="list" size={size} color={color} />
                    ),
                }} 
            />
            <Tab.Screen 
                name="Review" 
                component={Review} 
                options={{
                    tabBarIcon:({color, size}) => (
                        <MaterialCommunityIcons name="cards-variant" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings" 
                component={Settings} 
                initialParams={settingsParams}
                options={{
                    tabBarIcon:({color, size}) => (
                        <Feather name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}