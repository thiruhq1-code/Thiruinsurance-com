import { useEffect, useState } from "react";
import { Field, Input, Select } from "../ui/Input";

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra Bank"];

function isValidUpi(v) {
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v.trim());
}
function isValidCardNumber(v) {
  return /^\d{16}$/.test(v.replace(/\s/g, ""));
}
function isValidExpiry(v) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim());
}
function isValidCvv(v) {
  return /^\d{3}$/.test(v.trim());
}

// Controlled-ish component: manages its own field state, and calls onValidityChange
// whenever the entered details become valid/invalid for the selected method.
// This is a mock — no real payment data is transmitted anywhere.
export default function PaymentMethodFields({ method, onValidityChange }) {
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    let valid = false;
    if (method === "UPI") valid = isValidUpi(upiId);
    else if (method === "Card") valid = isValidCardNumber(cardNumber) && isValidExpiry(cardExpiry) && isValidCvv(cardCvv);
    else if (method === "Net Banking") valid = !!bank;
    onValidityChange(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, upiId, cardNumber, cardExpiry, cardCvv, bank]);

  if (method === "UPI") {
    return (
      <Field label="UPI ID" required hint="e.g. yourname@paytm">
        <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
      </Field>
    );
  }

  if (method === "Card") {
    return (
      <div className="space-y-3">
        <Field label="Card Number" required>
          <Input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" required hint="MM/YY">
            <Input
              value={cardExpiry}
              onChange={(e) => {
                let v = e.target.value.replace(/[^\d/]/g, "");
                if (v.length === 2 && !v.includes("/")) v += "/";
                setCardExpiry(v.slice(0, 5));
              }}
              placeholder="MM/YY"
            />
          </Field>
          <Field label="CVV" required>
            <Input
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              type="password"
              inputMode="numeric"
            />
          </Field>
        </div>
      </div>
    );
  }

  if (method === "Net Banking") {
    return (
      <Field label="Select Bank" required>
        <Select value={bank} onChange={(e) => setBank(e.target.value)}>
          <option value="">Choose your bank</option>
          {BANKS.map((b) => <option key={b}>{b}</option>)}
        </Select>
      </Field>
    );
  }

  return null;
}
