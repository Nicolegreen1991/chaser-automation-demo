import axios from 'axios';
import {CreateCustomerRequest} from "./dto/create-customer-request";
import {ensureSixDigits} from "./utils/string-helper";

type CustomerRequest = {
    index: number,
    companyName: string,
    externalId: string
};

function getCustomerRequest(props: CustomerRequest): CreateCustomerRequest {
    const indexRep = ensureSixDigits(props.index)
    return {
        addresses: [],
        company_name: props.companyName,
        contact_email_address: `${indexRep}@test.com`,
        contact_first_name: `first_${indexRep}`,
        contact_last_name: `last_${indexRep}`,
        external_id: props.externalId,
        groups: [],
        mobile_number: `+447406${indexRep}`,
        phone_number: `01642-${indexRep}`,
        status: "ACTIVE"
    };
}

export async function createCustomer(
    baseUrl: string,
    username: string,
    password: string,
    customerProps: CustomerRequest
) {
    const endpoint = `${baseUrl}/v1/customers`;

    const createCustomerRequest = getCustomerRequest(customerProps)
    try {
        const response = await axios.post(endpoint, createCustomerRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username, // Basic auth username
                password, // Basic auth password
            },
        });

        console.log('Customer created successfully:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating customer:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}