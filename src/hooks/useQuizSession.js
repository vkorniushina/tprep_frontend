import {useState, useEffect} from 'react';
import {getModuleQuestionsLight} from '../api/modules.js';
import {createTestSession, finishTestSession} from '../api/testSessions.js';

const useQuizSession = (id, savedState, passedSession) => {
    const [sessionId, setSessionId] = useState(savedState?.sessionId || null);
    const [testName, setTestName] = useState(savedState?.testName || '');
    const [currentTestId, setCurrentTestId] = useState(savedState?.currentTestId || null);
    const [questionsMeta, setQuestionsMeta] = useState(savedState?.questionsMeta || []);
    const [loading, setLoading] = useState(true);
    const [sessionError, setSessionError] = useState(null);

    useEffect(() => {
        const initTest = async () => {
            try {
                setLoading(true);

                if (passedSession) {
                    setSessionId(passedSession.sessionId);
                    setTestName(passedSession.testName);
                    setCurrentTestId(passedSession.testId);

                    const meta = await getModuleQuestionsLight(passedSession.testId);
                    setQuestionsMeta(meta.questions);

                    setSessionError(null);
                    setLoading(false);
                    return;
                }

                if (savedState) {
                    setLoading(false);
                    return;
                }

                const session = await createTestSession(Number(id));
                setSessionId(session.sessionId);
                setTestName(session.testName);
                setCurrentTestId(Number(id));

                const meta = await getModuleQuestionsLight(Number(id));
                setQuestionsMeta(meta.questions);

                setSessionError(null);
            } catch (err) {
                console.error(err);
                setSessionError('Не удалось загрузить тест');
            } finally {
                setLoading(false);
            }
        };

        if (id) initTest();
    }, [id, passedSession?.sessionId]);

    const exitSession = async () => {
        try {
            await finishTestSession(sessionId);
        } catch (err) {
            console.error('Error finishing session on exit', err);
        }
    };

    const finishSession = async () => {
        return await finishTestSession(sessionId);
    };

    return {
        sessionId,
        testName,
        currentTestId,
        questionsMeta,
        loading,
        sessionError,
        exitSession,
        finishSession,
    };
};

export default useQuizSession;
