import React from "react";
import styles from "./ProfileCard.module.scss";
import {getInitials} from "../../utils/userUtils.js";

const ProfileCard = ({user, onEditClick, onLogout}) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                {user.photoURL
                    ? <img src={user.photoURL} alt={user.username} className={styles.avatarImg}/>
                    : <span className={styles.initials}>{getInitials(user.username)}</span>
                }
            </div>
            <div className={styles.info}>
                <h2 className={styles.name}>{user.username}</h2>
                <p className={styles.email}>{user.email}</p>
            </div>
            <div className={styles.buttons}>
                <button className={styles.editBtn} onClick={onEditClick}>
                    Редактировать профиль
                </button>
                <button className={styles.logoutBtn} onClick={onLogout}>
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
