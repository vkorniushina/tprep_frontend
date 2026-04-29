import React, {useState, useMemo, useCallback, useRef} from "react";
import classNames from "classnames";
import styles from "./YearHeatmap.module.scss";
import {generateHeatmapData, getActivityLevel} from "../../utils/yearHeatmapUtils.js";
import {DAY_NAMES_SHORT, MONTH_NAMES_LONG} from "../../constants/dateConstants.js";
import {formatPassings} from "../../utils/pluralize.js";

const LEVEL_CLASSES = [styles.l0, styles.l1, styles.l2, styles.l3];

const YearHeatmap = ({activity}) => {
    const containerRef = useRef(null);

    const [tooltip, setTooltip] = useState({
        text: "",
        x: 0,
        y: 0,
        visible: false
    });

    const {columns, monthLabels} = useMemo(
        () => generateHeatmapData(activity),
        [activity]
    );

    const handleMouseEnter = useCallback((e, cell) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const cellRect = e.currentTarget.getBoundingClientRect();

        const {date, count} = cell;
        const text = `${DAY_NAMES_SHORT[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES_LONG[date.getMonth()]} - ${formatPassings(count)}`;

        setTooltip({
            text,
            x: (cellRect.left - containerRect.left) + cellRect.width / 2,
            y: (cellRect.top - containerRect.top) - 5,
            visible: true
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip(prev => ({...prev, visible: false}));
    }, []);

    return (
        <div className={styles.wrap} ref={containerRef}>
            <div className={classNames(styles.tooltip, {[styles.visible]: tooltip.visible})}
                 style={{left: `${tooltip.x}px`, top: `${tooltip.y}px`}}
            >
                {tooltip.text}
            </div>

            <div className={styles.scrollArea}>
                <div className={styles.monthRow}>
                    {columns.map((_, w) => (
                        <div key={w} className={styles.monthCell}>
                            {monthLabels[w] ?? ""}
                        </div>
                    ))}
                </div>

                <div className={styles.weeks}>
                    {columns.map((cells, w) => (
                        <div key={w} className={styles.weekCol}>
                            {cells.map((cell, d) =>
                                !cell ? (
                                    <div key={d} className={styles.cellEmpty}/>
                                ) : (
                                    <div
                                        key={cell.key}
                                        className={classNames(
                                            styles.cell,
                                            LEVEL_CLASSES[getActivityLevel(cell.count)]
                                        )}
                                        onMouseEnter={e => handleMouseEnter(e, cell)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.legend}>
                <span className={styles.legendLbl}>Меньше</span>
                {LEVEL_CLASSES.map((cls, i) => (
                    <div key={i} className={classNames(styles.legendCell, cls)}/>
                ))}
                <span className={styles.legendLbl}>Больше</span>
            </div>
        </div>
    );
};

export default YearHeatmap;
