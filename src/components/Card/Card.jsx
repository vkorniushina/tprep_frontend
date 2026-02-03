import styles from './Card.module.scss'
import fileIcon from "../../assets/images/file.svg";
import React, {useEffect, useRef} from "react";
import {useNavigate} from 'react-router-dom';
import menuIcon from "../../assets/images/menu.svg";
import {getPluralForm} from "../../utils/pluralize.js";

const Card = ({id, name, description, questionsCount, progress, onDelete, isMenuOpen, onMenuToggle}) => {
    const navigate = useNavigate();
    const menuRef = useRef();

    const handleOpenTest = () => {
        navigate(`/test/${id}`);
    };

    const handleOpenEdit = (e) => {
        e.stopPropagation();
        onMenuToggle(null);
        navigate(`/test/${id}/edit`);
    };

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        onMenuToggle(isMenuOpen ? null : id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(id);
        onMenuToggle(null);
    };

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onMenuToggle(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen, onMenuToggle]);

    const questionWord = getPluralForm(questionsCount, 'вопрос', 'вопроса', 'вопросов');
    const displayPercent = questionsCount === 0 ? 0 : Math.round((progress / questionsCount) * 100);

    return (
        <div className={styles.card}>
            <div className={styles.menuWrapper} ref={menuRef}>
                <button
                    className={styles.menuBtn}
                    onClick={handleMenuToggle}
                >
                    <img src={menuIcon} alt="Menu"/>
                </button>

                {isMenuOpen && (
                    <div className={styles.menu}>
                        <button className={styles.menuItem}
                                onClick={handleDelete}
                        >
                            <span>Удалить</span>
                        </button>
                        <button className={styles.menuItem} onClick={handleOpenEdit}>
                            Редактировать
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.topContent}>
                <h3 className={styles.name}>{name}</h3>
                {description ? <p className={styles.description}>{description}</p> :
                    <p className={`${styles.description} ${styles.descriptionEmpty}`}>Здесь могло быть описание...</p>
                }
            </div>
            <div className={styles.bottomContent}>
                <div className={styles.amount}>
                    <img src={fileIcon} alt="Doc"/>
                    <span>{questionsCount} {questionWord}</span>
                </div>
                <div className={styles.row}>
                    <div className={styles.progress}>
                        <span className={styles.bar} style={{width: `${displayPercent}%`}}/>
                    </div>
                    <span>{displayPercent}%</span>
                </div>
                <button className={styles.openBtn} onClick={handleOpenTest}>Открыть тест</button>
            </div>
        </div>
    )
}

export default Card;
