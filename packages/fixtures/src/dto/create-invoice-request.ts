export interface CreateInvoiceRequest {
    invoice_id: string;
    invoice_number: string;
    status: "PAID" | "DRAFT"| "AUTHORISED"; // Status is explicitly "PAID"
    currency_code: string; // Currency code, e.g., "BMZ"
    amount_due: number;
    amount_paid: number;
    total: number;
    date: string; // ISO 8601 date-time string
    due_date: string; // ISO 8601 date-time string
    customer_external_id: string;
    fully_paid_date: string | null; // Nullable date
    payments: Payment[]
}

interface Payment {
    amount: number;
    date: string;
}