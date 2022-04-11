import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Surface, ActivityIndicator, Menu, TouchableRipple } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { CommonStyles } from "../CommonStyles";
import { questionsJSONtoQuestionList } from "../utils";
import { QuestionsContext } from "../contexts";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface Category {
    id: number;
    name: string;
}

const difficultyTypes = ["easy", "medium", "hard"];

type PropTypes = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: PropTypes) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryDropdownVisible, setCategoryDropdownVisible] = React.useState(false);
    const [difficultyDropdownVisible, setDifficultyDropdownVisible] = React.useState(false);
    const [category, setCategory] = React.useState();
    const [difficulty, setDifficulty] = React.useState<typeof difficultyTypes[number]>();
    const [showButtonLoading, setShowButtonLoading] = React.useState(false);
    const [errText, setErrText] = React.useState("");
    const { questions, setQuestions, toggleTheme } = useContext(QuestionsContext);

    useEffect(() => {
        fetch("https://opentdb.com/api_category.php")
            .then((data) => data.json())
            .then((jsonData) => setCategories(jsonData.trivia_categories))
            .catch((e) => console.error(e));
    }, []);

    useEffect(() => {
        // read from about line no. 104
        if (questions.length > 0)
            navigation.push("Quiz", {
                questionIdx: 0,
            });
    }, [questions]);

    return (
        <View style={CommonStyles.screenContainer}>
            <Button icon="brightness-6" onPress={() => toggleTheme()}>
                mode
            </Button>

            {categories.length > 0 ? (
                <>
                    <DropDown
                        label="Category"
                        mode="outlined"
                        visible={categoryDropdownVisible}
                        showDropDown={() => setCategoryDropdownVisible(true)}
                        onDismiss={() => setCategoryDropdownVisible(false)}
                        value={category}
                        setValue={(_value) => setCategory(_value)}
                        list={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />

                    <DropDown
                        label="Difficulty"
                        mode="outlined"
                        visible={difficultyDropdownVisible}
                        showDropDown={() => setDifficultyDropdownVisible(true)}
                        onDismiss={() => setDifficultyDropdownVisible(false)}
                        value={difficulty}
                        setValue={setDifficulty}
                        list={difficultyTypes.map((x) => ({
                            label: x.charAt(0).toUpperCase() + x.substring(1),
                            value: x.toLowerCase(),
                        }))}
                    />

                    <Button
                        mode="contained"
                        onPress={() => {
                            setShowButtonLoading(true);
                            fetch(
                                `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=boolean`
                            )
                                .then((response) => response.json())
                                .then((jsonData) => {
                                    if (jsonData.response_code == 1) {
                                        setErrText(
                                            "Not enough questions for these selections, please change category, difficulty or both."
                                        );
                                    } else if (jsonData.response_code == 0) {
                                        setErrText("");
                                        setQuestions(questionsJSONtoQuestionList(jsonData));
                                        // it makes more sense to navigate to quizscreen from here,
                                        // but setState is async, so we have to create a useEffect
                                        // (defined above)... The rest is done there
                                    } else {
                                        setErrText("Facing some internal issues! Please try later");
                                    }
                                    setShowButtonLoading(false);
                                })
                                .catch((err) => {
                                    setErrText(err);
                                    setShowButtonLoading(false);
                                });
                        }}
                        loading={showButtonLoading}
                        icon="chevron-right"
                        contentStyle={{ flexDirection: "row-reverse" }}
                    >
                        Next
                    </Button>

                    <Text style={{ color: "red" }}>{errText}</Text>
                </>
            ) : (
                <ActivityIndicator />
            )}
        </View>
    );
};

export default HomeScreen;
