import React, {Component, useEffect, useState} from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import colours from '../colours';
import { TouchableHighlight } from 'react-native-gesture-handler';

export function Welcome() {

    const [slideIndex, setSlideIndex] = useState(0);
    const welcomeImage = require("../assets/Logo.png");
    const libraryImage = require("../assets/library.jpg");
    const readerImage = require("../assets/reader.jpg");
    const browseImage = require("../assets/browse.jpg");
    const reviewImage = require("../assets/review.jpg");
    const settingsImage = require("../assets/settings.jpg");

    const navigation = useNavigation();

    const data = [
        {
            title: "Welcome",
            description: "This is a language learning application.",
            source: welcomeImage,
        },
        
        {
            title: "Library",
            description: "On this page, files you have added will be displayed here. Selecting a file will allow you to read its contents.",
            source: libraryImage,
        },
        {
            title: "Assistant Reader",
            description: "After selecting a file to read, you will be able to read its contents in the Assistant Reader. \n\nYou can select words that you don't understand and see their English meanings. You can also save any word as a flashcard by selecting the green 'plus' button.",
            source: readerImage,
        },
        {
            title: "Browse",
            description: "All the flashcards you have created will be stored here. You can edit a flashcards contents by selecting the pencil button.",
            source: browseImage,
        },
        {
            title: "Review",
            description: "Here you can review old flashcards and learn a set of new flashcards.",
            source: reviewImage,
        },
        {
            title: "Settings",
            description: "Here you can change how many new flashcards you get every session and how much flashards are affected by the spaced repetition algorithm.",
            source: settingsImage,
        },

    ];

    const settings = {
        sliderWidth: screenWidth,
        sliderHeight: screenHeight * 0.9,
        itemWidth: screenWidth * 0.8,
        data: data,
        renderItem: CarouselItem,
        onSnapToItem: (index) => setSlideIndex(index),
        hasParallaxImages: true,
    };

    function CarouselItem({item, index}, parallaxProps) {
        return (
            <SafeAreaView style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Image style={styles.image} source={item.source} />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <Carousel {...settings} />
            <CustomPaging data={data} activeSlide={slideIndex} />
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate("Language Learning");
                }}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Start using the app!</Text>
            </TouchableHighlight>
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    title: {
        fontSize: 25,
    },
    item: {
        width: '100%',
        height: screenHeight * 0.72,
        alignItems: "center",
        padding: 10,
        backgroundColor: 'white'
    },
    image: {
        width: screenWidth * 0.5,
        height: screenHeight * 0.5,
        resizeMode: "contain",
    },
    dotContainer: {
        
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black'
    },
    inactiveDotStyle: {
        backgroundColor: 'darkgray',
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
    }
});

export function CustomPaging({ data, activeSlide}) {
    const settings = {
        dotsLength: data.length,
        activeDotIndex: activeSlide,
        containerStyle: styles.dotContainer,
        dotStyle: styles.dotStyle,
        inactiveDotStyle: styles.inactiveDotStyle,
        inactiveDotOpacity: 0.4,
        inactiveDotScale: 0.6,
    };

    return <Pagination {...settings} />
}