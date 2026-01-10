import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import HeaderMain from "../../components/HeaderMain/HeaderMain.jsx";
import plusIcon from "../../assets/images/plus.svg";
import styles from "../MainPage/MainPage.module.scss";
import Card from "../../components/Card/Card.jsx";
import {createModuleByFile, createModuleManual, deleteModule, getAllModules} from "../../api/modules.js";
import CreateTestModal from "../../components/CreateTestModal/CreateTestModal.jsx";
import ToastNotification from "../../components/ToastNotification/ToastNotification.jsx";

const MainPage = () => {
    const navigate = useNavigate();

    const [tests, setTests] = useState([]);
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

    const fetchTests = async () => {
        try {
            setLoading(true);
            const data = await getAllModules();
            setTests(data);
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить тесты');
            console.error('Error fetching tests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
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
            setTests(prev => prev.filter(t => t.id !== id));
            showToast("success", "Тест удалён!");
            setActiveMenuId(null);
        } catch (err) {
            console.error(err);
            showToast("error", "Не удалось удалить тест.");
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

    const filteredTests = searchQuery.trim()
        ? tests.filter(test => test.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : tests;

    return (
        <>
            <HeaderMain searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <main className={`container ${styles.main}`}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Мои тесты</h1>
                    <button className={styles.createBtn}
                            onClick={() => setIsModalOpen(true)}
                    >
                        <img src={plusIcon} alt="Plus"/>
                        Создать тест
                    </button>
                </div>

                {loading && <div className={styles.loadingEmptyState}>Загрузка тестов...</div>}
                {error && <div className={styles.loadingEmptyState}>{error}</div>}

                {!loading && !error && (
                    filteredTests.length > 0 ? (
                        <div className={styles.cards}>
                            {filteredTests.map((test) => (
                                <Card
                                    key={test.id}
                                    id={test.id}
                                    name={test.name}
                                    description={test.description}
                                    questionsCount={test.questionsCount}
                                    progress={test.progress}
                                    isMenuOpen={test.id === activeMenuId}
                                    onMenuToggle={setActiveMenuId}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyMessage}>
                                {searchQuery.trim()
                                    ? "По вашему запросу ничего не найдено"
                                    : "У вас пока нет тестов"}
                            </p>
                            <p className={styles.emptySubMessage}>
                                {searchQuery.trim()
                                    ? "Попробуйте изменить поисковый запрос"
                                    : "Создайте первый тест, чтобы начать обучение"}
                            </p>
                        </div>
                    )
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
