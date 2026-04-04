import React, {useState} from "react";
import styles from "./ProfilePage.module.scss";
import {useProfileData} from "../../hooks/useProfileData.js";
import ProfileCard from "../../components/ProfileCard/ProfileCard.jsx";
import HeaderProfile from "../../components/HeaderProfile/HeaderProfile.jsx";
import {removeToken} from "../../utils/tokenStorage.js";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";
import {useToast} from "../../hooks/useToast.js";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal.jsx";
import ToastNotification from "../../components/ToastNotification/ToastNotification.jsx";
import {PROFILE_TABS} from "../../constants/profileConstants.js";

const ProfilePage = () => {
    const navigate = useNavigate();

    const {user, loading, error, updateUser} = useProfileData();
    const [activeTab, setActiveTab] = useState(PROFILE_TABS.STATS);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const {toast, showToast, hideToast} = useToast();

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    const handleSaved = (updatedFields) => {
        updateUser(updatedFields);
        showToast("Профиль успешно обновлён");
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
                                onEditClick={() => setIsEditOpen(true)}
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
                                    Напоминания
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </main>
            {isEditOpen && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditOpen(false)}
                    onSaved={handleSaved}
                />
            )}

            {toast && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default ProfilePage;
