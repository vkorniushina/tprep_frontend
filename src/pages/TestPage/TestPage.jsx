import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import HeaderTest from "../../components/HeaderTest/HeaderTest";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import styles from "./TestPage.module.scss";
import {
    getModuleById,
    getModuleByToken,
    getModuleQuestions,
    getModuleQuestionsByToken,
    updateModuleAccess
} from "../../api/modules.js";
import QuestionBlock from "../../components/QuestionBlock/QuestionBlock.jsx";
import TestState from "../../components/TestState/TestState.jsx";
import {formatDate} from "../../utils/dateFormatter.js";
import {PROFILE_TABS} from "../../constants/profileConstants.js";
import BellIcon from "../../assets/images/bell.svg?react";
import LinkIcon from "../../assets/images/link.svg?react";
import KebabMenu from "../../components/KebabMenu/KebabMenu.jsx";
import AccessModal from "../../components/AccessModal/AccessModal.jsx";
import {buildShareLink} from "../../utils/linkUtils.js";

const TestPage = () => {
    const navigate = useNavigate();
    const {id, shareToken} = useParams();

    const [showQuestions, setShowQuestions] = useState(false);
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState({
        test: true,
        questions: false
    });

    const [error, setError] = useState({
        test: null,
        questions: null,
    });

    const [isAccessOpen, setIsAccessOpen] = useState(false);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setLoading(prev => ({...prev, test: true}));

                let data;
                if (shareToken) {
                    data = await getModuleByToken(shareToken);
                } else {
                    data = await getModuleById(Number(id));
                }

                setTestData(data);
                setError((prev) => ({...prev, test: null}));
            } catch (err) {
                setError((prev) => ({
                    ...prev, test: "Не удалось загрузить информацию о тесте"
                }));
                console.error('Error fetching test data:', err);
            } finally {
                setLoading(prev => ({...prev, test: false}));
            }
        };

        if (id || shareToken) {
            fetchTestData();
        }
    }, [id, shareToken]);

    const fetchQuestions = async () => {
        try {
            setLoading(prev => ({...prev, questions: true}));

            let questionsData;
            if (shareToken) {
                questionsData = await getModuleQuestionsByToken(shareToken);
            } else {
                questionsData = await getModuleQuestions(Number(id));
            }

            setQuestions(questionsData.questions);
            setError((prev) => ({...prev, questions: null}));
        } catch (err) {
            setError((prev) => ({
                ...prev, questions: "Не удалось загрузить вопросы теста"
            }));
            console.error('Error fetching questions:', err);
        } finally {
            setLoading(prev => ({...prev, questions: false}));
        }
    };

    const handleToggleQuestions = () => {
        if (!showQuestions && questions.length === 0) {
            fetchQuestions();
        }
        setShowQuestions(!showQuestions);
    };

    const handleOpenReminders = () => {
        navigate("/profile", {state: {tab: PROFILE_TABS.REMINDERS}});
    };

    const handleOpenAccess = () => {
        setIsAccessOpen(true);
    };

    const handleSaveAccess = async (accessMode) => {
        try {
            const result = await updateModuleAccess(Number(id), accessMode);
            setTestData((prev) => ({
                ...prev,
                accessMode: result.accessMode,
                shareToken: result.shareToken,
            }));
        } catch (err) {
            console.error("Failed to update access:", err);
            throw err;
        }
    };

    const menuItems = [
        {id: "reminders", label: "Настроить напоминания", icon: BellIcon, onClick: handleOpenReminders},
        {id: "access", label: "Настройки доступа", icon: LinkIcon, onClick: handleOpenAccess},
    ];

    if (loading.test) return <TestState type="loading"/>;
    if (error.test || !testData) return <TestState type="error" message={error.test}/>;

    const {
        name,
        description,
        lastUse,
        progress,
        questionsCount,
        accessMode,
        shareToken: currentToken,
        owner
    } = testData;

    return (
        <>
            <HeaderTest
                name={name}
                id={id}
                shareToken={shareToken}
                disabledStart={questionsCount === 0}
                isOwner={owner}
            />
            <main className={`container ${styles.main}`}>
                <section className={styles.info}>
                    {owner && <KebabMenu items={menuItems}/>}
                    <h2>Описание теста</h2>
                    {description ? <p className={styles.description}>{description}</p> :
                        <p className={`${styles.description} ${styles.descriptionEmpty}`}>
                            Здесь могло быть описание...
                        </p>}
                    <div className={styles.lastUse}>
                        Последнее прохождение: {formatDate(lastUse)}
                    </div>

                    <ProgressBar value={progress || 0} total={questionsCount || 0}/>
                </section>

                <div className={styles.toggle}>
                    <button
                        className={styles.toggleBtn}
                        onClick={handleToggleQuestions}
                        disabled={loading.questions}
                    >
                        {showQuestions ? "Скрыть вопросы" : "Показать вопросы"}
                    </button>
                </div>

                {showQuestions && (
                    <section className={styles.questions}>
                        <h2>Вопросы теста</h2>
                        {loading.questions ? (
                            <div className={styles.loadingState}>Загрузка вопросов...</div>
                        ) : error.questions ? (
                            <div className={styles.errorState}>
                                {error.questions}
                            </div>
                        ) : questions.length > 0 ? (
                            questions.map((question, index) => (
                                <QuestionBlock
                                    key={question.id}
                                    question={question}
                                    index={index}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>Вопросов пока нет</div>
                        )}
                    </section>
                )}
            </main>
            {isAccessOpen && (
                <AccessModal
                    initialMode={accessMode}
                    shareLink={buildShareLink(currentToken)}
                    onClose={() => setIsAccessOpen(false)}
                    onSave={handleSaveAccess}
                />
            )}
        </>
    );
};

export default TestPage;
