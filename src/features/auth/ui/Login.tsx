import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // field + form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, loading } = useLogin();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await login({ email, password });

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      window.dispatchEvent(new Event("storage"));
      toast.success(`Welcome back, ${data.user.name || 'User'}!`);
      navigate("/");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid credentials";

      
      setErrors((prev) => ({ ...prev, form: message }));
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-600 mt-1">Login to your account</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {errors.form && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <Field label="Email">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "", form: "" }));
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </Field>

          <Field label="Password">
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "", form: "" }));
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
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
