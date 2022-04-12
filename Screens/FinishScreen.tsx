import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { QuestionsContext } from "../contexts";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Animatable from "react-native-animatable";
import { Button } from "react-native-paper";
import { CommonStyles } from "../CommonStyles";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type PropTypes = NativeStackScreenProps<RootStackParamList, "Finish">;

const FinishScreen = ({ navigation }: PropTypes) => {
    const { questions, toggleTheme } = useContext(QuestionsContext);
    const numCorrect = questions.filter((question) => question.correctAnswered).length;
    const accuracy = (numCorrect * 100.0) / questions.length;

    // won if >= 75% answers are correct
    const won = accuracy >= 75.0;

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            e.preventDefault(); // Prevent default action
            unsubscribe(); // Unsubscribe the event on first call to prevent infinite loop
            navigation.navigate("Home");
        });
    }, [navigation]);

    return (
        <View style={CommonStyles.screenContainer}>
            {/* TODO: use animation native driver? */}

            <Animatable.Text
                animation="tada"
                duration={2000}
                style={{ alignSelf: "center", fontSize: 40, textAlign: "center" }}
                useNativeDriver
            >
                {`You ${won ? "Won" : "Lose"}!\nAccuracy: ${accuracy}%`}
            </Animatable.Text>

            <Button mode="contained" onPress={() => navigation.navigate("Home")}>
                Start again
            </Button>

            {won && <ConfettiCannon count={50} origin={{ x: 0, y: 0 }} fadeOut />}
        </View>
    );
};

export default FinishScreen;

const styles = StyleSheet.create({});
