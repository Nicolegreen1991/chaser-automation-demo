interface Group {
    name: string;
    id: string;
    status: "ACTIVE";
}

interface Address {
    address_type: "POBOX";
    country: string;
    region: string;
    city: string;
    postal_code: string;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    address_line4: string;
}

export interface CreateCustomerRequest {
    external_id: string;
    company_name: string;
    contact_first_name: string;
    contact_last_name: string;
    contact_email_address: string; // Ensure email validation in usage
    phone_number: string;
    mobile_number: string;
    status: "ACTIVE";
    groups: Group[];
    addresses: Address[];
}
