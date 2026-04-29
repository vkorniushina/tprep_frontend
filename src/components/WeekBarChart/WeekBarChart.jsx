import React, {useState, useMemo, useCallback, useRef} from "react";
import classNames from "classnames";
import styles from "./WeekBarChart.module.scss";
import {buildWeekData, CHART_CONFIG, computeTicks} from "../../utils/weekChartUtils";
import {DAY_NAMES_SHORT, MONTH_NAMES_LONG} from "../../constants/dateConstants.js";
import {formatPassings} from "../../utils/pluralize.js";

const WeekBarChart = ({activity}) => {
    const containerRef = useRef(null);

    const data = useMemo(() => buildWeekData(activity), [activity]);
    const ticks = useMemo(() => computeTicks(data.map(d => d.count)), [data]);
    const yMax = ticks[0];

    const [tooltip, setTooltip] = useState({x: 0, y: 0, line1: "", line2: "", visible: false});

    const handleMouseEnter = useCallback((e, item) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = e.currentTarget.getBoundingClientRect();

        const x = (rect.left - containerRect.left) + rect.width / 2;
        const y = (rect.top - containerRect.top) - 10;

        setTooltip({
            x,
            y,
            line1: `${DAY_NAMES_SHORT[item.rawDate.getDay()]}, ${item.rawDate.getDate()} ${MONTH_NAMES_LONG[item.rawDate.getMonth()]}`,
            line2: formatPassings(item.count),
            visible: true,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip(prev => ({...prev, visible: false}));
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                className={classNames(styles.tooltip, {[styles.visible]: tooltip.visible})}
                style={{left: `${tooltip.x}px`, top: `${tooltip.y}px`}}
            >
                <div>{tooltip.line1}</div>
                <div>{tooltip.line2}</div>
            </div>

            <div className={styles.wrap}>
                <div className={styles.yAxis} style={{height: CHART_CONFIG.HEIGHT}}>
                    {ticks.map(val => (
                        <div key={val} className={styles.yTick}>{val}</div>
                    ))}
                </div>

                <div className={styles.right}>
                    <div className={styles.plot} style={{height: CHART_CONFIG.HEIGHT}}>
                        <div className={styles.grid}>
                            {ticks.map(val => <div key={val} className={styles.gridLine}/>)}
                        </div>

                        <div className={styles.bars}>
                            {data.map((item, i) => {
                                const isToday = i === data.length - 1;
                                const barH = item.count === 0 ? 8 : (item.count / yMax) * CHART_CONFIG.HEIGHT;

                                return (
                                    <div
                                        key={item.date}
                                        className={styles.barCol}
                                    >
                                        <div
                                            className={classNames(styles.bar, {
                                                [styles.barEmpty]: item.count === 0,
                                                [styles.barToday]: isToday && item.count > 0,
                                                [styles.barFilled]: !isToday && item.count > 0
                                            })}
                                            style={{height: barH}}
                                            onMouseEnter={e => handleMouseEnter(e, item)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.xAxis}>
                        {data.map((item, i) => {
                            const isToday = i === data.length - 1;
                            const label = isToday ? "Сегодня" : `${item.rawDate.getDate()}.${String(item.rawDate.getMonth() + 1).padStart(2, "0")}`;
                            return (
                                <div key={item.date}
                                     className={classNames(styles.xTick, {[styles.xTickToday]: isToday})}>
                                    {label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekBarChart;
