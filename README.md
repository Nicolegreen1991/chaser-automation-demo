# Chaser test
## Setup 
This project uses nvm to configure node version so before starting please 
ensure you have [nvm](https://github.com/nvm-sh/nvm) installed then run.
```shell
  nvm use
```

This should configure your terminal to the correct nod version then you will be free to install dependencies with 
```shell
  npm i 
```

## Running 
once set up has been complete running is simple from the root project please invoke the follwoing:
- ### fixtures generation
    ensure that the correct environment is configured in `packages/fixtures/.env` like:
    ```dotenv
    AUTH_USERNAME=${yourUsername}
    AUTH_PASSWORD=${yourPassword}
    COMPANY_NAME=${yourCompanyName}
    FIXTURES_EXTAENAL_ID_PREFIX=${prefixForCustoemrExternalId}
    FIXTURES_NUMBER=${numberOfFixturesToGenerate}
    ```
  invoke the generation of fixtures by
    ```shell
    npm run start:fixtures
    ```
- ### automation(cucumber)
  ensure that the correct environment is configured in `packages/automation/.env` like:
    ```dotenv
    AUTH_USERNAME=${yourUsername}
    AUTH_PASSWORD=${yourPassword}
    ```
  invoke the cucumber tests by
    ```shell
    npm run test:cucumber
    ```