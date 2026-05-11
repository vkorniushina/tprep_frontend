import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import HeaderMain from "../../components/HeaderMain/HeaderMain.jsx";
import plusIcon from "../../assets/images/plus.svg";
import styles from "../MainPage/MainPage.module.scss";
import Card from "../../components/Card/Card.jsx";
import {
    createModuleByFile,
    createModuleManual,
    deleteModule,
    getAllModules,
    getPublicModules,
    searchModules
} from "../../api/modules.js";
import CreateTestModal from "../../components/CreateTestModal/CreateTestModal.jsx";
import ToastNotification from "../../components/ToastNotification/ToastNotification.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import classNames from "classnames";
import {TABS} from "../../constants/testConstants.js";

const MainPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(TABS.MY);

    const [tests, setTests] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const size = 6;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [toast, setToast] = useState({
        visible: false,
        type: "success",
        message: ""
    });

    const fetchTests = useCallback(async () => {
        try {
            setLoading(true);

            let data;
            if (activeTab === TABS.MY) {
                data = searchQuery.trim()
                    ? await searchModules({keyword: searchQuery, page, size})
                    : await getAllModules({page, size});
            } else {
                data = await getPublicModules({
                    page,
                    size,
                    keyword: searchQuery.trim() || undefined,
                });
            }

            setTests(data.items);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить тесты');
            console.error('Error fetching tests:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, searchQuery]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    useEffect(() => {
        setPage(0);
    }, [activeTab, searchQuery]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const showToast = (type, message) => {
        setToast({visible: true, type, message});
    };

    const hideToast = () => {
        setToast(prev => ({...prev, visible: false}));
    };

    const handleDelete = async (id) => {
        try {
            await deleteModule(id);

            const isLastItemOnPage = tests.length === 1;
            const isNotFirstPage = page > 0;

            if (isLastItemOnPage && isNotFirstPage) {
                setPage(prev => prev - 1);
            } else {
                await fetchTests();
            }

            showToast("success", "Тест удалён!");
            setActiveMenuId(null);
        } catch (err) {
            console.error(err);
            showToast("error", "Не удалось удалить тест");
        }
    };

    const handleCreateManual = async ({name, description}) => {
        try {
            const createdModule = await createModuleManual({name, description});
            navigate(`/test/${createdModule.id}/edit`);
            return {success: true};
        } catch (err) {
            console.error(err);
            return {success: false, message: "Не удалось создать тест вручную"};
        }
    };

    const handleCreateFromFile = async ({name, description, file}) => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("file", file);

            await createModuleByFile(formData);
            await fetchTests();
            showToast("success", "Тест успешно создан!");
            return {success: true};
        } catch (err) {
            console.error(err);
            return {success: false, message: "Не удалось создать тест из файла"};
        }
    };

    const isMyTab = activeTab === TABS.MY;

    const emptyMessage = searchQuery.trim()
        ? "По вашему запросу ничего не найдено"
        : isMyTab ? "У вас пока нет тестов" : "Публичных тестов пока нет";

    const emptySubMessage = searchQuery.trim()
        ? "Попробуйте изменить поисковый запрос"
        : isMyTab ? "Создайте первый тест, чтобы начать обучение" : "Следите за обновлениями";

    return (
        <>
            <HeaderMain searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <main className={`container ${styles.main}`}>
                <div className={styles.headerRow}>
                    <div className={styles.tabs}>
                        <button
                            className={classNames(styles.tab, {[styles.activeTab]: activeTab === TABS.MY})}
                            onClick={() => setActiveTab(TABS.MY)}
                        >
                            Мои тесты
                        </button>
                        <button
                            className={classNames(styles.tab, {[styles.activeTab]: activeTab === TABS.PUBLIC})}
                            onClick={() => setActiveTab(TABS.PUBLIC)}
                        >
                            Все тесты
                        </button>
                    </div>

                    {activeTab === TABS.MY && (
                        <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                            <img src={plusIcon} alt="Plus"/>
                            Создать тест
                        </button>
                    )}
                </div>

                {loading && <div className={styles.loadingEmptyState}>Загрузка тестов...</div>}
                {error && <div className={styles.loadingEmptyState}>{error}</div>}

                {!loading && !error && (
                    tests.length > 0 ? (
                        <div className={styles.cards}>
                            {tests.map((test) => (
                                <Card
                                    key={test.id}
                                    id={test.id}
                                    name={test.name}
                                    description={test.description}
                                    questionsCount={test.questionsCount}
                                    progress={test.progress}
                                    isOwner={isMyTab}
                                    isMenuOpen={test.id === activeMenuId}
                                    onMenuToggle={setActiveMenuId}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyMessage}>{emptyMessage}</p>
                            <p className={styles.emptySubMessage}>{emptySubMessage}</p>
                        </div>
                    )
                )}

                {!loading && !error && totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}

            </main>

            {isModalOpen && (
                <CreateTestModal
                    onClose={() => setIsModalOpen(false)}
                    onCreateManual={handleCreateManual}
                    onCreateFromFile={handleCreateFromFile}
                    showToast={showToast}
                />
            )}

            {toast.visible && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}
        </>
    )
}

export default MainPage;
