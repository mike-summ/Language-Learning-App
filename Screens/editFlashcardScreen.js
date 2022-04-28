import { StyleSheet, Text, View } from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { retrieveData, storeData } from '../Components/database';
import colours from '../colours';

export function Edit(props) {
    const params = props.route.params;
    const FLASHCARD_KEY = "@flashcards";

    const [word, setWord] = useState(params.flashcard["word"]);
    const [answer, setAnswer] = useState(params.flashcard["answer"]);  
    const navigation = useNavigation();  

    function handleWordChange(text) {
        setWord(text);
    }

    function handleAnswerChange(text) {
        setAnswer(text);
    }

    async function onSubmit() {
        try {
            if (!word || !answer) return;

            let card = params.flashcard;
            let newCard = {
                "answer": answer,
                "due_date": card["due_date"],
                "id": card["id"],
                "prevDiff": card["prevDiff"],
                "status": card["status"],
                "word": word
            };

            updateFlashcard(newCard);
        } catch (e) {
            console.log("onSubmit: " + e);
        }
    }

    async function deleteFlashcard() {
        try {
            let card = params.flashcard;

            // Get flashcards from database
            let flashcards = await retrieveData(FLASHCARD_KEY); 
            let index = 0;

            // Find the index of the card
            for (let i = 0; i < flashcards.length; i++) {
                if (flashcards[i]["id"] == card["id"]) {
                    index = i;
                }
            }

            // Remove it from the array
            flashcards.splice(index, 1);

            storeData(FLASHCARD_KEY, flashcards);
            alert("Flashcard removed!");
            navigation.goBack();
            
        } catch(e) {
            console.log("deleteFlashcard: " + e)
        }
    }

    async function updateFlashcard(card) {
        try {
            // Get flashcards from database
            let flashcards = await retrieveData(FLASHCARD_KEY); 
            let index = 0;

            // Find the index of the card
            for (let i = 0; i < flashcards.length; i++) {
                if (flashcards[i]["id"] == card["id"]) {
                    index = i;
                }
            }

            // Remove it from the array
            flashcards.splice(index, 1);

            // Add the new card data
            flashcards.push(card);
            console.log(card);
            storeData(FLASHCARD_KEY, flashcards);

            alert("Flashcard details submitted!");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.inputContainer}>
            <Text>Word</Text>
            <TextInput 
                style={styles.textInput}
                value={word}
                placeholder="Insert the target word here!"
                onChangeText={handleWordChange}
            />
            <Text>Answer</Text>
            <TextInput 
                style={styles.textInput}
                value={answer}
                placeholder="Insert the word's english definition here!"
                onChangeText={handleAnswerChange}
            />
            <Text>Next review: {params.flashcard["due_date"]}</Text>

            <TouchableHighlight
                onPress={onSubmit}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Save</Text>
            </TouchableHighlight>

            <TouchableHighlight
                onPress={deleteFlashcard}
                style={styles.deleteButton}
            >
                <Text style={styles.submitButtonText}>Delete</Text>
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
    deleteButton: {
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        padding: 15,
        margin: 5
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    } 
});