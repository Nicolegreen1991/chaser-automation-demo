import {binding, given, then, when, after} from 'cucumber-tsflow';
import {Builder, Capabilities, By, until, WebDriver} from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import {assert} from 'chai';
import * as path from 'path';
import {Options} from "selenium-webdriver/chrome";
import {Config} from "../util/config";

@binding()
export class BaseSteps {
    private body: any = {};
    private bearer: any = {};

    private username: string;
    private password: string
    private driver: WebDriver;

    constructor() {
        const config = new Config();
        this.username = config.username;
        this.password = config.password;


        const chromeDriverPath = path.resolve(__dirname, '../node_modules/.bin/chromedriver');
        console.log(`ChromeDriver Path: ${chromeDriverPath}`);
        const service = new chrome.ServiceBuilder(chromeDriverPath);

        const options = new Options();
        // options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--headless'); // Run in headless mode
        options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
        console.log('Initializing ChromeDriver...');
        this.driver = new Builder()
            .forBrowser('chrome')
            // .setChromeService(service)
            // .setChromeOptions(options)
            .build();
        console.log('ChromeDriver initialized');
    }

    @after()
    public async teardown() {
        await this.driver.quit();
    }

    @given(/I am logged into Chaser/)
    public async logIntoChaser() {
        await this.driver.get('https://my.chaserhq.com/login');
        // await this.driver.get('https://help.chaserhq.com/chaserapi'); // Replace with the actual login URL
        await this.driver.findElement(By.css("[data-testid='email-input']")).sendKeys(this.username); // Replace with the actual username field ID
        await this.driver.findElement(By.css("[data-testid='password-input']")).sendKeys(this.password); // Replace with the actual password field ID
        await this.driver.findElement(By.css("[data-testid='submit-button']")).click(); // Replace with the actual login button ID
        // await this.driver.wait(until.titleIs('Dashboard'), 10000); // Wait until the dashboard page is loaded
    }

    @when(/I click on Receivables/)
    public async clickReceivable() {
        let recivablesButton =await this.driver.wait( until.elementLocated((By.css("[data-testid='navigation-receivables']"))));
        await this.driver.wait(until.elementIsVisible(recivablesButton), 5000);
        await recivablesButton.click(); // Replace with the actual Receivables button ID
    }

    @given(/I click to skip MFA enrollment/)
    public async skipMFAEnrollment() {
        const buttonElement = await this.driver.wait(
            until.elementLocated(By.xpath("//button[.//div[.//span[text()='Skip for now']]]")),
            15000 // Timeout in milliseconds
        );

        await this.driver.wait(until.elementIsEnabled(buttonElement), 5000);
        await buttonElement.click();
    }

    @when(/I navigate to invoices/)
    public async navigateToInvoices() {
        await this.driver.findElement(By.css("[data-testid='tab-invoices']")).click();
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @then(/The first row has an invoice id of ([^"]*) and should have ([^"]*) outstanding/)
    public async outstandingShouldBeConfirmed(expectedInvoiceId: string, expectedOutstandingAmount: string) {

        /**this is less than ideal but the dynamically loaded data takes a few hundred millies If there's a spinner, wait for it to disappear (Option 3).
         * to appear and since the table is there before the data is loaded we cant wait for that element to appear
         * if there was/is a spinner we could latch on to that and wait until it disappears
         *
        **/
        await this.sleep(500);

        const table = await this.driver.findElement(By.css('[data-testid="invoices-table"] table'));
        await this.driver.wait(until.elementIsEnabled(table), 5000);
        // Locate the first row of the table (excluding the header)
        const firstRow = await table.findElement(By.css('tbody tr:first-child'));

        // Locate specific columns in the first row
        const invoiceNo = (await firstRow.findElement(By.xpath('./td[2]')).getText()).replace('\n', ''); // Adjust index for "Invoice No"
        const outstanding = await firstRow.findElement(By.xpath('./td[4]')).getText(); // Adjust index for "Outstanding"

        console.log(`res are : inno: ${invoiceNo}, and outstanding: ${outstanding}`)
        assert.equal(invoiceNo, expectedInvoiceId);
        assert.equal(outstanding, expectedOutstandingAmount);
    }

}
