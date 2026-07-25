"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PatientPortal from "@/components/PatientPortal";
import SpecialistPortal from "@/components/SpecialistPortal";

type User = { id: string; email: string; full_name: string; role: "patient" | "specialist" };

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (!d.user) {
          router.replace("/login?next=/account");
        } else {
          setUser(d.user);
          setChecked(true);
        }
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!checked || !user) {
    return <div className="container-page py-16 text-center text-muted">Loading your account…</div>;
  }

  return (
    <div className="container-page py-14">
      <div className="mb-6 flex justify-end">
        <button onClick={handleLogout} className="text-sm font-medium text-muted hover:text-red-600">
          Log out
        </button>
      </div>
      {user.role === "specialist" ? (
        <SpecialistPortal fullName={user.full_name} />
      ) : (
        <PatientPortal fullName={user.full_name} />
      )}
    </div>
  );
}
