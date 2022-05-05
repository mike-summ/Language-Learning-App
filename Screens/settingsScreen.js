import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { retrieveData, storeData } from '../Components/database';
import colours from '../colours';

export function Settings(props) {
    const params = props.route.params;
    const SETTINGS_KEY = "@settings";

    const [percentageIncrease, setIncrease] = useState(params["increase"]);
    const [newCards, setNewCards] = useState(params["new"]);

    function handleIncreaseChange(text) {
        setIncrease(text);
    }

    function handleNewChange(text) {
        setNewCards(text);
    }

    async function onSubmit() {
        try {
            if (!percentageIncrease || !newCards) return;

            let newSettings = {
                "increase": percentageIncrease,
                "new": newCards
            };

            storeData(SETTINGS_KEY, newSettings);
            alert("Settings saved!");
        } catch (e) {
            console.log("onSubmit: " + e);
        }
    }

    return (
        <View style={styles.inputContainer}>
            <Text />
            <Text style={styles.titleText}>Increase (%)</Text>
            <Text>Determines how far a flashcard is pushed forwards when passing it.</Text>
            <TextInput 
                style={styles.textInput}
                value={percentageIncrease}
                placeholder="Insert the percentage increase here"
                onChangeText={handleIncreaseChange}
            />

            <Text style={styles.titleText}>New Cards</Text>
            <Text>Changes how many new cards are shown per day.</Text>
            <TextInput 
                style={styles.textInput}
                value={newCards}
                placeholder="Insert the amount of new cards here"
                onChangeText={handleNewChange}
            />
            <TouchableHighlight
                onPress={onSubmit}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Save</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        margin: 10,
        justifyContent: "space-between"
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    submitButton: {
        borderWidth: 1,
        borderColor: colours.accent,
        backgroundColor: colours.accent,
        padding: 15,
        margin: 5
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center'
    }  
});