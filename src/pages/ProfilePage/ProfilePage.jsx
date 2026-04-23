import React, {useState} from "react";
import styles from "./ProfilePage.module.scss";
import {useProfileData} from "../../hooks/useProfileData.js";
import ProfileCard from "../../components/ProfileCard/ProfileCard.jsx";
import HeaderProfile from "../../components/HeaderProfile/HeaderProfile.jsx";
import {removeToken} from "../../utils/tokenStorage.js";
import {useLocation, useNavigate} from "react-router-dom";
import classNames from "classnames";
import StatsCards from "../../components/StatsCards/StatsCards.jsx";
import RecentAttemptsSection from "../../components/RecentAttemptsSection/RecentAttemptsSection.jsx";
import ActivitySection from "../../components/ActivitySection/ActivitySection.jsx";
import {PROFILE_TABS} from "../../constants/profileConstants.js";
import RemindersSection from "../../components/RemindersSection/RemindersSection.jsx";

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        stats,
        activity,
        recentAttempts,
        loading,
        error
    } = useProfileData();

    const [activeTab, setActiveTab] = useState(location.state?.tab ?? PROFILE_TABS.STATS);

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
                        <aside className={styles.sidebar}>
                            <ProfileCard
                                user={user}
                                onLogout={handleLogout}
                            />
                        </aside>

                        <section className={styles.main}>
                            <div className={styles.tabs}>
                                <button
                                    className={classNames(styles.tab, {
                                        [styles.tabInactive]: activeTab !== PROFILE_TABS.STATS,
                                    })}
                                    onClick={() => setActiveTab(PROFILE_TABS.STATS)}
                                >
                                    Статистика
                                </button>
                                <button
                                    className={classNames(styles.tab, {
                                        [styles.tabInactive]: activeTab !== PROFILE_TABS.REMINDERS,
                                    })}
                                    onClick={() => setActiveTab(PROFILE_TABS.REMINDERS)}
                                >
                                    Уведомления
                                </button>
                            </div>

                            {activeTab === PROFILE_TABS.STATS && (
                                <div className={styles.block}>
                                    <StatsCards stats={stats}/>
                                    <ActivitySection activity={activity}/>
                                    <RecentAttemptsSection attempts={recentAttempts}/>
                                </div>
                            )}

                            {activeTab === PROFILE_TABS.REMINDERS && (
                                <div className={styles.block}>
                                    <RemindersSection />
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
