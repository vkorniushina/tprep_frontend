import React, {useState, useRef, useEffect} from "react";
import styles from "./KebabMenu.module.scss";
import menuIcon from "../../assets/images/menu.svg";

const KebabMenu = ({items = []}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className={styles.wrapper} ref={ref}>
            <button
                className={styles.trigger}
                onClick={() => setOpen((v) => !v)}
                aria-label="Меню"
                aria-expanded={open}
            >
                <img src={menuIcon} alt="Menu"/>
            </button>

            {open && (
                <ul className={styles.dropdown}>
                    {items.map(({id, label, icon: Icon, onClick}) => (
                        <li key={id}>
                            <button
                                className={styles.item}
                                onClick={() => {
                                    setOpen(false);
                                    onClick?.();
                                }}
                            >
                                {Icon && <Icon className={styles.itemIcon}/>}
                                <span>{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default KebabMenu;
