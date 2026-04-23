import React from 'react';
import classNames from 'classnames';
import styles from './ModeSelector.module.scss';
import {MODE_BUTTONS} from '../../constants/reminderConstants.js';

const ModeSelector = ({activeMode, onModeChange}) => {
    return (
        <div className={styles.field}>
            <label className={styles.label}>Режим напоминаний</label>
            <div className={styles.modeToggle}>
                {MODE_BUTTONS.map((btn) => (
                    <button
                        key={btn.id}
                        className={classNames(styles.modeBtn, {
                            [styles.modeBtnActive]: activeMode === btn.id,
                        })}
                        onClick={() => onModeChange(btn.id)}
                    >
                        <div className={styles.modeBtnTitle}>{btn.title}</div>
                        <p className={styles.modeBtnSub}>{btn.sub}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModeSelector;
