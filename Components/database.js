import React, {Component} from 'react';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

// Function for storing data
export async function storeData(item, data) {
    try {
        await AsyncStorageLib.setItem(item, JSON.stringify(data));
    } catch (e) {
        console.log("Error when storing data: " + e);
    }
}

// Function for retrieving data
export async function retrieveData(keyName) {
    try {
        const value = await AsyncStorageLib.getItem(keyName);
        if (value !== null) {
            return value != null ? JSON.parse(value) : null;
        }
    } catch (e) {
        console.log("Error when retrieving data: " + e)
    }
}