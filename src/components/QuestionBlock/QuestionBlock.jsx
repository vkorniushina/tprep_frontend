import React from 'react';
import styles from './QuestionBlock.module.scss';
import QuestionAnswers from "../QuestionAnswers/QuestionAnswers.jsx";

const QuestionBlock = ({ question, index }) => {
    return (
        <div className={styles.questionBlock}>
            <div className={styles.questionIndex}>
                {index + 1}
            </div>
            <div className={styles.question}>
                <p className={styles.questionText}>
                    {question.content}
                </p>
                <QuestionAnswers question={question} />
            </div>
        </div>
    );
};

export default QuestionBlock;
