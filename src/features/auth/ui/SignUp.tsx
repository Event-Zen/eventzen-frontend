import { useState } from "react";
import { useRegister } from "../hooks/useRegister"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

type Role = "ATTENDEE" | "VENDOR" | "PLANNER" | "ADMIN";

export default function Signup() {
  const [role, setRole] = useState<Role>("ATTENDEE");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useRegister();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await register({
        role,
        name,
        email,
        password,
        phone,
        address,
      });
      console.log("REGISTER RESPONSE:", res);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Registration failed";

      setErrors({ email: message });
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Corner Squares */}
      {/* Top Left */}
      <div className="absolute top-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>

      {/* Top Right */}
      <div className="absolute top-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <RoleButton value="ATTENDEE" role={role} setRole={setRole} />
            <RoleButton value="VENDOR" role={role} setRole={setRole} />
            <RoleButton value="PLANNER" role={role} setRole={setRole} />
            <RoleButton value="ADMIN" role={role} setRole={setRole} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Name">
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </Field>

          <Field label="Email">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </Field>

          <Field label="Confirm password">
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
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
