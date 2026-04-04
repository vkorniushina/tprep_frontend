import {useState, useEffect} from "react";
import {getProfile} from "../api/profile.js";

export const useProfileData = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setUser(data.user);
            } catch (err) {
                setError("Не удалось загрузить данные профиля");
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const updateUser = (fields) => {
        setUser(prev => ({...prev, ...fields}));
    };

    return {user, loading, error, updateUser};
}
