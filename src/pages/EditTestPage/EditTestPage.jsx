import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import styles from "./EditTestPage.module.scss";
import EditQuestionBlock from "../../components/EditQuestionBlock/EditQuestionBlock.jsx";
import HeaderEditTest from "../../components/HeaderEditTest/HeaderEditTest.jsx";
import AddIcon from "../../assets/images/add.svg?react";
import ArrowUp from "../../assets/images/arrow_left.svg?react";
import {getModuleById, getModuleQuestions, updateModule} from "../../api/modules.js";
import {QUESTION_TYPES} from "../../constants/questionTypes.js";
import TestState from "../../components/TestState/TestState.jsx";
import { validateModuleForm } from "../../utils/validateEditTest.js";
import className from "classnames";

const EditTestPage = () => {
    const {id} = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showScrollTop, setShowScrollTop] = useState(false);
    const lastQuestionRef = useRef(null);
    const topRef = useRef(null);

    const [formErrors, setFormErrors] = useState({});
    const [questionErrors, setQuestionErrors] = useState({});

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const questionRefs = useRef({});

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const moduleData = await getModuleById(Number(id));
                setTitle(moduleData.name || "");
                setDescription(moduleData.description || "");

                const qData = await getModuleQuestions(Number(id));

                const formattedQuestions = qData.questions.map(q => {
                    if (q.type === QUESTION_TYPES.CHOICE) {
                        return {
                            id: q.id,
                            type: q.type,
                            text: q.content,
                            options: q.answers?.map(a => ({
                                id: a.id,
                                content: a.content,
                                isCorrect: a.isCorrect
                            })) || [],
                            answers: []
                        };
                    }

                    return {
                        id: q.id,
                        type: q.type,
                        text: q.content,
                        answers: [
                            {
                                id: q.answers?.[0]?.id,
                                content: q.answers?.[0]?.content || "",
                                isCorrect: true
                            }
                        ],
                        options: [],
                    };
                });

                setQuestions(formattedQuestions);
                setError(null);
            } catch (err) {
                console.error('Error fetching test data:', err);
                setError("Не удалось загрузить данные теста");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const addQuestion = () => {
        const newId = 'temp-' + Date.now();
        setQuestions(prev => [
            ...prev,
            {
                id: newId,
                type: QUESTION_TYPES.INPUT,
                text: "",
                answers: [
                    {id: null, content: "", isCorrect: true}
                ],
                options: [],
            }
        ]);

        setTimeout(() => {
            lastQuestionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 100);
    };

    const updateQuestion = (id, updated) => {
        setQuestions(prev =>
            prev.map(q => q.id === id ? updated : q)
        );
        if (questionErrors[id]) {
            setQuestionErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const deleteQuestion = (id) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const buildRequestBody = () => {
        return {
            name: title,
            description: description,
            questions: questions.map(q => {
                const isNewQuestion = typeof q.id === 'string';
                const questionIdValue = isNewQuestion ? undefined : q.id;

                if (q.type === QUESTION_TYPES.CHOICE) {
                    return {
                        questionId: questionIdValue,
                        content: q.text,
                        type: QUESTION_TYPES.CHOICE,
                        answers: q.options.map(ans => ({
                            answerId: typeof ans.id === 'string' ? undefined : ans.id,
                            content: ans.content,
                            isCorrect: ans.isCorrect
                        }))
                    };
                }

                return {
                    questionId: questionIdValue,
                    content: q.text,
                    type: QUESTION_TYPES.INPUT,
                    answers: [
                        {
                            answerId: typeof q.answers?.[0]?.id === "string"
                                ? undefined
                                : q.answers?.[0]?.id,
                            content: q.answers?.[0]?.content || "",
                            isCorrect: true
                        }
                    ]
                };
            })
        };
    };

    const handleSave = async () => {
        const { isValid, formErrors, questionErrors, firstError } = validateModuleForm(
            title,
            description,
            questions
        );

        setFormErrors(formErrors);
        setQuestionErrors(questionErrors);

        if (!isValid) {
            if (firstError.type === "form") {
                if (firstError.id === "title") {
                    titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                if (firstError.id === "description") {
                    descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            if (firstError.type === "question") {
                const el = questionRefs.current[firstError.id];
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        try {
            const body = buildRequestBody();
            await updateModule(Number(id), body);

        } catch (err) {
            console.error('Error updating test:', err);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (formErrors.title) {
            setFormErrors(prev => ({ ...prev, title: undefined }));
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (formErrors.description) {
            setFormErrors(prev => ({ ...prev, description: undefined }));
        }
    };

    if (loading) return <TestState type="loading" message="Загрузка данных теста..."/>;
    if (error) return <TestState type="error" message={error}/>;

    return (
        <div className={styles.wrapper} ref={topRef}>
            <HeaderEditTest onSave={handleSave}/>

            <main className="container">
                <div className={styles.form}>
                    <div className={styles.block}>
                        <label>Название</label>
                        <input placeholder="Введите название теста"
                               ref={titleRef}
                               value={title}
                               onChange={handleTitleChange}
                               className={formErrors.title && styles.inputError}
                        />
                        {formErrors.title && <div className={styles.errorMessage}>{formErrors.title}</div>}
                    </div>

                    <div className={styles.block}>
                        <label>Описание</label>
                        <textarea placeholder="Введите краткое описание"
                                  ref={descriptionRef}
                                  value={description}
                                  onChange={handleDescriptionChange}
                                  className={formErrors.description && styles.inputError}
                        />
                        {formErrors.description && <div className={styles.errorMessage}>{formErrors.description}</div>}
                    </div>
                </div>

                <div className={styles.questionsHeader}>
                    <h2>Вопросы ({questions.length})</h2>
                    <button className={styles.addQuestionBtn} onClick={addQuestion}>
                        <AddIcon className={styles.addIcon}/> Добавить вопрос
                    </button>
                </div>

                <div className={styles.questionContainer}>
                    {questions.map((q, i) => (
                        <div
                            key={q.id}
                            ref={el => {
                                questionRefs.current[q.id] = el;
                                if (i === questions.length - 1) lastQuestionRef.current = el;
                            }}
                        >
                            <EditQuestionBlock
                                key={q.id}
                                index={i + 1}
                                data={q}
                                onUpdate={(upd) => updateQuestion(q.id, upd)}
                                onDelete={() => deleteQuestion(q.id)}
                                errors={questionErrors[q.id] || {}}
                            />
                        </div>
                    ))}
                </div>

                {questions.length > 1 && (
                    <div className={styles.addQuestionBtnContainer}>
                        <button className={styles.addQuestionBtn} onClick={addQuestion}>
                            <AddIcon className={styles.addIcon}/> Добавить вопрос
                        </button>
                    </div>
                )}

                <button
                    className={className(styles.scrollTopButton, {
                        [styles.show]: showScrollTop,
                        [styles.hide]: !showScrollTop,
                    })}
                    onClick={scrollToTop}
                    aria-label="Наверх"
                >
                    <ArrowUp className={styles.arrowUp}/>
                </button>

            </main>
        </div>
    );
};

export default EditTestPage;
