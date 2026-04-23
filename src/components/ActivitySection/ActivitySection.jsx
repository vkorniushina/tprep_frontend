import React, {useState} from "react";
import styles from "./ActivitySection.module.scss";
import YearHeatmap from "../YearHeatmap/YearHeatmap.jsx";
import WeekBarChart from "../WeekBarChart/WeekBarChart.jsx";
import classNames from "classnames";
import {ACTIVITY_MODES} from "../../constants/profileConstants.js";

const ActivitySection = ({activity}) => {
    const [mode, setMode] = useState(ACTIVITY_MODES.WEEK);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.title}>Активность прохождений</h2>
                <div className={styles.toggle}>
                    <button
                        className={classNames(styles.toggleBtn, {
                            [styles.active]: mode === ACTIVITY_MODES.WEEK,
                        })}
                        onClick={() => setMode(ACTIVITY_MODES.WEEK)}
                    >
                        Неделя
                    </button>
                    <button
                        className={classNames(styles.toggleBtn, {
                            [styles.active]: mode === ACTIVITY_MODES.YEAR,
                        })}
                        onClick={() => setMode(ACTIVITY_MODES.YEAR)}
                    >
                        Год
                    </button>
                </div>
            </div>

            {mode === ACTIVITY_MODES.WEEK && <WeekBarChart activity={activity}/>}
            {mode === ACTIVITY_MODES.YEAR && <YearHeatmap activity={activity}/>}
        </div>
    );
};

export default ActivitySection;
