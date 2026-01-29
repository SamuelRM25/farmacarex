/**
 * Google Sheets Service
 * Handles OAuth2 authentication and CRUD operations with Google Sheets API v4.
 */

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

// These should be configured in a .env file for production
const CLIENT_ID = '223058802907-j8gtsdvb0m432a6ffu2e1nfk6m9n453f.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCK_KbQDvcJdfu685g1SIW-fMK8-MUozXM';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const DRIVE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const googleSheetsService = {
    /**
     * Initialize GAPI and GIS
     */
    init: async () => {
        // Wait for global objects to be available
        const waitForGlobals = async () => {
            let attempts = 0;
            while ((!window.gapi || !window.google || !window.google.accounts) && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            if (attempts >= 50) throw new Error('Google API scripts timed out loading');
        };

        await waitForGlobals();

        return new Promise((resolve) => {
            const gapiLoaded = () => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: API_KEY,
                            discoveryDocs: [DISCOVERY_DOC, DRIVE_DISCOVERY_DOC],
                        });
                        gapiInited = true;
                        checkAllInited();
                    } catch (error) {
                        console.error('Error al inicializar GAPI:', error);
                    }
                });
            };

            const gisLoaded = () => {
                try {
                    tokenClient = window.google.accounts.oauth2.initTokenClient({
                        client_id: CLIENT_ID,
                        scope: SCOPES,
                        callback: () => {
                            // Default callback (can be overridden in authenticate)
                        },
                    });
                    gisInited = true;
                    checkAllInited();
                } catch (error) {
                    console.error('Error al inicializar GIS:', error);
                }
            };

            const checkAllInited = () => {
                if (gapiInited && gisInited) resolve(true);
            };

            gapiLoaded();
            gisLoaded();
        });
    },

    /**
     * Request Access Token
     */
    authenticate: async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            tokenClient.callback = async (resp: any) => {
                if (resp.error !== undefined) {
                    reject(resp);
                }
                resolve(resp.access_token);
            };

            if (window.gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    },

    /**
     * Find or Create FarmaCarex Spreadsheet
     */
    getOrCreateSpreadsheet: async () => {
        // 1. Try to find the file
        const response = await window.gapi.client.drive.files.list({
            q: "name = 'FarmaCarex_Data' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false",
            fields: 'files(id, name)',
        });

        const files = response.result.files;
        if (files && files.length > 0) {
            return files[0].id;
        }

        // 2. If not found, create it
        const createResponse = await window.gapi.client.sheets.spreadsheets.create({
            resource: {
                properties: { title: 'FarmaCarex_Data' },
                sheets: [
                    { properties: { title: 'Clientes' } },
                    { properties: { title: 'Medicamentos' } },
                    { properties: { title: 'Planificacion' } },
                    { properties: { title: 'Visitas' } },
                    { properties: { title: 'Ventas_Detalle' } },
                ],
            },
        });

        const spreadsheetId = createResponse.result.spreadsheetId;

        // 3. Setup headers for each sheet
        const setupHeaders = [
            { sheet: 'Clientes', headers: ['ID', 'Colegiado', 'Especialidad', 'Nombre', 'Apellido', 'Dirección', 'Municipio', 'Departamento'] },
            { sheet: 'Medicamentos', headers: ['ID', 'Nombre', 'P. Público', 'P. Farmacia', 'Bonif. 2-9', 'Bonif. 10+', 'P. Médico', 'Ofertas', 'Stock'] },
            { sheet: 'Planificacion', headers: ['ID', 'Gira', 'Dia', 'Mes', 'Anio', 'Horario', 'Dirección', 'Nombre Médico'] },
            { sheet: 'Visitas', headers: ['ID', 'ClientID', 'ClientName', 'Fecha', 'Hora', 'Gira', 'Notas', 'Total Venta'] },
            { sheet: 'Ventas_Detalle', headers: ['ID', 'VisitID', 'MedicineID', 'MedicineName', 'Cantidad', 'Precio', 'Subtotal'] }
        ];

        for (const setup of setupHeaders) {
            await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${setup.sheet}!A1:Z1`,
                valueInputOption: 'RAW',
                resource: { values: [setup.headers] },
            });
        }

        return spreadsheetId;
    },

    /**
     * Get values from a sheet
     */
    getValues: async (spreadsheetId: string, range: string) => {
        const response = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: range,
        });
        return response.result.values || [];
    },

    /**
     * Append values to a sheet
     */
    appendValues: async (spreadsheetId: string, range: string, values: any[][]) => {
        return await window.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: { values },
        });
    }
};
