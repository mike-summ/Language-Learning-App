import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { retrieveData, storeData } from '../Components/database';
import colours from '../colours';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

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

    // Clear all the files from library.
    function ClearLibrary() {
        AsyncStorageLib.removeItem("@files");
        alert("Cleared Library!");
    }

    // Clear all the flashcards.
    function ClearFlashcards() {
        AsyncStorageLib.removeItem("@flashcards");
        alert("Cleared Flashcards!");
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
            <TouchableHighlight
                onPress={ClearLibrary}
                style={styles.deleteButton}
            >
                <Text style={styles.submitButtonText}>Delete all files</Text>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={ClearFlashcards}
                style={styles.deleteButton}
            >
                <Text style={styles.submitButtonText}>Delete all flashcards</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        padding: 15,
        margin: 10,
        justifyContent: "space-between",
        backgroundColor: "white",
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 10,
    },
    submitButton: {
        borderWidth: 1,
        borderColor: colours.accent,
        backgroundColor: colours.accent,
        padding: 15,
        margin: 5,
        borderRadius: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center'
    },
    deleteButton: {
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        padding: 15,
        margin: 5,
        borderRadius: 10,
    },
});