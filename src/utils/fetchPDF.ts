import axios from "axios";
import { API_BASE } from "../constant";

const fetchPDF = async (token, url) => {
    try {
        const response = await axios.get(API_BASE + url, {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            responseType: "blob", // Important for binary files like PDFs
        });

        // Create a URL for the PDF blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));

        // Open in new tab for review
        // window.open(fileURL);

        // Optionally create a download link
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "End_of_day_report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error fetching the PDF:", error);
    }
};

export default fetchPDF