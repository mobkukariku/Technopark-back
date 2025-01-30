import { google } from "googleapis";

const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    null!,
    process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);


export const sheets = google.sheets({ version: "v4", auth });
export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;