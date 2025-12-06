import React from "react";
import styles from "./EditQuestionBlock.module.scss";
import trash from "../../assets/images/trash.svg";
import tick from "../../assets/images/tick.svg";
import Cross from "../../assets/images/cross.svg?react";
import AddIcon from "../../assets/images/add.svg?react";
import {QUESTION_TYPES} from "../../constants/questionTypes";
import classNames from 'classnames';

const EditQuestionBlock = ({index, data, onUpdate, onDelete, errors}) => {
    const updateField = (field, value) => {
        onUpdate({...data, [field]: value});
    };

    const updateOption = (idx, value) => {
        const updated = [...data.options];
        updated[idx] = {...updated[idx], content: value};
        updateField("options", updated);
    };

    const addOption = () => {
        const newId = 'temp-answer-' + Date.now();

        updateField("options", [
            ...(data.options || []),
            {
                id: newId,
                content: `Вариант ${(data.options?.length || 0) + 1}`,
                isCorrect: false
            }
        ]);
    };

    const removeOption = (idx) => {
        const updatedOptions = data.options.filter((_, i) => i !== idx);

        onUpdate({
            ...data,
            options: updatedOptions,
        });
    };

    const handleTypeChange = (type) => {
        if (type === QUESTION_TYPES.CHOICE) {
            const tempId1 = 'temp-answer-' + Date.now();
            const tempId2 = 'temp-answer-' + (Date.now() + 1);

            onUpdate({
                ...data,
                type,
                options: [
                    {id: tempId1, content: "Вариант 1", isCorrect: true},
                    {id: tempId2, content: "Вариант 2", isCorrect: false}
                ],
            });
        } else {
            onUpdate({
                ...data,
                type,
                options: [],
                answers: [{
                    id: data.answers?.[0]?.id || null,
                    content: data.answers?.[0]?.content || "",
                    isCorrect: true
                }]
            });
        }
    };

    return (
        <div className={styles.card}>
            <img src={trash} alt="Удалить" className={styles.delete} onClick={onDelete}/>

            <div className={styles.content}>
                <div className={styles.index}>{index}</div>

                <div className={styles.contentMain}>
                    <div className={styles.section}>
                        <div className={styles.header}>Вопрос</div>
                        <input
                            className={classNames(styles.questionInput, errors.text && styles.inputError)}
                            placeholder="Введите текст вопроса"
                            value={data.text || ""}
                            onChange={(e) => updateField("text", e.target.value)}
                        />
                        {errors.text && <div className={styles.errorMessage}>{errors.text}</div>}
                    </div>

                    <div className={styles.section}>
                        <div className={styles.header}>Тип вопроса</div>

                        <div className={styles.radioContainer}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    className={styles.radioInput}
                                    checked={data.type === QUESTION_TYPES.INPUT}
                                    onChange={() => handleTypeChange(QUESTION_TYPES.INPUT)}
                                />
                                <span className={styles.radioCircle}></span>
                                <span className={styles.radioText}>Текстовый ответ</span>
                            </label>

                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    className={styles.radioInput}
                                    checked={data.type === QUESTION_TYPES.CHOICE}
                                    onChange={() => handleTypeChange(QUESTION_TYPES.CHOICE)}
                                />
                                <span className={styles.radioCircle}></span>
                                <span className={styles.radioText}>Множественный выбор</span>
                            </label>
                        </div>
                    </div>

                    {data.type === QUESTION_TYPES.INPUT && (
                        <div className={styles.section}>
                            <div className={styles.header}>Правильный ответ</div>
                            <textarea
                                className={classNames(styles.answerTextarea, errors.answer && styles.inputError)}
                                placeholder="Введите правильный ответ"
                                value={data.answers?.[0]?.content || ""}
                                onChange={(e) =>
                                    updateField("answers", [
                                        {...(data.answers?.[0] || {}), content: e.target.value, isCorrect: true}
                                    ])
                                }
                            />
                            {errors.answer && <div className={styles.errorMessage}>{errors.answer}</div>}
                        </div>
                    )}

                    {data.type === QUESTION_TYPES.CHOICE && (
                        <div className={styles.section}>
                            <div className={styles.headerOption}>Варианты ответов</div>
                            <div className={styles.optionsHelper}>
                                {errors.optionsHelper
                                    ? <span className={styles.optionsHelperError}>{errors.optionsHelper}</span>
                                    : "Отметьте правильные варианты галочкой"}
                            </div>

                            <div className={styles.optionsList}>
                                {data.options && data.options.map((ans, idx) => (
                                    <div key={ans.id} className={styles.optionItem}>
                                        <div className={styles.optionContentWrapper}>
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkboxInput}
                                                    checked={ans.isCorrect}
                                                    onChange={() => {
                                                        const updatedOptions = data.options.map((item, i) =>
                                                            i === idx ? {...item, isCorrect: !item.isCorrect} : item
                                                        );
                                                        updateField("options", updatedOptions);
                                                    }}
                                                />
                                                <span className={styles.checkboxSquare}>
                                                {ans.isCorrect && (
                                                    <img src={tick} alt="Выбрано" className={styles.checkboxTick}/>
                                                )}
                                                </span>
                                            </label>

                                            <input
                                                className={className(
                                                    styles.optionInput,
                                                    errors.optionContent?.[idx]?.content && styles.inputError
                                                )}
                                                value={ans.content}
                                                onChange={(e) => updateOption(idx, e.target.value)}
                                            />

                                            <button className={styles.optionRemove} onClick={() => removeOption(idx)}>
                                                <Cross className={styles.cross}/>
                                            </button>
                                        </div>
                                        {errors.optionContent?.[idx]?.content && (
                                            <div className={styles.errorMessageFlow}>{errors.optionContent[idx].content}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {(data.options?.length || 0) < 5 && (
                                <button className={styles.addOptionBtn} onClick={addOption}>
                                    <AddIcon className={styles.add}/> Добавить вариант
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditQuestionBlock;
