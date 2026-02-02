import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./HeaderTest.module.scss";
import arrowLeft from "../../assets/images/arrow_left.svg";
import editIcon from "../../assets/images/edit.svg";
import playIcon from "../../assets/images/play.svg";

const HeaderTest = ({name, id, disabledStart = false}) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleStartTest = () => {
        navigate(`/test/${id}/quiz`);
    };

    const handleEditClick = () => {
        navigate(`/test/${id}/edit`);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <img src={arrowLeft}
                         className={styles.backIcon}
                         onClick={handleBackClick}
                    />
                    <h1 className={styles.title}>{name}</h1>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.editBtn} onClick={handleEditClick}>
                        <img src={editIcon}/> Редактировать
                    </button>
                    <button className={`${styles.startBtn} ${disabledStart ? styles.disabled : ""}`}
                            onClick={handleStartTest}
                            disabled={disabledStart}
                    >
                        <img src={playIcon}/> Начать тест
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderTest;
