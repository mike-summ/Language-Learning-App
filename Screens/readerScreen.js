import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colours from '../colours';
import dictionary_api from '../Data/dictionary_api';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { retrieveData, storeData } from '../Components/database';
import AwesomeAlert from 'react-native-awesome-alerts';

export function Reader(props) {
    const [textComp, setTextComp] = useState([]);
    const [selectedWord, setWord] = useState("");
    const [selectedKey, setKey] = useState();
    const [definition, setDefinition] = useState("No word selected.");

    // Alert states
    const [showAdd, setAdd] = useState(false);
    const [showError, setError] = useState(false);
    const [showDuplicate, setDuplicate] = useState(false);

    const params = props.route.params;

    const fileText = params.text;
    const fileName = params.name;

    const FLASHCARD_KEY = "@flashcards";
    
    useEffect(() => {
        SetText();
    }, []);

    useEffect(() => {
        SetText();
    }, [selectedKey]);

    function SetText() {
        // Go through text and split at each word
        const words = fileText.split(" ");
        const wordCount = words.length;

        // Add word to array as selectable component
        let array = [];

        for (let i = 0; i < wordCount; i++) {
            if (i == selectedKey) {
                array.push(
                    <Text style={{
                        backgroundColor: colours.darkContrast,
                        color: 'white'
                    }} key={i} onPress={() => {PressWord(words[i], i)}}>{words[i]} </Text>
                );
            } else {
                array.push(
                    <Text style={{
                        backgroundColor: 'white',
                        color: 'black'
                    }} key={i} onPress={() => {PressWord(words[i], i)}}>{words[i]} </Text>
                );
            }
        }
        // Set textComp as array
        setTextComp(array);
    }

    async function PressWord(word, key) {
        // Remove any punctuation from the string
        let editedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, "");
        let stringWord = editedWord.replace(/[']/g, "\'");

        setKey(key);
        setWord(stringWord);

        // Set the definition
        try {
            // Convert word to lowercase
            let finalWord = stringWord.toLowerCase();
            console.log(finalWord);
            // Set the definition
            setDefinition(GetDefinition(finalWord));
        } catch (e) {
            alert("Word not found in dictionary! ");
            setWord("");
            setDefinition("No word selected");
        }
    }

    // Add the word to the user's list of flashcards
    async function AddWord() {
        
        if (selectedWord == "") {
            setError(true);
            return;
        }

        try {
            let flaschards = await retrieveData(FLASHCARD_KEY);
            let id = "";
            let word = "";
            let answer = "";
            let array = [];

            if (typeof flaschards === "undefined") {
                id = "0";
            } else {
                id = (flaschards.length + 1) + "";
                array = [...flaschards];

                for (let i = 0; i < flaschards.length; i++) {
                    if (selectedWord == flaschards[i].word) {
                        setDuplicate(true);
                        return;
                    }
                }
            }

            word = selectedWord;
            answer = definition;

            array.push({
                "id": id,
                "word": word,
                "answer": answer,
                "due_date": "",
                "status": "new",
                "prevDiff": 0,
            });

            storeData(FLASHCARD_KEY, array);
            setAdd(true);
        } catch(e) {
            console.log("Add Word: " + e);
        }
    }

    // Fetch audio from API using 'selectedWord'.
    function WordAudio() {
        
    }

    // Return the definition of the word
    function GetDefinition(word) {
        let definition = dictionary_api[word]["definition"];

        return definition;
    }

    return (
        <View style={styles.container}>
            <View style={styles.reader}>
                <Text style={styles.title}>File name: {fileName}</Text>
                <ScrollView>
                    <Text style={styles.readerText}>{textComp}</Text>
                </ScrollView>
            </View>
            <View style={styles.definitionBox}>
                <View>
                    <Text>Definition for the word '{selectedWord}':</Text>
                    <Text>{definition}</Text>
                </View>
                <View>
                    <Ionicons name="add-circle" size={60} color="green" onPress={() => AddWord()} />
                </View>
            </View>

            <AwesomeAlert 
                show={showAdd}
                showProgress={false}
                title="Created flaschard"
                message="The word and definition has been saved as a flashcard!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Okay"
                confirmButtonColor={colours.darkContrast}
                onConfirmPressed={() => {
                    setAdd(false);
                }}
            />
            <AwesomeAlert 
                show={showError}
                showProgress={false}
                title="Warning: No word selected"
                message="Select a word to save it as a flashcard!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Okay"
                confirmButtonColor="red"
                onConfirmPressed={() => {
                    setError(false);
                }}
            />
            <AwesomeAlert 
                show={showDuplicate}
                showProgress={false}
                title="Warning: Duplicate flashcard"
                message="This word has already been saved as a flashcard!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Okay"
                confirmButtonColor="red"
                onConfirmPressed={() => {
                    setDuplicate(false);
                }}
            />
        </View>
    );
}
//<AntDesign name="sound" size={24} color="black" onPress={() => WordAudio()} />

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.darkAccent,
        padding: 10,
    },
    reader: {
        flex: 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
    },
    title: {
        textAlign: 'center',
    },
    definitionBox: {
        flex: 0.2,
        borderRadius: 20,
        backgroundColor: colours.lightAccent,
        marginVertical: 5,
        padding: 10,
        fontSize: 25,
        justifyContent: "space-around",
        alignItems: "center"
    },
    readerText: {
        fontSize: 25,
    }
});