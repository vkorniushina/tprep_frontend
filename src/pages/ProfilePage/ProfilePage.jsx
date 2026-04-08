import React, {useState} from "react";
import styles from "./ProfilePage.module.scss";
import {useProfileData} from "../../hooks/useProfileData.js";
import ProfileCard from "../../components/ProfileCard/ProfileCard.jsx";
import HeaderProfile from "../../components/HeaderProfile/HeaderProfile.jsx";
import {removeToken} from "../../utils/tokenStorage.js";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";

const ProfilePage = () => {
    const navigate = useNavigate();

    const {user, loading, error} = useProfileData();
    const [activeTab, setActiveTab] = useState("stats");

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    return (
        <div className={styles.page}>
            <HeaderProfile/>

            <main className={`container ${styles.content}`}>

                {(loading || error) && (
                    <div className={styles.statusWrapper}>
                        {loading && <div className={styles.loading}>Загрузка...</div>}
                        {error && <div className={styles.error}>{error}</div>}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <section className={styles.sidebar}>
                            <ProfileCard
                                user={user}
                                onLogout={handleLogout}
                            />
                        </section>

                        <section className={styles.main}>
                            <div className={styles.tabs}>
                                <button
                                    className={classNames(styles.tab, {
                                        [styles.tabInactive]: activeTab !== "stats",
                                    })}
                                    onClick={() => setActiveTab("stats")}
                                >
                                    Статистика
                                </button>
                                <button
                                    className={classNames(styles.tab, {
                                        [styles.tabInactive]: activeTab !== "reminders",
                                    })}
                                    onClick={() => setActiveTab("reminders")}
                                >
                                    Напоминания
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
