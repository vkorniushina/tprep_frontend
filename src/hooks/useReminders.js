import {useState, useEffect, useCallback} from "react";
import {
    getReminders,
    createReminders,
    updateReminders,
    deleteReminders
} from "../api/reminders.js";

export const useReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReminders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getReminders();

            const sortedData = [...data].sort((a, b) => {
                const now = Date.now();
                const timeA = Math.min(
                    ...a.reminders
                        .map(r => new Date(r.datetime).getTime())
                        .filter(t => t >= now)
                );
                const timeB = Math.min(
                    ...b.reminders
                        .map(r => new Date(r.datetime).getTime())
                        .filter(t => t >= now)
                );
                return timeA - timeB;
            });

            setReminders(sortedData);
        } catch {
            setError("Не удалось загрузить напоминания");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const remove = async (testId) => {
        let backup;

        setReminders(prev => {
            backup = prev;
            return prev.filter(r => r.testId !== testId);
        });

        try {
            await deleteReminders(testId);
        } catch (err) {
            setReminders(backup);
            throw err;
        }
    };

    const create = async (payload) => {
        const created = await createReminders(payload);
        setReminders(prev => [created, ...prev]);
        return created;
    };

    const update = async (testId, payload) => {
        const updated = await updateReminders(testId, payload);
        setReminders(prev =>
            prev.map(r => r.testId === testId ? updated : r)
        );
        return updated;
    };

    return {
        reminders,
        loading,
        error,
        create,
        update,
        remove,
    };
};
