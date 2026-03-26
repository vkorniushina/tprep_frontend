import React from 'react';
import styles from './QuestionContainer.module.scss';
import QuestionInputForm from '../QuestionInputForm/QuestionInputForm';
import QuestionChoiceForm from '../QuestionChoiceForm/QuestionChoiceForm';
import { QUESTION_TYPES } from '../../constants/questionTypes';

const QuestionContainer = ({
                               question,
                               userAnswer,
                               selectedAnswers,
                               isChecked,
                               isCorrect,
                               correctAnswer,
                               correctAnswerIds,
                               onInputChange,
                               onChoiceSelect,
                           }) => {
    return (
        <div className={styles.questionContainer}>
            <h2 className={styles.questionText}>
                {question.content}
            </h2>

            <div className={styles.answerForm}>
                {question.type === QUESTION_TYPES.INPUT ? (
                    <QuestionInputForm
                        value={userAnswer}
                        onChange={onInputChange}
                        disabled={isChecked}
                        isChecked={isChecked}
                        isCorrect={isCorrect}
                        correctAnswer={correctAnswer}
                    />
                ) : (
                    <QuestionChoiceForm
                        answers={question.answers}
                        selected={selectedAnswers}
                        onSelect={onChoiceSelect}
                        disabled={isChecked}
                        isChecked={isChecked}
                        correctAnswers={correctAnswerIds}
                    />
                )}
            </div>
        </div>
    );
};

export default QuestionContainer;
