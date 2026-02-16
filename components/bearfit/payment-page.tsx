// @/components/bearfit/payment-page.tsx

interface PaymentPageProps {
  payments: any[];
}

export function PaymentPage({ payments }: PaymentPageProps) {
  return (
    <div className="space-y-4">
      {payments.map((p) => (
        <div
          key={p.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{p.package_name}</p>
            <p>Stage: {p.stage}</p>
            <p>Amount: ${p.amount}</p>
            <p>Status: {p.status}</p>
            <p>Paid on: {new Date(p.payment_date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
