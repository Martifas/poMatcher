export type Email = {
  sent: string;
  received: string;
  from_: string;
  to: string[];
  cc: string[];
  subject: string;
  body: string;
  thread_id: number;
};

export type POIdMatchResult = {
  po: PurchaseOrder;
  reasoning: string;
  confidence: number;
};

export type EmailPoMatchResult = {
  email_id: number;
  po_id: string;
  confidence: number;
  reasoning: string;
};

export type PurchaseOrder = {
  po_id: string;
  buyer: {
    buyer_id: string;
    company_name: string;
    registration_no: number;
    vat_no: string;
    billing_address: string;
    billing_city: string;
    billing_country: string;
    billing_postcode: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    default_currency: string;
    default_incoterms: string;
    default_payment_terms: string;
  };
  supplier: {
    supplier_id: string;
    supplier_name: string;
    tax_id: string;
    vat_no: string;
    address_line1: string;
    city: string;
    country: string;
    postcode: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    payment_terms: string;
    currency: string;
    incoterms_preference: string;
    lead_time_days: number;
    preferred_ship_method: string;
    rating: number;
  };
  issue_date: string;
  confirm_target_date: string;
  expected_ship_date: string;
  expected_delivery_date: string;
  currency: string;
  incoterms: string;
  payment_terms: string;
  ship_method: string;
  ship_from_country: string;
  ship_to_city: string;
  ship_to_country: string;
  freight_terms: string;
  carrier: string;
  total_lines: number;
  subtotal: number;
  tax_total: number;
  freight_cost: number;
  grand_total: number;
  status: string;
  notes: string;
  lines: {
    po_id: string;
    line_no: number;
    sku: string;
    description: string;
    category: string;
    qty: number;
    uom: string;
    unit_price: number;
    discount_pct: number;
    net_unit_price: number;
    currency: string;
    tax_rate: number;
    net_amount: number;
    tax_amount: number;
    total_amount: number;
    country_of_origin: string;
    need_by_date: string;
  };
};
