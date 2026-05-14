import React from "react";
import classNames from "classnames";
import styles from "./InfoHint.module.scss";

const InfoHint = ({Icon, title, description, iconClassName}) => {
    return (
        <div className={styles.hint}>
            <div className={styles.hintHeader}>
                <Icon className={classNames(styles.hintIcon, iconClassName)}/>
                <p className={styles.hintTitle}>{title}</p>
            </div>
            <p className={styles.hintDescription}>{description}</p>
        </div>
    );
};

export default InfoHint;
