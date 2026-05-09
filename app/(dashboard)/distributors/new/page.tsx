import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createDistributor(formData: FormData) {
  "use server";

  const firmName = String(formData.get("firmName") || "");
  const contactName = String(formData.get("contactName") || "");
  const phone = String(formData.get("phone") || "");
  const email = String(formData.get("email") || "");
  const gstin = String(formData.get("gstin") || "");
  const city = String(formData.get("city") || "");
  const state = String(formData.get("state") || "");
  const territory = String(formData.get("territory") || "");
  const creditDays = Number(formData.get("creditDays") || 0);

  await prisma.distributor.create({
    data: {
      firmName,
      contactName,
      phone,
      email,
      gstin,
      city,
      state,
      territory,
      creditDays,
    },
  });

  redirect("/distributors");
}

export default function NewDistributorPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Distributor
        </h1>
        <p className="mt-1 text-gray-500">
          Add a new Baiko city-wise distributor.
        </p>
      </div>

      <form
        action={createDistributor}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Firm Name
            </label>
            <input
              name="firmName"
              required
              placeholder="Example: Sharma Traders"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              name="contactName"
              required
              placeholder="Example: Rajesh Sharma"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              required
              placeholder="9876543210"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              GSTIN
            </label>
            <input
              name="gstin"
              placeholder="GST number"
              className="w-full rounded-xl border px-4 py-3 uppercase outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              name="city"
              required
              placeholder="Ghaziabad"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              name="state"
              required
              placeholder="Uttar Pradesh"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Territory
            </label>
            <input
              name="territory"
              placeholder="Ghaziabad City / West UP"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Credit Days
            </label>
            <input
              name="creditDays"
              type="number"
              defaultValue={0}
              min={0}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <a
            href="/distributors"
            className="rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="rounded-xl bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Save Distributor
          </button>
        </div>
      </form>
    </div>
  );
}