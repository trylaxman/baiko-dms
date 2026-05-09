import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Store,
  Gift,
  BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Distributors", href: "/distributors", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Retailers", href: "/retailers", icon: Store },
  { label: "Schemes", href: "/schemes", icon: Gift },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold text-green-900">Baiko</h1>
        <p className="text-sm text-gray-500">Distributor Management</p>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-900"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}