import React from "react";
import styles from "./Header.module.scss";
import searchIcon from "../../assets/images/search.svg";

const Header = ({ searchQuery, setSearchQuery }) => {

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
                <button className={styles.profileBtn}>Личный кабинет</button>
            </div>
        </header>
    )
}

export default Header;