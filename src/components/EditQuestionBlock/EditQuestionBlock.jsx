import React from "react";
import styles from "./EditQuestionBlock.module.scss";
import trash from "../../assets/images/trash.svg";
import AddIcon from "../../assets/images/add.svg?react";
import {QUESTION_TYPES} from "../../constants/questionTypes";
import {QUESTION_FIELDS} from "../../constants/questionFields";
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import OptionItem from "../OptionItem/OptionItem.jsx";

const EditQuestionBlock = ({index, data, onUpdate, onDelete, errors}) => {
    const updateField = (field, value) => {
        onUpdate({...data, [field]: value});
    };

    const updateOption = (idx, value) => {
        const updated = [...data.options];
        updated[idx] = {...updated[idx], [QUESTION_FIELDS.CONTENT]: value};
        updateField(QUESTION_FIELDS.OPTIONS, updated);
    };

    const toggleOptionCorrect = (idx) => {
        const updatedOptions = data.options.map((item, i) =>
            i === idx
                ? {...item, [QUESTION_FIELDS.IS_CORRECT]: !item.isCorrect}
                : item
        );
        updateField(QUESTION_FIELDS.OPTIONS, updatedOptions);
    };

    const addOption = () => {
        const newId = uuidv4();

        updateField(QUESTION_FIELDS.OPTIONS, [
            ...(data.options || []),
            {
                id: newId,
                [QUESTION_FIELDS.CONTENT]: `Вариант ${(data.options?.length || 0) + 1}`,
                [QUESTION_FIELDS.IS_CORRECT]: false
            }
        ]);
    };

    const removeOption = (idx) => {
        const updatedOptions = data.options.filter((_, i) => i !== idx);

        onUpdate({
            ...data,
            [QUESTION_FIELDS.OPTIONS]: updatedOptions,
        });
    };

    const handleTypeChange = (type) => {
        if (type === QUESTION_TYPES.CHOICE) {
            onUpdate({
                ...data,
                [QUESTION_FIELDS.TYPE]: type,
                [QUESTION_FIELDS.OPTIONS]: [
                    {
                        id: uuidv4(),
                        [QUESTION_FIELDS.CONTENT]: "Вариант 1",
                        [QUESTION_FIELDS.IS_CORRECT]: true
                    },
                    {
                        id: uuidv4(),
                        [QUESTION_FIELDS.CONTENT]: "Вариант 2",
                        [QUESTION_FIELDS.IS_CORRECT]: false
                    }

                ],
            });
        } else {
            onUpdate({
                ...data,
                [QUESTION_FIELDS.TYPE]: type,
                [QUESTION_FIELDS.OPTIONS]: [],
                [QUESTION_FIELDS.ANSWERS]: [{
                    id: data.answers?.[0]?.id || null,
                    [QUESTION_FIELDS.CONTENT]: data.answers?.[0]?.content || "",
                    [QUESTION_FIELDS.IS_CORRECT]: true
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
                            onChange={(e) => updateField(QUESTION_FIELDS.TEXT, e.target.value)}
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
                                    updateField(QUESTION_FIELDS.ANSWERS, [
                                        {
                                            ...(data.answers?.[0] || {}),
                                            [QUESTION_FIELDS.CONTENT]: e.target.value,
                                            [QUESTION_FIELDS.IS_CORRECT]: true
                                        }
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
                                {data.options && data.options.map((option, idx) => (
                                    <OptionItem
                                        key={option.id}
                                        option={option}
                                        index={idx}
                                        onContentChange={(value) => updateOption(idx, value)}
                                        onToggleCorrect={() => toggleOptionCorrect(idx)}
                                        onRemove={() => removeOption(idx)}
                                        error={errors.optionContent?.[idx]?.content}
                                    />
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
