import React, {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styles from "./EditTestPage.module.scss";
import EditQuestionBlock from "../../components/EditQuestionBlock/EditQuestionBlock.jsx";
import HeaderEditTest from "../../components/HeaderEditTest/HeaderEditTest.jsx";
import AddIcon from "../../assets/images/add.svg?react";
import ArrowUp from "../../assets/images/arrow_left.svg?react";
import {getModuleById, getModuleQuestions, updateModule} from "../../api/modules.js";
import {QUESTION_TYPES} from "../../constants/questionTypes.js";
import TestState from "../../components/TestState/TestState.jsx";
import {validateModuleForm} from "../../utils/validateEditTest.js";
import classNames from "classnames";
import ToastNotification from "../../components/ToastNotification/ToastNotification.jsx";
import UnsavedChangesModal from "../../components/UnsavedChangesModal/UnsavedChangesModal.jsx";
import {QUESTION_FIELDS} from "../../constants/questionFields.js";
import { v4 as uuidv4 } from 'uuid';

const EditTestPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

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

    const [toast, setToast] = useState({
        visible: false,
        type: "success",
        message: ""
    });

    const [originalData, setOriginalData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const pendingNavigation = useRef(null);
    const isDirtyRef = useRef(false);
    const allowExitRef = useRef(false);

    const isDirty = useMemo(() => {
        if (!originalData) return false;
        if (title !== originalData.title || description !== originalData.description)
            return true;
        return JSON.stringify(questions) !== JSON.stringify(originalData.questions);
    }, [title, description, questions, originalData]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const moduleData = await getModuleById(Number(id));
                setTitle(moduleData.name || "");
                setDescription(moduleData.description || "");

                const qData = await getModuleQuestions(Number(id));

                const formattedQuestions = qData.questions.map(q => {
                    if (q[QUESTION_FIELDS.TYPE] === QUESTION_TYPES.CHOICE) {
                        return {
                            id: q.id,
                            [QUESTION_FIELDS.TYPE]: q.type,
                            [QUESTION_FIELDS.TEXT]: q.content,
                            [QUESTION_FIELDS.OPTIONS]: q.answers?.map(a => ({
                                id: a.id,
                                [QUESTION_FIELDS.CONTENT]: a.content,
                                [QUESTION_FIELDS.IS_CORRECT]: a.isCorrect
                            })) || [],
                            [QUESTION_FIELDS.ANSWERS]: []
                        };
                    }

                    return {
                        id: q.id,
                        [QUESTION_FIELDS.TYPE]: q.type,
                        [QUESTION_FIELDS.TEXT]: q.content,
                        [QUESTION_FIELDS.ANSWERS]: [
                            {
                                id: q.answers?.[0]?.id,
                                [QUESTION_FIELDS.CONTENT]: q.answers?.[0]?.content || "",
                                [QUESTION_FIELDS.IS_CORRECT]: true
                            }
                        ],
                        [QUESTION_FIELDS.OPTIONS]: [],
                    };
                });

                setQuestions(formattedQuestions);
                setOriginalData({
                    title: moduleData.name || "",
                    description: moduleData.description || "",
                    questions: formattedQuestions,
                });
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

    useEffect(() => {
        isDirtyRef.current = isDirty;
    }, [isDirty]);

    useEffect(() => {
        window.history.pushState({ locked: true }, "");

        const handlePopState = () => {
            if (allowExitRef.current) {
                navigate(-1);
                return;
            }

            if (isDirtyRef.current) {
                pendingNavigation.current = () => navigate(-1);
                setShowModal(true);

                window.history.pushState({ locked: true }, "");
            }
            else {
                navigate(-1);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

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

    const addQuestion = () => {
        const newId = uuidv4();
        setQuestions(prev => [
            ...prev,
            {
                id: newId,
                [QUESTION_FIELDS.TYPE]: QUESTION_TYPES.INPUT,
                [QUESTION_FIELDS.TEXT]: "",
                [QUESTION_FIELDS.ANSWERS]: [
                    {id: null, [QUESTION_FIELDS.CONTENT]: "", [QUESTION_FIELDS.IS_CORRECT]: true}
                ],
                [QUESTION_FIELDS.OPTIONS]: [],
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
                const newErrors = {...prev};
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

                if (q[QUESTION_FIELDS.TYPE] === QUESTION_TYPES.CHOICE) {
                    return {
                        questionId: questionIdValue,
                        content: q[QUESTION_FIELDS.TEXT],
                        type: QUESTION_TYPES.CHOICE,
                        answers: q[QUESTION_FIELDS.OPTIONS].map(ans => ({
                            answerId: typeof ans.id === 'string' ? undefined : ans.id,
                            content: ans[QUESTION_FIELDS.CONTENT],
                            isCorrect: ans[QUESTION_FIELDS.IS_CORRECT]
                        }))
                    };
                }

                return {
                    questionId: questionIdValue,
                    content: q[QUESTION_FIELDS.TEXT],
                    type: QUESTION_TYPES.INPUT,
                    answers: [
                        {
                            answerId: typeof q[QUESTION_FIELDS.ANSWERS]?.[0]?.id === "string"
                                ? undefined
                                : q[QUESTION_FIELDS.ANSWERS]?.[0]?.id,
                            content: q[QUESTION_FIELDS.ANSWERS]?.[0]?.[QUESTION_FIELDS.CONTENT] || "",
                            isCorrect: true
                        }
                    ]
                };
            })
        };
    };

    const handleSave = async () => {
        const {isValid, formErrors, questionErrors, firstError} = validateModuleForm(
            title,
            description,
            questions
        );

        setFormErrors(formErrors);
        setQuestionErrors(questionErrors);

        if (!isValid) {
            if (firstError.type === "form") {
                if (firstError.id === "title") {
                    titleRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
                }
                if (firstError.id === "description") {
                    descriptionRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
                }
            }
            if (firstError.type === "question") {
                const el = questionRefs.current[firstError.id];
                if (el) el.scrollIntoView({behavior: "smooth", block: "center"});
            }
            showToast("error", "Проверьте правильность заполнения формы");
            return false;
        }

        try {
            const body = buildRequestBody();
            await updateModule(Number(id), body);

            showToast("success", "Изменения успешно сохранены");
            setOriginalData({
                title,
                description,
                questions: JSON.parse(JSON.stringify(questions)),
            });
            return true;
        } catch (err) {
            console.error('Error updating test:', err);
            showToast("error", "Не удалось сохранить изменения. Попробуйте позже");
            return false;
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (formErrors.title) {
            setFormErrors(prev => ({...prev, title: undefined}));
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (formErrors.description) {
            setFormErrors(prev => ({...prev, description: undefined}));
        }
    };

    const showToast = (type, message) => {
        setToast({visible: true, type, message});
    };

    const hideToast = () => {
        setToast(prev => ({...prev, visible: false}));
    };

    const handleBackClick = () => {
        if (isDirty) {
            pendingNavigation.current = () => navigate(-1);
            setShowModal(true);
        } else {
            navigate(-1);
        }
    };

    const handleModalSaveAndExit = async () => {
        const success = await handleSave();
        setShowModal(false);
        if (success && pendingNavigation.current) {
            allowExitRef.current = true;
            pendingNavigation.current();
        }
        pendingNavigation.current = null;
    };

    const handleModalDiscard = () => {
        setShowModal(false);
        allowExitRef.current = true;
        pendingNavigation.current();
        pendingNavigation.current = null;
    };

    const handleModalCancel = () => {
        setShowModal(false);
        allowExitRef.current = false;
        pendingNavigation.current = null;
    };

    if (loading) return <TestState type="loading" message="Загрузка данных теста..."/>;
    if (error) return <TestState type="error" message={error}/>;

    return (
        <>
            <div className={styles.wrapper} ref={topRef}>
                <HeaderEditTest onBack={handleBackClick} onSave={handleSave} />
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
                            {formErrors.description &&
                                <div className={styles.errorMessage}>{formErrors.description}</div>}
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
                        className={classNames(styles.scrollTopButton, {
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
            {toast.visible && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}

            <UnsavedChangesModal
                isVisible={showModal}
                onSave={handleModalSaveAndExit}
                onDiscard={handleModalDiscard}
                onCancel={handleModalCancel}
            />
        </>
    );
};

export default EditTestPage;
