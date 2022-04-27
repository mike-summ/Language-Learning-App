import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { retrieveData } from '../Components/database';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colours from '../colours';
import { dummy_flashcards } from '../Data/dummy_data';
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';

export function Browse() {
    /**
     * A long table of all the flaschards created by the user.
     * Shows the word and the answer.
     * Selecting the flaschard will allow you to edit it.
     */

    /**
     * TODO:
     * Do styling
     * Test on phone
     */


    const FLASHCARD_KEY = "@flashcards";
    const [data, setData] = useState(dummy_flashcards);
    const [flaschards, setFlashcards] = useState([]);

    const navigation = useNavigation();

    // When the screen is opened, obtain all the flashcards in a list.
    useEffect(() => {
        getFlashcards();
    }, []);

    // Retrieve the flashcards from local storage
    async function getFlashcards() {
        const response = await retrieveData(FLASHCARD_KEY);
        //const response = data;

        let tempData = [];
        let array = [];

        if (response) {
            tempData = [...response];
        }

        for (let i = 0; i < tempData.length; i++) {
            array.push(applyComponent(tempData[i]));
        }

        setFlashcards(array);
    }

    // Convert the flashcard data into a component to be added to the screen
    function applyComponent(data) {
        return (
            <View key={data["id"]} style={styles.flashchards}>
                <Text>{data["word"]}</Text>
                <Text>{data["answer"]}</Text>
                <MaterialIcons name="edit" size={30} color="black" onPress={() => editFlashcard(data)}/>
            </View>
        );
    }

    // When a user selects the edit button, they will move to the edit page
    function editFlashcard(card) {
        navigation.push("Edit", {flashcard: card});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>List of Flashcards</Text>
            <ScrollView>
                {flaschards}
            </ScrollView>
            <TouchableHighlight activeOpacity={0.5} underlayColor="white" style={styles.refresh} onPress={() => getFlashcards()}>
                <Ionicons name="refresh-circle" size={80} color={colours.darkContrast} />
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.darkAccent,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    title: {
        fontSize: 25,
    },
    flashchards: {
        backgroundColor: colours.lightAccent,
        flexDirection: "row",
        marginHorizontal: 5,
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: "space-evenly"
    },
    refresh: {
        width: 80,
        left: 10,
        borderRadius: 50,
    }
});