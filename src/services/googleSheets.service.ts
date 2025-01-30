import { sheets, SPREADSHEET_ID } from "../lib/googleSheets";

export const saveToGoogleSheets = async (name: string, surname:string, email: string, message: string, direction: string): Promise<void> => {
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Лист1!A:E",
            valueInputOption: "RAW",
            requestBody: {
                values: [[name, surname, email, direction, message,]],
            },
        });
        console.log("✅ Data added to Google Sheets");
    } catch (error) {
        console.error("❌ Google Sheets Error:", error);
        throw new Error("Failed to save data to Google Sheets");
    }
};
