import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { dummy_data } from '../Data/dummy_data';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colours from '../colours';
import { retrieveData, storeData } from '../Components/database';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export function Library() {

    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);

    const FILE_KEY = "@files";
    const navigation = useNavigation();

    useEffect(() => {
        // Get file data and refresh
        refreshPage();
    }, []);

    useEffect(() => {
        updateFilesList();
    }, [data])

    // When a file is selected, the Reader will open with the selected file's contents
    function OnPressReader(fileName, fileText) {
        navigation.push("Reader", {name: fileName, text: fileText});
    }

    async function updateFilesList() {
        try {
            let array = [];
            let tempData = [];
            const response = await retrieveData(FILE_KEY);
            if (response) tempData = [...dummy_data, ...response];

            for (let i = 0; i < tempData.length; i++) {
                // New file from dummy data
                
                array.push(
                        <View 
                            key={i} 
                            style={styles.file}
                        >
                            <View>
                                <Image 
                                    source={require('../assets/textfile.png')}
                                    style={styles.fileImage}
                                />
                                <Text numberOfLines={1}>{tempData[i]["name"]}</Text>
                                <Text numberOfLines={1} style={{width: 250}}>{tempData[i]["location"]}</Text>
                            </View>
                            <View style={styles.readButton}>
                                <AntDesign name="arrowright" size={80} color="black" onPress={()=>{OnPressReader(tempData[i]["name"], tempData[i]["text"])}}/>
                                <Text>Read</Text>
                            </View>
                        </View>
                );
            }
            setFiles(array);
        }
        catch(e) {
            console.log(e);
        }
    }

    const refreshPage = () => {
            // refresh the page
            setData(retrieveData(FILE_KEY));
            setFiles([]);
            updateFilesList();
    }

    async function AddFile() {
        // Function called when 'Add' button is pressed.

        try {
            const response = await retrieveData(FILE_KEY);

            let tempData = [];

            if (response) tempData = [...response];

            // Opens the storage for the user to select a document
            const pickerResult = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });
            
            const uri = FileSystem.documentDirectory + pickerResult.name;

            if (pickerResult !== null) {
                // Read the data using expo FileSystem
                const copyAsync = await FileSystem.copyAsync({from: pickerResult.uri, to: uri});

                let content = await FileSystem.readAsStringAsync(uri);

                let newFile = {
                    "name": pickerResult.name,
                    "location": pickerResult.uri,
                    "text": content
                };

                tempData.push(newFile);
                setData([]);
                setData(tempData);

                await storeData(FILE_KEY, tempData);
                alert("Added file!");
            }
        } catch (e) {
            console.log(e);
        }
        refreshPage();
    }

    // Clear all the files from local storage.
    function ClearData() {
        AsyncStorageLib.removeItem("@files");
        setData([]);
        setFiles([]);
        alert("Cleared Data!");
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.filesLayout} >
                {files}
            </ScrollView>
            <View style={styles.addButton}>
                <AntDesign name="addfile" size={60} color="white" onPress={AddFile}/>
            </View>
            <View style={styles.clearButton}>
                <MaterialIcons name="delete-sweep" size={60} color="white" onPress={ClearData}/>
            </View>
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
    addButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: colours.darkContrast,
        padding: 10,
        borderRadius: 50
    },
    clearButton: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 50
    },
    file: {
        backgroundColor: colours.lightAccent,
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
        flexDirection: 'row'
    },
    fileImage: {
        width: 100,
        height: 100,
    },
    filesLayout: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    readButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'flex-end',
    }
  });