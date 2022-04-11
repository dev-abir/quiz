import { Question } from "./Screens/QuizScreen";

const questionsJSONtoQuestionList = (questionsJSON: any) => {
    let questionList: Question[] = questionsJSON.results.map((q: any) => ({
        question: q.question,
        answer: q.correct_answer.toLowerCase() === "true",
        answered: false,
        correctAnswered: false,
    }));
    return questionList;
};

export { questionsJSONtoQuestionList };
