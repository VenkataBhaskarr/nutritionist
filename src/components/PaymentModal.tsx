// components/PaymentModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/pay", { phone, amount });
      toast.success("Payment initiated successfully");
      onClose();
    } catch (err) {
      toast.error("Payment failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl mx-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-10 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xl transition"
            >
              &times;
            </button>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
                 Payment
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-6">
                we will send a link for payment to your mobile number.
              </p>

              <div className="w-full max-w-md space-y-5">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-3 text-lg rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay ₹${amount}`}
                </button>
              </div>

              <p className="mt-6 text-xs text-neutral-400">
                Your payment is secure and encrypted.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
