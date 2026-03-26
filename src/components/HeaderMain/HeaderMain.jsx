import React from "react";
import styles from "./HeaderMain.module.scss";
import searchIcon from "../../assets/images/search.svg";
import {useNavigate} from "react-router-dom";

const HeaderMain = ({ searchQuery, setSearchQuery }) => {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleProfileClick = () => {
        navigate("/register");
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <h1 className={styles.logo}>T-Prep</h1>

                <div className={styles.search}>
                    <img src={searchIcon} alt="Search" className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск тестов..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <button className={styles.profileBtn}
                        onClick={handleProfileClick}
                >
                    Личный кабинет
                </button>
            </div>
        </header>
    )
}

export default HeaderMain;
