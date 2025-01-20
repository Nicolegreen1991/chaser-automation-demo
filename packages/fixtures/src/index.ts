import {createCustomer} from "./customer";
import {ensureSixDigits} from "./utils/string-helper";
import {createInvoice} from "./invoice";
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Specify the path to the .env file
const envPath = '.env';

// Check if the .env file exists
if (fs.existsSync(envPath)) {
    // Load the .env file
    dotenv.config({ path: envPath });
    console.log('Environment variables loaded successfully.');

} else {
    console.log('.env file does not exist.');
}




const baseUrl = process.env.BASE_URL ?? 'https://openapi.chaserhq.com';
const companyName = process.env.COMPANY_NAME ?? '111';

const username = process.env.AUTH_USERNAME;
const password = process.env.AUTH_PASSWORD;

const externalIdPrefix = process.env.FIXTURES_EXTAENAL_ID_PREFIX ?? 'lkn'

const fixturesNumber: number =  +(process.env.FIXTURES_NUMBER ?? '100');

const EPOCH_TWO_WEEKS = 1209600;

const BASE_INVOICE = 1000;
const fixedDate = new Date();

async function execute() {

    if (username && password) {
        for (let index = 0; index < fixturesNumber; index++) {
            let customerExternalId = `${externalIdPrefix}${ensureSixDigits(index)}`;
            await createCustomer(baseUrl, username, password, {
                index,
                companyName,
                externalId: customerExternalId
            });

            let currentDate = fixedDate.getTime() + index;
            await createInvoice(baseUrl, username, password, {
                index: index,
                companyName,
                externalCustomerId: customerExternalId,
                invoiceId: customerExternalId,
                createdDate: new Date(currentDate),
                dueDate: new Date(currentDate + EPOCH_TWO_WEEKS),
                dueAmount: BASE_INVOICE + index,
                paid: null,
            });
        }

    } else {
        console.log("must export both AUTH_USERNAME and AUTH_PASSWORD.")
    }
}

// @ts-ignore
await execute();