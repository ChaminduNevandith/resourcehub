"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["employee", "administrator"]),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true, role: "employee" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const user = await signIn(
        values.email.trim(),
        values.password,
        values.role,
      );

      if (user.role === "administrator") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-4">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <Mail
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            Email address
          </label>

          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full"
            {...register("email")}
          />

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1 text-sm text-red-600"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="role" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-slate-400" /> Sign in as</label>
          <select id="role" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" {...register("role")}>
            <option value="employee">Employee</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <LockKeyhole
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className="w-full pr-10"
              {...register("password")}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-1 text-sm text-red-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-slate-300 accent-blue-600"
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Forgot password?
        </Link>
      </div>

      {/* Login error */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      {/* Registration link */}
      <p className="text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
