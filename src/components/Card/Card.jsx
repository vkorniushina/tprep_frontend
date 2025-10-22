import styles from './Card.module.scss'
import fileIcon from "../../assets/images/file.svg";
import React from "react";

const Card = ({title, description, questions, progress}) => {
    return (
        <div className={styles.card}>
            <div className={styles.topContent}>
                <h3 className={styles.title}>{title}</h3>
                {description ? <p className={styles.description}>{description}</p> :
                    <p className={styles.description} style={{color: '#a6a6a6'}}>Здесь могло быть описание...</p>}
            </div>
            <div className={styles.bottomContent}>
                <div className={styles.amount}>
                    <img src={fileIcon} alt="Doc"/>
                    <span>{questions} вопросов</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.progress}><span className={styles.bar} style={{width: `${progress}%`}}/>
                    </div>
                    <span>{progress}%</span>
                </div>
                <button className={styles.openBtn}>Открыть тест</button>
            </div>
        </div>
    )
}

export default Card;