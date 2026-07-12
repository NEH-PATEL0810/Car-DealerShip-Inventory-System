/**
 * Helper to parse backend error responses and retrieve specific field validation errors.
 */
export const getErrorMessage = (err, fallback = "An error occurred.") => {
    const data = err.response?.data;
    if (!data) return fallback;

    if (data.errors) {
        const messages = [];
        Object.entries(data.errors).forEach(([field, errors]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            if (Array.isArray(errors)) {
                messages.push(`${fieldName}: ${errors.join(" ")}`);
            } else {
                messages.push(`${fieldName}: ${errors}`);
            }
        });
        return messages.join(" | ");
    }

    return data.message || fallback;
};
