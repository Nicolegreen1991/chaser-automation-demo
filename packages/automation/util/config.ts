import fs from "fs";
import * as dotenv from 'dotenv';

export class Config {

    readonly username: string;
    readonly password:string;
    constructor() {
        const envPath = '.env';

        // Check if the .env file exists
        if (fs.existsSync(envPath)) {
            // Load the .env file
            dotenv.config({ path: envPath });
            console.log('Environment variables loaded successfully.');

        } else {
            console.log('.env file does not exist.');
        }

        if (!process.env.AUTH_USERNAME || !process.env.AUTH_PASSWORD) {
            console.log("no credenitals set exiting")
            process.exit(1);
        }

         this.username = process.env.AUTH_USERNAME;
         this.password = process.env.AUTH_PASSWORD;
    }
}