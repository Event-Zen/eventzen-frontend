import { useState } from "react";

type Role = "ATTENDEE" | "VENDOR" | "PLANNER";

export default function Signup() {
  const [role, setRole] = useState<Role>("ATTENDEE");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // later: call API register()
    console.log({
      role,
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sign up as Attendee, Vendor, or Planner.
        </p>

        {/* Role selector */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <RoleButton value="ATTENDEE" role={role} setRole={setRole} />
            <RoleButton value="VENDOR" role={role} setRole={setRole} />
            <RoleButton value="PLANNER" role={role} setRole={setRole} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Name">
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </Field>

          <Field label="Email">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07X XXX XXXX"
                autoComplete="tel"
              />
            </Field>

            <Field label="Address">
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City / Area"
                autoComplete="address-level2"
              />
            </Field>
          </div>

          <Field label="Password">
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          <Field label="Confirm password">
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Field>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
          >
            Sign up
          </button>

          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

function RoleButton({
  value,
  role,
  setRole,
}: {
  value: Role;
  role: Role;
  setRole: (r: Role) => void;
}) {
  const active = role === value;

  return (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={[
        "rounded-lg border px-2 py-2 text-xs sm:text-sm font-semibold transition",
        active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      {value}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}