import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DistributorDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const distributor = await prisma.distributor.findUnique({
    where: {
      id,
    },
    include: {
      orders: true,
    },
  });

  if (!distributor) {
    return notFound();
  }

  const totalOrders = distributor.orders.length;

  const totalBusiness = distributor.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const outstanding = distributor.orders.reduce(
    (sum, order) => sum + (order.totalAmount - order.paidAmount),
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {distributor.firmName}
        </h1>

        <p className="mt-1 text-gray-500">
          Distributor Profile
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-900">
            {totalOrders}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Business
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-900">
            ₹{totalBusiness.toFixed(0)}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Outstanding
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            ₹{outstanding.toFixed(0)}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Credit Days
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-900">
            {distributor.creditDays}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-900">
          Distributor Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            label="Contact Person"
            value={distributor.contactName}
          />

          <Info
            label="Phone"
            value={distributor.phone}
          />

          <Info
            label="Email"
            value={distributor.email || "-"}
          />

          <Info
            label="GSTIN"
            value={distributor.gstin || "-"}
          />

          <Info
            label="City"
            value={distributor.city}
          />

          <Info
            label="State"
            value={distributor.state}
          />

          <Info
            label="Territory"
            value={distributor.territory || "-"}
          />

          <Info
            label="Status"
            value={distributor.status}
          />
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}