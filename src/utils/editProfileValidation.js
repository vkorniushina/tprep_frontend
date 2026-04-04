import {VALIDATION_MESSAGES} from "../constants/validationMessages.js";

export const validateCurrentPassword = (current, newPass, repeat) => {
    if ((newPass || repeat) && !current) {
        return VALIDATION_MESSAGES.REQUIRED;
    }
    return "";
};
