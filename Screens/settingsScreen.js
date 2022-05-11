import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { retrieveData, storeData } from '../Components/database';
import colours from '../colours';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

export function Settings(props) {
    const params = props.route.params;
    const SETTINGS_KEY = "@settings";

    const [percentageIncrease, setIncrease] = useState(params["increase"]);
    const [newCards, setNewCards] = useState(params["new"]);

    // Alert states
    const [showSave, setSave] = useState(false);
    const [showFiles, setFiles] = useState(false);
    const [showFlashcards, setFlashcards] = useState(false);

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
            setSave(true);
        } catch (e) {
            console.log("onSubmit: " + e);
        }
    }

    // Clear all the files from library.
    function ClearLibrary() {
        AsyncStorageLib.removeItem("@files");
    }

    // Clear all the flashcards.
    function ClearFlashcards() {
        AsyncStorageLib.removeItem("@flashcards");
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
                underlayColor={colours.accent}
                activeOpacity={0.5}
            >
                <Text style={styles.submitButtonText}>Save</Text>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => {
                    setFiles(true);
                }}
                underlayColor="red"
                activeOpacity={0.5}
                style={styles.deleteButton}
            >
                <Text style={styles.submitButtonText}>Delete all files</Text>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => {
                    setFlashcards(true);
                }}
                underlayColor="red"
                activeOpacity={0.5}
                style={styles.deleteButton}
            >
                <Text style={styles.submitButtonText}>Delete all flashcards</Text>
            </TouchableHighlight>

            <AwesomeAlert 
                show={showSave}
                showProgress={false}
                title="Settings Saved"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Okay"
                confirmButtonColor={colours.darkContrast}
                onConfirmPressed={() => {
                    setSave(false);
                }}
            />

            <AwesomeAlert 
                show={showFiles}
                showProgress={false}
                title="Are you sure?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                showCancelButton={true}
                confirmText="Delete"
                confirmButtonColor="red"
                cancelText="Cancel"
                onConfirmPressed={() => {
                    setFiles(false);
                    ClearLibrary();
                }}
                onCancelPressed={() => {
                    setFiles(false);
                }}
            />

            <AwesomeAlert 
                show={showFlashcards}
                showProgress={false}
                title="Are you sure?"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                showCancelButton={true}
                confirmText="Delete"
                confirmButtonColor="red"
                cancelText="Cancel"
                onConfirmPressed={() => {
                    setFlashcards(false);
                    ClearFlashcards();
                }}
                onCancelPressed={() => {
                    setFlashcards(false);
                }}
            />
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