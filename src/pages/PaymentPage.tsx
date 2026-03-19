import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type PaymentForm = {
  cardholderName: string;
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
};

function formatCardNumber(raw: string) {
  // keep digits only, max 16
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  // group into 4s
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4); // MMYY
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function isValidExpiry(expiry: string) {
  // expects "MM / YY" or "MM/YY"
  const cleaned = expiry.replace(/\s/g, "");
  const m = cleaned.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  const yy = Number(m[2]);
  if (mm < 1 || mm > 12) return false;

  // basic future-ish check (not perfect)
  const now = new Date();
  const curYY = Number(String(now.getFullYear()).slice(-2));
  const curMM = now.getMonth() + 1;

  return yy > curYY || (yy === curYY && mm >= curMM);
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PaymentForm>({
    cardholderName: "PAULINA CHIMAROKE",
    cardNumber: "9870 3456 7890 6473",
    expiry: "03 / 25",
    cvc: "654",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardDigits = useMemo(() => form.cardNumber.replace(/\D/g, ""), [form.cardNumber]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.cardholderName.trim()) nextErrors.cardholderName = "Cardholder name is required.";

    if (cardDigits.length !== 16) nextErrors.cardNumber = "Card number must be 16 digits.";

    if (!isValidExpiry(form.expiry)) nextErrors.expiry = "Enter a valid expiry (MM / YY).";

    const cvcDigits = form.cvc.replace(/\D/g, "");
    if (cvcDigits.length < 3 || cvcDigits.length > 4) nextErrors.cvc = "CVC must be 3–4 digits.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Connect to our new Payment Service backend!
      const response = await fetch("http://localhost:3003/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "evt_123", // Mock data for test
          userId: "usr_456",
          amount: 50, // Test amount
          currency: "usd",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      console.log("Stripe Client Secret received:", data.clientSecret);
      alert(`Success! Successfully reached backend. \nPayment ID: ${data.paymentId}`);
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative Corner Squares */}
      {/* Top Left */}
      <div className="absolute top-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>

      {/* Top Right */}
      <div className="absolute top-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Layout: Center card */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-[#d9d9d9] p-10 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Payment Details</h1>
            <div className="mt-2 h-px w-full bg-black/40" />

            <form onSubmit={onPay} className="mt-8 space-y-5">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Cardholder&apos;s Name
                </label>
                <input
                  value={form.cardholderName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cardholderName: e.target.value.toUpperCase() }))
                  }
                  className={[
                    "mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none",
                    errors.cardholderName ? "border-red-500" : "border-transparent",
                    "focus:border-blue-500",
                  ].join(" ")}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-xs text-red-600">{errors.cardholderName}</p>
                )}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">Card Number</label>

                <div
                  className={[
                    "mt-2 flex items-center gap-3 rounded-lg border bg-white px-4 py-3",
                    errors.cardNumber ? "border-red-500" : "border-transparent",
                    "focus-within:border-blue-500",
                  ].join(" ")}
                >
                  {/* Mastercard-like icon */}
                  <div className="relative h-6 w-10">
                    <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-red-500/90" />
                    <span className="absolute left-4 top-0 h-6 w-6 rounded-full bg-amber-400/90 mix-blend-multiply" />
                  </div>

                  <input
                    value={form.cardNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))
                    }
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Expiry</label>
                  <input
                    value={form.expiry}
                    onChange={(e) => setForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    inputMode="numeric"
                    placeholder="MM / YY"
                    className={[
                      "mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none",
                      errors.expiry ? "border-red-500" : "border-transparent",
                      "focus:border-blue-500",
                    ].join(" ")}
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">CVC</label>
                  <input
                    value={form.cvc}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))
                    }
                    inputMode="numeric"
                    placeholder="123"
                    className={[
                      "mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none",
                      errors.cvc ? "border-red-500" : "border-transparent",
                      "focus:border-blue-500",
                    ].join(" ")}
                  />
                  {errors.cvc && <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>}
                </div>
              </div>

              {/* Pay button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-44 rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Back button bottom-left */}
        <div className="mt-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}