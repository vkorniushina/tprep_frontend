import React from "react";
import styles from "./ProfileCard.module.scss";
import {getInitials} from "../../utils/userUtils.js";

const ProfileCard = ({user, onLogout}) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                {user.photoURL
                    ? <img src={user.photoURL} alt={user.username} className={styles.avatarImg}/>
                    : <span className={styles.initials}>{getInitials(user.username)}</span>
                }
            </div>
            <h2 className={styles.name}>{user.username}</h2>
            <p className={styles.email}>{user.email}</p>
            <button className={styles.editBtn}>
                Редактировать профиль
            </button>
            <button className={styles.logoutBtn} onClick={onLogout}>
                Выйти из аккаунта
            </button>
        </div>
    );
};

export default ProfileCard;
