import React, {Component, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Review() {
    const [dueCards, setDueCards] = useState([]);
    const [newCards, setNewCards] = useState([]);
    const [currentCard, setCurrentCard] = useState({});

    /**
     * Have a check at the first render of the page to see how many cards are due for them.
     * If there are none: Render "Congratulations! You have no cards left to review."
     * If there are no flashcards at all: "Want to review vocabularly? Start reading now!"
     * If there are flashcards: Grab the array of due flashcards and present them
     */

    // Get flashcards from database
    function getFlashcards() {
        // Get all the flashcards from the database

        // Get the current date

        // Get all the flashcards that are due today

        // Get an amount of new cards based on the user's settings
    }

    function setView() {
        // Get the cards


        if (( dueCards.length == 0) && (newCards.length == 0)) {
            // There are no cards left to review
            return (
                <View>
                    <Text>Congratulations! There are no cards left to review!</Text>
                </View>
            );
        } else {
            // There are cards left to review
            return (
                <View>

                </View>
            );
        }
    }

    // Component for the review
    function reviewCard(cardId) {

    }

    // The user passes the card
    function pass(cardId) {
        let card = getCard(cardId);

        // Change the due date by adding days

        // Remove the card from the review list
        removeCard(cardId);
    }

    // The user fails the card
    function fail(cardId) {
        let card = getCard(cardId);

        // Change the due date to the next day e.g. due_date = today + 1

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
                done = true;
            }
        }

        if (done) {
            console.log("Flashcard removed: " + cardId);
        } else {
            for (let i = 0; i < newCards.length; i++) {
                if (dueCards[i]["id"] == cardId) {
                    // Remove item from newCards at index 'i'
                    done = true;
                }
            }

            if (done) {
                console.log("Flashcard removed: " + cardId);
            } else {
                console.log("Flashcard does not exist: " + cardId);
            }
        }

    }

    return (
        <View>
            <Text>New: {newCards.length}  Review: {dueCards.length}</Text>
            {setView}
        </View>
    );
}