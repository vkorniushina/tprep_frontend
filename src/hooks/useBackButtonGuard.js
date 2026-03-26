import { useEffect } from 'react';

const useBackButtonGuard = (onBack) => {
    useEffect(() => {
        const blockBack = (e) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.href);
            onBack();
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", blockBack);

        return () => window.removeEventListener("popstate", blockBack);
    }, []);
};

export default useBackButtonGuard;
