import styles from './Card.module.scss'
import fileIcon from "../../assets/images/file.svg";
import React from "react";

const Card = ({id, name, description, questionsCount, progress}) => {

    const percent = questionsCount === 0 ? 0 : (progress / questionsCount) * 100;
    const displayPercent = Math.round(percent);

    return (
        <div className={styles.card}>
            <div className={styles.topContent}>
                <h3 className={styles.name}>{name}</h3>
                {description ? <p className={styles.description}>{description}</p> :
                    <p className={`${styles.description} ${styles.descriptionEmpty}`} >Здесь могло быть описание...</p>}
            </div>
            <div className={styles.bottomContent}>
                <div className={styles.amount}>
                    <img src={fileIcon} alt="Doc"/>
                    <span>{questionsCount} вопросов</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.progress}><span className={styles.bar} style={{width: `${displayPercent}%`}}/>
                    </div>
                    <span>{displayPercent}%</span>
                </div>
                <button className={styles.openBtn}>Открыть тест</button>
            </div>
        </div>

    )
}

export default Card;
