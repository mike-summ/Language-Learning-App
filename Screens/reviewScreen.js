import React, {Component, useState, useEffect} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { dummy_flashcards } from '../Data/dummy_data';

export function Review() {
    const [dueCards, setDueCards] = useState([]);
    const [newCards, setNewCards] = useState([]);
    const [currentCard, setCurrentCard] = useState({});
    const [percentageIncrease, setIncrease] = useState(1.5);
    const [maxNewCards, setMaxNewCards] = useState(10);

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
        // Get all the flashcards from the database
        let array = dummy_flashcards;
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
            if (dueArray[k].due_date == today) {
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
                <View>
                    <Text>Congratulations! There are no cards left to review!</Text>
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
        console.log(currentCard);
    
        if (!showAnswer) {
            return (
                <View>
                    <Text>{currentCard["word"]}</Text>
                    <Button title="Show definition" onPress={() => setShow(true)}/>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>{currentCard["word"]}</Text>
                    <Text>{currentCard["answer"]}</Text>
                    <Button title="Fail" onPress={() => fail(currentCard["id"])}/>
                    <Button title="Pass" onPress={() => pass(currentCard["id"])}/>
                </View>
            );
        }
    }
    // The user passes the card
    function pass(cardId) {
        console.log("Passed");
        let card = getCard(cardId);
        let currentDate = new Date();

        // Change the due date by adding days
        if (card["status"] == "new") {
            // The card will be seen 2 days in the future
            currentDate.setDate(currentDate.getDate() + 2);
            currentDate = getDateString(currentDate);

            card["status"] = "review";
            card["prevDiff"] = 2;
            card["dueDate"] = currentDate;
        } else {
            // Get current date and add (prevDiff * percentageIncrease) days
            let newDiff = Math.round(card["prevDiff"] * percentageIncrease);
            currentDate.setDate(currentDate.getDate() + newDiff);
            currentDate = getDateString(currentDate);

            card["prevDiff"] = newDiff;
            card["dueDate"] = currentDate;
        }
        // Remove the card from the review list
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
            card["dueDate"] = currentDate; 
        } else {
            card["prevDiff"] = 1;
            card["dueDate"] = currentDate; 
        }

        // Remove the card from the review list
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

    return (
        <View>
            <Text>New: {newCards.length}  Review: {dueCards.length}</Text>
            <SetView />
        </View>
    );
}