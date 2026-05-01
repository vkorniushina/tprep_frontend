export const buildShareLink = (token) => {
    return token ? `${window.location.origin}/share/${token}` : "";
};
