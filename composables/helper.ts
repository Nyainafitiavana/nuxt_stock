export const formatDateString = (dateString: String): promise<String> => {
    const date = new Date(dateString);

// Custom format: "August 13, 2024"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Output: "August 13, 2024"
    return date.toLocaleDateString(undefined, options);
}