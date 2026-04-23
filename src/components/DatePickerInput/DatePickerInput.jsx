import React, {useState, useEffect} from "react";
import {createPortal} from "react-dom";
import {DayPicker} from "react-day-picker";
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
import "react-day-picker/style.css";
import {ru} from "date-fns/locale";
import styles from "./DatePickerInput.module.scss";
import CalendarIcon from "../../assets/images/calendar.svg?react";
import classNames from "classnames";
import {applyDateMask, formatDateToDots, parseDotsToDate} from "../../utils/dateTimeInputUtils.js";

const DatePickerInput = ({value, onChange, placeholder = "__.__.____", hasError = false}) => {
    const [open, setOpen] = useState(false);
    const [inputStr, setInputStr] = useState(formatDateToDots(value));

    useEffect(() => {
        setInputStr(formatDateToDots(value));
    }, [value]);

    const {refs, floatingStyles, context} = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({padding: 8})],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss]);

    const handleInputChange = (e) => {
        const raw = e.target.value;
        if (raw.length < inputStr.length && inputStr.endsWith(".")) {
            setInputStr(raw);
            return;
        }
        const masked = applyDateMask(raw);
        setInputStr(masked);
        const parsed = parseDotsToDate(masked);
        if (parsed) onChange(parsed);
        else if (masked === "") onChange(null);
    };

    const handleSelect = (date) => {
        onChange(date ?? null);
        if (date) {
            setInputStr(formatDateToDots(date));
            setOpen(false);
        }
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
                    className={styles.inputDate}
                    value={inputStr}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    maxLength={10}
                />
                <CalendarIcon className={styles.inputIcon}/>
            </div>

            {open && createPortal(
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={styles.popover}
                    {...getFloatingProps()}
                >
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={handleSelect}
                        locale={ru}
                        weekStartsOn={1}
                        classNames={{
                            root: styles.root,
                            months: styles.months,
                            month: styles.month,
                            month_caption: styles.monthCaption,
                            caption_label: styles.captionLabel,
                            nav: styles.nav,
                            button_previous: styles.navBtnPrev,
                            button_next: styles.navBtnNext,
                            month_grid: styles.grid,
                            weekday: styles.weekday,
                            day: styles.day,
                            day_button: styles.dayBtn,
                            selected: styles.daySelected,
                            today: styles.dayToday,
                        }}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default DatePickerInput;
