import React from "react";
import styles from "./StatsCards.module.scss";
import StatCard from "../StatCard/StatCard.jsx";
import DoneIcon from "../../assets/images/done.svg?react";
import FlameIcon from "../../assets/images/flame.svg?react";
import StarIcon from "../../assets/images/star.svg?react";

const getStatCards = (stats) => [
    {key: "testsCompleted", value: stats.testsCompleted, label: "Тестов пройдено", Icon: DoneIcon},
    {key: "currentStreak", value: stats.currentStreak, label: "Дней подряд", Icon: FlameIcon},
    {key: "avgScore", value: `${stats.avgScore}%`, label: "Средний результат", Icon: StarIcon},
];

const StatsCards = ({stats}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.cards}>
                {getStatCards(stats).map(({key, value, label, Icon}) => (
                    <StatCard key={key} value={value} label={label} Icon={Icon}/>
                ))}
            </div>
        </div>
    );
};

export default StatsCards;
