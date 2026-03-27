import React from "react";
import styles from "./HeaderProfile.module.scss";
import arrowLeft from "../../assets/images/arrow_left.svg";
import {useNavigate} from "react-router-dom";

const HeaderProfile = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <img src={arrowLeft}
                         className={styles.backIcon}
                         onClick={handleBackClick}
                    />
                    <h1 className={styles.title}>Личный кабинет</h1>
                </div>
            </div>
        </header>
    );
};

export default HeaderProfile;
