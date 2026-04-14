export const HOURS = Array.from({length: 24}, (_, i) => String(i).padStart(2, "0"));
export const MINUTES = Array.from({length: 60}, (_, i) => String(i).padStart(2, "0"));

export const formatDateToDots = (date) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
};

export const parseDotsToDate = (str) => {
    const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) return null;
    const d = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
    return isNaN(d.getTime()) ? null : d;
};

export const applyDateMask = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 8);
    if (d.length <= 2) return d.length === 2 ? `${d}.` : d;
    if (d.length <= 4) return `${d.slice(0, 2)}.${d.slice(2)}${d.length === 4 ? "." : ""}`;
    return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`;
};

export const applyTimeMask = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + ":" + digits.slice(2);
};

export const isValidTime = (str) => {
    const match = str.match(/^(\d{2}):(\d{2})$/);
    if (!match) return false;
    return Number(match[1]) < 24 && Number(match[2]) < 60;
};
