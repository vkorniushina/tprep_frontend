import React, {useState, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    useDismiss,
    useInteractions,
    useClick,
} from "@floating-ui/react";
import styles from "./TimePickerInput.module.scss";
import ClockIcon from "../../assets/images/clock.svg?react";
import classNames from "classnames";
import {applyTimeMask, HOURS, isValidTime, MINUTES} from "../../utils/dateTimeInputUtils.js";

const TimePickerInput = ({value, onChange, hasError = false}) => {
    const [open, setOpen] = useState(false);
    const [inputStr, setInputStr] = useState(value || "");
    const hourRef = useRef(null);
    const minRef = useRef(null);

    const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""];

    useEffect(() => {
        setInputStr(value || "");
    }, [value]);

    useEffect(() => {
        if (!open) return;
        const scrollTo = (ref, items, selected) => {
            if (!ref.current || !selected) return;
            const idx = items.indexOf(selected);
            if (idx !== -1) ref.current.children[idx]?.scrollIntoView({block: "center"});
        };
        setTimeout(() => {
            scrollTo(hourRef, HOURS, selectedHour);
            scrollTo(minRef, MINUTES, selectedMinute);
        }, 0);
    }, [open]);

    const {refs, floatingStyles, context} = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "bottom-start",
        middleware: [offset(4), flip(), shift({padding: 8})],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss]);

    const handleInputChange = (e) => {
        const masked = applyTimeMask(e.target.value);
        setInputStr(masked);
        if (isValidTime(masked)) onChange(masked);
        else if (masked === "") onChange("");
    };

    const selectHour = (hour) => {
        const time = `${hour}:${selectedMinute || "00"}`;
        onChange(time);
        setInputStr(time);
    };

    const selectMin = (min) => {
        const time = `${selectedHour || "00"}:${min}`;
        onChange(time);
        setInputStr(time);
    };

    return (
        <div className={styles.inputWrapper}>
            <div
                className={classNames(styles.inputInner, {[styles.inputError]: hasError})}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <input
                    type="text"
                    className={styles.inputTime}
                    value={inputStr}
                    onChange={handleInputChange}
                    placeholder="--:--"
                    maxLength={5}
                />
                <ClockIcon className={styles.inputIcon}/>
            </div>

            {open && createPortal(
                <div
                    ref={refs.setFloating}
                    style={{...floatingStyles}}
                    className={styles.dropdown}
                    {...getFloatingProps()}
                >
                    <ul className={styles.col} ref={hourRef}>
                        {HOURS.map((hour) => (
                            <li
                                key={hour}
                                className={`${styles.item} ${hour === selectedHour ? styles.itemActive : ""}`}
                                onClick={() => selectHour(hour)}
                            >
                                {hour}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.divider}>:</div>
                    <ul className={styles.col} ref={minRef}>
                        {MINUTES.map((min) => (
                            <li
                                key={min}
                                className={`${styles.item} ${min === selectedMinute ? styles.itemActive : ""}`}
                                onClick={() => selectMin(min)}
                            >
                                {min}
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TimePickerInput;
