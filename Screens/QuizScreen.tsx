import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { CommonStyles } from "../CommonStyles";
import { QuestionsContext } from "../contexts";
import { Button, Checkbox, Drawer, List, Paragraph } from "react-native-paper";
import { unescape } from "html-escaper";
import { BackHandler } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface Question {
    question: string;
    answer: boolean;
    answered: boolean;
    correctAnswered: boolean;
}

type PropTypes = NativeStackScreenProps<RootStackParamList, "Quiz">;

const QuizScreen = ({ route, navigation }: PropTypes) => {
    const { questions, toggleTheme } = useContext(QuestionsContext);
    const [trueChecked, setTrueChecked] = useState(true);

    // const onBackPress = () => {
    //     if (route.params.questionIdx > 0)
    //         navigation.navigate(`Question ${route.params.questionIdx - 1}`, {
    //             questionIdx: route.params.questionIdx - 1,
    //         });
    //     else navigation.navigate("Home");

    //     // just to make typescript happy
    //     return true;
    // };

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", onBackPress);
    //     return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    // }, []);

    return (
        <View style={CommonStyles.screenContainer}>
            <ScrollView>
                <Button icon="brightness-6" onPress={() => toggleTheme()}>
                    mode
                </Button>

                {/* TODO: this doesn't work properly ( 2004&#039;s ) */}
                <Paragraph>{unescape(questions[route.params.questionIdx].question)}</Paragraph>
                <Checkbox.Item
                    label="True"
                    status={trueChecked ? "checked" : "unchecked"}
                    onPress={() => setTrueChecked(!trueChecked)}
                    position="leading"
                />
                <Checkbox.Item
                    label="False"
                    status={trueChecked ? "unchecked" : "checked"}
                    onPress={() => setTrueChecked(!trueChecked)}
                    position="leading"
                />
                <Button
                    mode="contained"
                    onPress={() => {
                        questions[route.params.questionIdx].answered = true;
                        questions[route.params.questionIdx].correctAnswered =
                            trueChecked === questions[route.params.questionIdx].answer;

                        if (route.params.questionIdx < 9)
                            navigation.push("Quiz", {
                                questionIdx: route.params.questionIdx + 1,
                            });
                        else navigation.push("Finish");
                    }}
                    icon={route.params.questionIdx < 9 ? "chevron-right" : ""}
                    contentStyle={{ flexDirection: "row-reverse" }}
                >
                    {/* TODO: numquestions is hardcoded for now... */}
                    {route.params.questionIdx < 9 ? "Next" : "Finish!"}
                </Button>

                <List.Accordion
                    title="Questions"
                    left={(props) => <List.Icon {...props} icon="folder" />}
                >
                    {questions.map(
                        (_, questionIdx) =>
                            questionIdx !== route.params.questionIdx && (
                                <List.Item
                                    left={(props) => {
                                        if (questions[questionIdx].answered) {
                                            if (questions[questionIdx].correctAnswered)
                                                return (
                                                    <List.Icon
                                                        {...props}
                                                        icon="checkbox-marked-outline"
                                                    />
                                                );
                                            else
                                                return (
                                                    <List.Icon
                                                        {...props}
                                                        icon="close-box-outline"
                                                    />
                                                );
                                        }
                                        return (
                                            <List.Icon {...props} icon="checkbox-blank-outline" />
                                        );
                                    }}
                                    titleStyle={
                                        questions[questionIdx].answered
                                            ? questions[questionIdx].correctAnswered
                                                ? { color: "green" }
                                                : { color: "red" }
                                            : { color: "black" /* TODO: hardcoded */ }
                                    }
                                    key={questionIdx}
                                    title={`Question ${questionIdx + 1}${
                                        questions[questionIdx].answered ? " (done)" : ""
                                    }`}
                                    onPress={() =>
                                        navigation.push("Quiz", {
                                            questionIdx: questionIdx,
                                        })
                                    }
                                />
                            )
                    )}
                </List.Accordion>
            </ScrollView>
        </View>
    );
};

export { QuizScreen, Question };
