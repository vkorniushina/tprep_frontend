import {useState, useRef} from "react";
import {sendVerificationCode, verifyEmail} from "../api/auth.js";

const RESEND_SECONDS = 60;
const MAX_ATTEMPTS = 3;

export const useEmailVerification = (email) => {
    const [code, setCode] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [needsNewCode, setNeedsNewCode] = useState(false);

    const timerRef = useRef(null);

    const startTimer = () => {
        setSecondsLeft(RESEND_SECONDS);
        setCanResend(false);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleCodeChange = (e) => {
        setCode(e.target.value.replace(/\D/g, ""));
        if (error) setError("");
    };

    const handleResend = async () => {
        setError("");
        try {
            await sendVerificationCode(email);
            startTimer();
            setCode("");
            setAttempts(0);
            setNeedsNewCode(false);
        } catch {
            setError("Не удалось отправить код повторно. Попробуйте позже.");
        }
    };

    const handleVerify = async () => {
        if (code.length !== 6 || needsNewCode) return false;

        setIsLoading(true);
        setError("");

        try {
            await verifyEmail(email, code);
            stopTimer();
            return true;
        } catch (err) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (err.response?.status === 410) {
                setNeedsNewCode(true);
                setError("Срок действия кода истёк. Запросите новый.");
            } else if (newAttempts >= MAX_ATTEMPTS) {
                setNeedsNewCode(true);
                setError("Код введён неверно. Запросите новый код.");
            } else {
                setError("Неверный код. Попробуйте ещё раз.");
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        code,
        secondsLeft,
        canResend,
        isLoading,
        error,
        needsNewCode,
        startTimer,
        stopTimer,
        handleCodeChange,
        handleResend,
        handleVerify,
    };
};
