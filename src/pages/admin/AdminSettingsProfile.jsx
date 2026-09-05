import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Shield, Users, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/ui/Misc";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Input";
import { useToast } from "../../context/NotificationContext";

const SETTINGS_KEY = "thiru_admin_settings";
const STAFF_KEY = "thiru_admin_staff";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_NOTIF_PREFS = {
  newApplication: true,
  paymentCompleted: true,
  newClaim: true,
  policyRenewal: false,
  merchantRegistration: true,
};

export function AdminSettings() {
  const { toast } = useToast();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState(DEFAULT_NOTIF_PREFS);

  const [staffOpen, setStaffOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "Approver" });

  const [securityOpen, setSecurityOpen] = useState(false);
  const [security, setSecurity] = useState({ sessionTimeout: "30", requireStrongPassword: true });

  useEffect(() => {
    setNotifPrefs(readJSON(SETTINGS_KEY, DEFAULT_NOTIF_PREFS));
    setStaff(readJSON(STAFF_KEY, [
      { id: "STF-1", name: "Karthika M", email: "karthika@thiruinsurance.com", role: "Claims Approver" },
      { id: "STF-2", name: "Rajesh V", email: "rajesh@thiruinsurance.com", role: "Application Approver" },
    ]));
    setSecurity(readJSON("thiru_admin_security", { sessionTimeout: "30", requireStrongPassword: true }));
  }, []);

  function saveNotifPrefs() {
    writeJSON(SETTINGS_KEY, notifPrefs);
    toast("Notification preferences saved.");
    setNotifOpen(false);
  }

  function addStaff() {
    if (!newStaff.name || !newStaff.email) return;
    const updated = [...staff, { id: `STF-${Date.now().toString().slice(-4)}`, ...newStaff }];
    setStaff(updated);
    writeJSON(STAFF_KEY, updated);
    setNewStaff({ name: "", email: "", role: "Approver" });
    toast(`${newStaff.name} added with ${newStaff.role} access.`);
  }

  function removeStaff(id) {
    const updated = staff.filter((s) => s.id !== id);
    setStaff(updated);
    writeJSON(STAFF_KEY, updated);
  }

  function saveSecurity() {
    writeJSON("thiru_admin_security", security);
    toast("Security settings saved.");
    setSecurityOpen(false);
  }

  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Configuration" title="Settings" description="Platform-wide preferences and access control." />
      <div className="space-y-4">
        <Card className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center"><Bell size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Notification Preferences</p>
              <p className="text-xs text-navy-400">Choose which platform events trigger alerts</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setNotifOpen(true)}>Manage</Button>
        </Card>
        <Card className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center"><Users size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Staff & Role Access</p>
              <p className="text-xs text-navy-400">Manage who can approve applications and claims</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStaffOpen(true)}>Manage</Button>
        </Card>
        <Card className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center"><Shield size={17} /></span>
            <div>
              <p className="font-semibold text-navy-800 text-sm">Security</p>
              <p className="text-xs text-navy-400">Session and password policies</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSecurityOpen(true)}>Manage</Button>
        </Card>
      </div>

      {/* Notification Preferences Modal */}
      <Modal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notification Preferences"
        footer={<><Button variant="ghost" onClick={() => setNotifOpen(false)}>Cancel</Button><Button variant="emerald" onClick={saveNotifPrefs}>Save Preferences</Button></>}
      >
        <div className="space-y-3">
          {Object.entries({
            newApplication: "New Application submitted",
            paymentCompleted: "Payment completed",
            newClaim: "New Claim submitted",
            policyRenewal: "Policy renewal reminders",
            merchantRegistration: "New merchant registration",
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between bg-navy-50 rounded-lg px-4 py-3 cursor-pointer">
              <span className="text-sm text-navy-700">{label}</span>
              <input
                type="checkbox"
                className="accent-emerald-600 w-4 h-4"
                checked={notifPrefs[key]}
                onChange={(e) => setNotifPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </Modal>

      {/* Staff & Role Access Modal */}
      <Modal open={staffOpen} onClose={() => setStaffOpen(false)} title="Staff & Role Access" size="lg">
        <div className="space-y-2 mb-5">
          {staff.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-navy-50 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-navy-800">{s.name}</p>
                <p className="text-xs text-navy-400">{s.email} · {s.role}</p>
              </div>
              <button onClick={() => removeStaff(s.id)} className="text-navy-300 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {staff.length === 0 && <p className="text-sm text-navy-400 text-center py-4">No staff members added yet.</p>}
        </div>
        <div className="border-t border-navy-100 pt-4">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Add Staff Member</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Name"><Input value={newStaff.name} onChange={(e) => setNewStaff((s) => ({ ...s, name: e.target.value }))} /></Field>
            <Field label="Email"><Input type="email" value={newStaff.email} onChange={(e) => setNewStaff((s) => ({ ...s, email: e.target.value }))} /></Field>
          </div>
          <Field label="Role">
            <Select value={newStaff.role} onChange={(e) => setNewStaff((s) => ({ ...s, role: e.target.value }))}>
              <option>Application Approver</option>
              <option>Claims Approver</option>
              <option>Read Only</option>
            </Select>
          </Field>
          <Button variant="outline" size="sm" icon={Plus} className="mt-3" onClick={addStaff} disabled={!newStaff.name || !newStaff.email}>
            Add Staff Member
          </Button>
        </div>
      </Modal>

      {/* Security Modal */}
      <Modal
        open={securityOpen}
        onClose={() => setSecurityOpen(false)}
        title="Security Settings"
        footer={<><Button variant="ghost" onClick={() => setSecurityOpen(false)}>Cancel</Button><Button variant="emerald" onClick={saveSecurity}>Save Settings</Button></>}
      >
        <div className="space-y-4">
          <Field label="Session Timeout (minutes)">
            <Select value={security.sessionTimeout} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="240">4 hours</option>
            </Select>
          </Field>
          <label className="flex items-center justify-between bg-navy-50 rounded-lg px-4 py-3 cursor-pointer">
            <span className="text-sm text-navy-700">Require strong passwords for all accounts</span>
            <input
              type="checkbox"
              className="accent-emerald-600 w-4 h-4"
              checked={security.requireStrongPassword}
              onChange={(e) => setSecurity((s) => ({ ...s, requireStrongPassword: e.target.checked }))}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Account" title="Admin Profile" />
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-16 rounded-full bg-navy-800 text-white flex items-center justify-center text-xl font-bold">{user?.name?.[0]}</span>
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">{user?.name}</h3>
            <p className="text-sm text-navy-400">{user?.role}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-navy-100 pt-5">
          <div><p className="text-navy-400 text-xs mb-1">Email</p><p className="font-medium text-navy-800">{user?.email}</p></div>
          <div><p className="text-navy-400 text-xs mb-1">Admin ID</p><p className="font-medium text-navy-800 font-mono">{user?.id}</p></div>
        </div>
      </Card>
      <Card>
        <Button variant="danger" icon={LogOut} onClick={handleLogout}>Logout</Button>
      </Card>
    </div>
  );
}
