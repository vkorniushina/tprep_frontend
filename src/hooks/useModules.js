import {useState, useEffect} from "react";
import {getModulesShort} from "../api/reminders.js";

export const useModules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const data = await getModulesShort();
                setModules(data);
            } catch (err) {
                setError("Ошибка загрузки модулей");
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    const tests = modules.map((m) => ({testId: m.id, testName: m.name}));

    return {tests, loading, error};
};
