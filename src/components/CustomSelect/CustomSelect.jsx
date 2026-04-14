import React, {useState, useRef, useEffect} from "react";
import styles from "./CustomSelect.module.scss";
import classNames from "classnames";
import Arrow from "../../assets/images/arrow_left.svg?react";

const CustomSelect = ({options = [], value, onChange, placeholder = "Выберите...", hasError = false}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find((o) => String(o.value) === String(value));

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={ref}>
            <button
                className={classNames(styles.trigger, {
                    [styles.triggerOpen]: open,
                    [styles.triggerError]: hasError
                })}
                onClick={() => setOpen((v) => !v)}
            >
                <span className={classNames({
                    [styles.triggerValue]: selected,
                    [styles.triggerPlaceholder]: !selected
                })}>
                    {selected ? selected.label : placeholder}
                </span>
                <Arrow className={classNames(styles.arrow, {[styles.arrowOpen]: open})}/>
            </button>

            {open && (
                <ul className={styles.dropdown}>
                    {options.map((opt) => {
                        const isActive = String(opt.value) === String(value);
                        return (
                            <li
                                key={opt.value}
                                className={classNames(styles.option, {[styles.optionActive]: isActive})}
                                onClick={() => handleSelect(opt.value)}
                            >
                                {opt.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
