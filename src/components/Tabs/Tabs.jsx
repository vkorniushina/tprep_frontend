import React from "react";
import classNames from "classnames";
import styles from "./Tabs.module.scss";

const Tabs = ({tabs, activeTab, onChange}) => {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={classNames(styles.tab, {
                        [styles.tabActive]: activeTab === tab.id,
                    })}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
