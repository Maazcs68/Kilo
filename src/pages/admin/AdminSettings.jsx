import React, { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { getStoreSettings, updateStoreSettings } from "../../services/settingsService";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "Meshoo Online Store",
    logo: "",
    email: "support@meshoo.com",
    phone: "+92 300 1234567",
    address: "Lahore, Pakistan",
    currency: "PKR",
    shippingFee: 200,
    maintenanceMode: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getStoreSettings();
        setSettings(data);
      } catch (err) {
        console.error("Load settings error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      await updateStoreSettings(settings);
      setNotice("Store settings updated successfully in Firestore!");
    } catch (err) {
      setNotice(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure global store attributes, currency, and fees</p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {notice}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              required
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Currency Code</label>
            <input
              type="text"
              required
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Support Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Standard Flat Shipping Fee (PKR)</label>
            <input
              type="number"
              value={settings.shippingFee}
              onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Store Physical Location</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="maintenance"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="maintenance" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Enable Maintenance Mode (Temporarily disables checkout)
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? "Updating..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
