import {useState, useEffect} from 'react';
import {getModuleByToken, getModuleQuestionsLight, getModuleQuestionsLightByToken} from '../api/modules.js';
import {
    createSharedTestSession,
    createTestSession,
    finishSharedTestSession,
    finishTestSession
} from '../api/testSessions.js';

const useQuizSession = (id, shareToken, savedState, passedSession) => {
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

                    const meta = shareToken
                        ? await getModuleQuestionsLightByToken(shareToken)
                        : await getModuleQuestionsLight(passedSession.testId);

                    setQuestionsMeta(meta.questions);
                    setSessionError(null);
                    setLoading(false);
                    return;
                }

                if (savedState) {
                    setLoading(false);
                    return;
                }

                let targetId = id;
                let session;
                let meta;

                if (shareToken) {
                    const moduleInfo = await getModuleByToken(shareToken);
                    targetId = moduleInfo.id;

                    session = await createSharedTestSession(shareToken, Number(targetId));
                    meta = await getModuleQuestionsLightByToken(shareToken);
                } else {
                    session = await createTestSession(Number(id));
                    meta = await getModuleQuestionsLight(Number(id));
                }

                setSessionId(session.sessionId);
                setTestName(session.testName);
                setCurrentTestId(Number(targetId));
                setQuestionsMeta(meta.questions);
                setSessionError(null);
            } catch (err) {
                console.error(err);
                setSessionError('Не удалось загрузить тест');
            } finally {
                setLoading(false);
            }
        };

        if (id || shareToken) {
            initTest();
        }
    }, [id, shareToken, passedSession?.sessionId]);

    const exitSession = async () => {
        try {
            if (shareToken) {
                await finishSharedTestSession(shareToken, sessionId);
            } else {
                await finishTestSession(sessionId);
            }
        } catch (err) {
            console.error('Error finishing session on exit', err);
        }
    };

    const finishSession = async () => {
        if (shareToken) {
            return await finishSharedTestSession(shareToken, sessionId);
        } else {
            return await finishTestSession(sessionId);
        }
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
