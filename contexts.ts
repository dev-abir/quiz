import React from "react";
import { Question } from "./Screens/QuizScreen";

interface QuestionsContextTypes {
    questions: Question[];
    setQuestions: (qs: Question[]) => void;
    toggleTheme: () => void;
}

// TODO: runtime typecheck?
const QuestionsContext = React.createContext<QuestionsContextTypes>({
    questions: [],
    setQuestions: (qs: Question[]) => {},
    toggleTheme: () => {},
});

export { QuestionsContext };
