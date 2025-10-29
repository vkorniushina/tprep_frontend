import styles from './QuestionAnswers.module.scss';

const QuestionAnswers = ({ question }) => {
    if (question.type === 'INPUT') {
        return (
            <div className={styles.answerSection}>
                <p className={styles.label}>Правильный ответ:</p>
                <div className={`${styles.answer} ${styles.correct}`}>
                    {question.answers.find(answer => answer.isCorrect)?.content}
                </div>
            </div>
        );
    }

    if (question.type === 'CHOICE') {
        return (
            <div className={styles.answerSection}>
                <p className={styles.label}>Варианты ответов:</p>
                <div className={styles.answers}>
                    {question.answers.map((answer, i) => (
                        <div
                            key={i}
                            className={`${styles.answer} ${
                                answer.isCorrect ? styles.correct : ""
                            }`}
                        >
                            {answer.content}
                            {answer.isCorrect && (
                                <span className={styles.check}>✓</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default QuestionAnswers;