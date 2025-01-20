import axios from 'axios';
import {ensureSixDigits} from "./utils/string-helper";
import {CreateInvoiceRequest} from "./dto/create-invoice-request";

type InvoiceRequest = {
    index: number,
    companyName: string,
    externalCustomerId: string,
    invoiceId: string,
    createdDate: Date,
    dueDate: Date,
    dueAmount: number,
    paid: null | {
        amount: number
        date: Date
        status: "PAID" | "DRAFT"
    }
};

function getInvoiceRequest(props: InvoiceRequest): CreateInvoiceRequest {
    const indexRep = ensureSixDigits(props.index)
    return {
        invoice_id: props.invoiceId,
        invoice_number: indexRep,
        status: (props.paid) ? props.paid.status : "AUTHORISED",
        currency_code: "GBP",
        amount_due: props.dueAmount,
        amount_paid: (props.paid) ? props.paid.amount : 0,
        total: (props.paid) ? props.paid.amount : 0,
        date: props.createdDate.toISOString(),
        due_date: props.dueDate.toISOString(),
        customer_external_id: props.externalCustomerId,
        payments: (props.paid) ? [{
            amount: props.paid.amount,
            date: props.paid.date.toISOString()
        }] : [],
        fully_paid_date: (props.paid?.status === "PAID") ? props.paid.date.toISOString() : null
    };
}

export async function createInvoice(
    baseUrl: string,
    username: string,
    password: string,
    props: InvoiceRequest
) {
    const endpoint = `${baseUrl}/v1/invoices`;

    const createInvoiceRequest = getInvoiceRequest(props)

    try {
        const response = await axios.post(endpoint, createInvoiceRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username, // Basic auth username
                password, // Basic auth password
            },
        });

        console.log('Invoice created successfully:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating invoice:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}