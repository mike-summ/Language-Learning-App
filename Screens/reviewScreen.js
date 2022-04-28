import React, {Component, useState, useEffect} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { retrieveData, storeData } from '../Components/database';
import { dummy_flashcards } from '../Data/dummy_data';
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import colours from '../colours';
import { LogBox } from 'react-native';

export function Review() {
    const [dueCards, setDueCards] = useState([]);
    const [newCards, setNewCards] = useState([]);
    const [currentCard, setCurrentCard] = useState({});
    const [percentageIncrease, setIncrease] = useState(1.5);
    const [maxNewCards, setMaxNewCards] = useState(10);
    const FLASHCARD_KEY = "@flashcards";

    LogBox.ignoreAllLogs();
    /**
     * Have a check at the first render of the page to see how many cards are due for them.
     * If there are none: Render "Congratulations! You have no cards left to review."
     * If there are no flashcards at all: "Want to review vocabularly? Start reading now!"
     * If there are flashcards: Grab the array of due flashcards and present them
     */

     useEffect(() => {
        getFlashcards();
    }, []);

    useEffect(() => {
        SetView();
    }, [currentCard])

    // Get flashcards from database
    async function getFlashcards() {
        try {
            // Get all the flashcards from the database
            let array = await retrieveData(FLASHCARD_KEY);
            let newArray = [];
            let dueArray = [];

            for (let i = 0; i < array.length; i++) {
                if (array[i].status == "new") {
                    newArray.push(array[i]);
                } else {
                    dueArray.push(array[i]);
                }
            }

            // Get the current date
            let today = new Date();
            today = getDateString(today);

            // Get all the review flashcards that are due today
            let dueCards = [];
            for (let k = 0; k < dueArray.length; k++) {
                if (dueArray[k].due_date <= today) {
                    dueCards.push(dueArray[k]);
                }
            }

            // Get an amount of new cards based on the user's settings
            let limitedNewArray = [];
            for (let j = 0; j < maxNewCards; j++) {
                if (newArray[j] != null) {
                    limitedNewArray.push(newArray[j]);
                }
            }

            setDueCards(dueCards);
            setNewCards(limitedNewArray);
            nextCard();
        } catch (e) {
            console.log(e);
        }
    }

    // Returns the date as a string
    function getDateString(date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();

        let stringDate = dd + '/' + mm + '/' + yyyy;
        return stringDate;
    }

    const SetView = () => {
        if (( dueCards.length == 0) && (newCards.length == 0)) {
            // There are no cards left to review
            return (
                <View style={{justifyContent: "center"}}>
                    <Text style={styles.word}>Congratulations! There are no cards left to review!</Text>
                </View>
            );
        } else {
            // There are cards left to review
            nextCard();
            return (
                <View>
                    <View>
                        <ReviewCardDemo card={currentCard}/>
                    </View>
                </View>
            );
        }
    }

    const ReviewCardDemo = (props) => {
        const [showAnswer, setShow] = useState(false);
        const [currentCard, setCard] = useState(props.card);
    
        if (!showAnswer) {
            return (
                <View style={{alignItems: "center",}}>
                    <Text style={styles.word}>{currentCard["word"]}</Text>
                    <View style={{
                        backgroundColor: "black",
                        height: 1,
                    }}/>

                    <TouchableHighlight activeOpacity={0.5} underlayColor="white" onPress={() => setShow(true)}>
                        <Text style={styles.show}>Show Definition</Text>
                    </TouchableHighlight>
                </View>
            );
        } else {
            return (
                <View style={{alignItems: "center",}}>
                    <Text style={styles.word}>{currentCard["word"]}</Text>
                    <Text style={styles.answer}>{currentCard["answer"]}</Text>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly", }}>
                        <TouchableHighlight activeOpacity={0.5} underlayColor="white" onPress={() => fail(currentCard["id"])}>
                            <Text style={styles.fail}>Fail</Text>
                        </TouchableHighlight>

                        <TouchableHighlight activeOpacity={0.5} underlayColor="white" onPress={() => pass(currentCard["id"])}>
                            <Text style={styles.pass}>Pass</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        }
    }
    // The user passes the card
    function pass(cardId) {
        let card = getCard(cardId);
        let currentDate = new Date();

        // Change the due date by adding days
        if (card["status"] == "new") {
            // The card will be seen 2 days in the future
            currentDate.setDate(currentDate.getDate() + 2);
            currentDate = getDateString(currentDate);

            card["status"] = "review";
            card["prevDiff"] = 2;
            card["due_date"] = currentDate;
        } else {
            // Get current date and add (prevDiff * percentageIncrease) days
            let newDiff = Math.round(card["prevDiff"] * percentageIncrease);
            currentDate.setDate(currentDate.getDate() + newDiff);
            currentDate = getDateString(currentDate);

            card["prevDiff"] = newDiff;
            card["due_date"] = currentDate;
        }
        // Remove the card from the review list
        updateFlashcard(card);
        removeCard(cardId);
    }

    // The user fails the card
    function fail(cardId) {
        let card = getCard(cardId);
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate = getDateString(currentDate);

        // Change the due date to the next day e.g. due_date = today + 1
        if (card["status"] == "new") {
            card["status"] = "review";
            card["prevDiff"] = 1;
            card["due_date"] = currentDate; 
        } else {
            card["prevDiff"] = 1;
            card["due_date"] = currentDate; 
        }

        // Remove the card from the review list
        updateFlashcard(card);
        removeCard(cardId);
    }

    // Return card data from lists via cardId
    function getCard(cardId) {
        let array = [...dueCards, ...newCards];
        let card = {};
        for (let i = 0; i < array.length; i++) {
            if (array[i]["id"] == cardId) {
                card = array[i];
            }
        }

        return card;
    }

    // Remove card from review
    function removeCard(cardId) {
        let done = false;
        for (let i = 0; i < dueCards.length; i++) {
            if (dueCards[i]["id"] == cardId) {
                // Remove item from dueCards at index 'i'
                let array = [...dueCards];
                array.splice(i, 1);
                setDueCards(array);
                done = true;
            }
        }

        if (done) {
            console.log("Flashcard removed: " + cardId);
        } else {
            for (let i = 0; i < newCards.length; i++) {
                if (newCards[i]["id"] == cardId) {
                    // Remove item from newCards at index 'i'
                    let array = [...newCards];
                    array.splice(i, 1);
                    setNewCards(array);
                    done = true;
                }
            }

            if (done) {
                console.log("Flashcard removed: " + cardId);
            } else {
                console.log("Flashcard does not exist: " + cardId);
            }
        }
        nextCard();
    }

    function nextCard() {
        setCurrentCard({});
        if (dueCards != 0) {
            setCurrentCard(dueCards[0]);
        } else if (newCards != 0) {
            setCurrentCard(newCards[0]);
        } else {
            console.log("Cards are completed");
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

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <Text>New: {newCards.length}  Review: {dueCards.length}</Text>
            <SetView style={styles.reviewBox}/>
            <TouchableHighlight activeOpacity={0.5} underlayColor="white" style={styles.refresh} onPress={() => getFlashcards()}>
                <Ionicons name="refresh-circle" size={80} color={colours.darkContrast} />
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colours.darkAccent,
        justifyContent: "space-between",
        padding: 10,
        flex: 1,
    },
    reviewBox: {
        justifyContent: "space-evenly",
        backgroundColor: colours.accent,
    },
    word: {
        padding: 10,
        fontSize: 25,
    },
    answer: {
        padding: 10,
        fontSize: 25,
    },
    pass: {
        backgroundColor: "green",
        padding: 5,
        margin: 5,
        color: "white",
        borderRadius: 10,
        fontSize: 25,
    },
    fail: {
        backgroundColor: "red",
        padding: 5,
        margin: 5,
        color: "white",
        borderRadius: 10,
        fontSize: 25,
    },
    show: {
        backgroundColor: colours.accent,
        padding: 5,
        margin: 5,
        color: "white",
        borderRadius: 10,
        fontSize: 25,
    },
    refresh: {
        width: 80,
        left: 10,
        bottom: 10,
        borderRadius: 50,
    }
});