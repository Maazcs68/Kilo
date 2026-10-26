import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Users, Shield, CheckCircle2 } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "users");
      const snapshot = await getDocs(colRef);
      setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: nextRole });
      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: nextRole } : c))
      );
    } catch (err) {
      alert(`Role change error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review customer profiles, contact numbers, and administrative authorizations
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No registered users in the database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                        {cust.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {cust.name || "Unnamed"}
                    </td>
                    <td className="px-6 py-4">{cust.email}</td>
                    <td className="px-6 py-4">{cust.phone || "-"}</td>
                    <td className="px-6 py-4">{cust.city || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cust.role === "admin"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cust.role || "customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(cust.id, cust.role)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      >
                        {cust.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
