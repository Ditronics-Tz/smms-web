const formatDate = (dateInput) => {
    if (dateInput !== null) {
        const date = new Date(dateInput); // Assume the time is midnight (00:00:00)

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const dayOfWeek = daysOfWeek[date.getDay()];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        

        // check if does not contain time
        const isDateOnly = (str) => !/\d{2}:\d{2}:\d{2}/.test(str)

        if (isDateOnly(dateInput)) {
            return `${dayOfWeek} ${month} ${day}, ${year}`;
        } else {
            return `${dayOfWeek} ${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
        }
    } else {
        return null
    }
}

export default formatDate