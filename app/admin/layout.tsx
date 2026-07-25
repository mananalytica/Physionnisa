"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/specialists", label: "Specialists" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand">
      <div className="border-b border-black/5 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-lg font-bold text-brand-500">
              Physionnisa Admin
            </Link>
            <nav className="hidden gap-6 sm:flex">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium ${
                    pathname === l.href ? "text-brand-600" : "text-ink/70 hover:text-brand-600"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-brand-600">
              View site ↗
            </Link>
            <button onClick={logout} className="btn-secondary !py-2 !px-4 text-sm">
              Log out
            </button>
          </div>
        </div>
      </div>
      <div className="container-page py-10">{children}</div>
    </div>
  );
}
