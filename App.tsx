import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Question, QuizScreen } from "./Screens/QuizScreen";
import React, { useContext, useEffect, useState } from "react";
import HomeScreen from "./Screens/HomeScreen";
import { QuestionsContext } from "./Contexts";
import FinishScreen from "./Screens/FinishScreen";
// import Icon from "@expo/vector-icons/MaterialIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { Theme } from "react-native-paper/lib/typescript/types";

const lightTheme: Theme = {
    ...DefaultTheme,
};

const darkTheme: Theme = {
    ...DefaultTheme,
    dark: true,
    mode: "exact", //TODO: ?
    roundness: 25,
    colors: {
        ...DefaultTheme.colors,
        primary: "#3498db",
        accent: "#f1c40f",
        // background: "#000000",
        // surface: "#000000"
    },
};

type RootStackParamList = {
    Home: undefined;
    Quiz: { questionIdx: number };
    Finish: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => (theme === "light" ? setTheme("dark") : setTheme("light"));

    return (
        <QuestionsContext.Provider
            value={{ questions: questions, setQuestions: setQuestions, toggleTheme: toggleTheme }}
        >
            <PaperProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen
                            name="Quiz"
                            component={QuizScreen}
                            initialParams={{ questionIdx: 0 }}
                            options={({ route }) => ({
                                title: `Question ${route.params.questionIdx + 1}`,
                            })}
                        />
                        <Stack.Screen
                            name="Finish"
                            component={FinishScreen}
                            // TODO: https://github.com/expo/vector-icons/issues/26
                            // options={{
                            //     headerBackImageSource: MaterialIcons.getImageSourceSync("home", 24, "black"),
                            // }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </QuestionsContext.Provider>
    );
};

export { RootStackParamList };

export default App;
