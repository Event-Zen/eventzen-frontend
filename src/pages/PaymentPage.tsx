import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateEvent } from "../shared/api/eventClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe outside of components to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "", {
  developerTools: { assistant: { enabled: false } }
});

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // Prevent redirect to let UI handle success gracefully
    });

    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert(`Success! Payment was securely confirmed by Stripe. \nStripe Output ID: ${paymentIntent.id}`);
      navigate("/"); // Redirect to home or confirmation page
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Stripe handles all inputs, styling, CVC, and active validation automatically here */}
      <PaymentElement className="py-2" />

      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      
      <div className="pt-6">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing Securely..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [initialError, setInitialError] = useState("");

  useEffect(() => {
    // Connect to backend to create intent and fetch secret on load
    const fetchIntent = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: "evt_123", // Mock data
            userId: "usr_456",
            amount: 50,
            currency: "usd",
          }),
        });
        const data = await response.json();
        
        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setInitialError(data.error || "Failed to initialize payment");
        }
      } catch (err) {
        console.error("Failed to fetch intent:", err);
        setInitialError("Cannot connect to backend server.");
      }
    };
    fetchIntent();
  }, []);

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

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-[#d9d9d9] p-10 shadow-lg">
            <h1 className="text-2xl font-bold text-slate-900 drop-shadow-sm">Secure Payment</h1>
            <div className="mt-4 mb-2 h-px w-full bg-black/30" />

            {initialError ? (
              <div className="mt-8 rounded-lg bg-red-100 p-4 border border-red-300">
                <p className="text-red-700 font-semibold">Error: {initialError}</p>
                <p className="text-sm mt-1 text-red-600">Please make sure your payment-service (localhost:3003) is running.</p>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="mt-8 flex flex-col justify-center items-center py-10 space-y-4">
                <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin"></div>
                <p className="text-slate-600 font-medium">Initializing secure checkout session...</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 w-full max-w-xl mx-auto pl-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-800 hover:shadow-lg transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}