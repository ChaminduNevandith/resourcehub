"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerUser } from "@/services/authService";

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);

    try {
      await registerUser(values.name, values.email, values.password);
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input label="Full name" type="text" placeholder="Jordan Smith" className="pl-10" {...register("name")} />
        </div>
        {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input label="Email address" type="email" placeholder="name@company.com" className="pl-10" {...register("email")} />
        </div>
        {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input label="Password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" className="pl-10 pr-10" {...register("password")} />
          <button type="button" className="absolute right-3 top-[46px] text-slate-500" onClick={() => setShowPassword((value) => !value)} aria-label="Show password">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}

        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input label="Confirm password" type={showConfirm ? "text" : "password"} placeholder="Repeat password" className="pl-10 pr-10" {...register("confirmPassword")} />
          <button type="button" className="absolute right-3 top-[46px] text-slate-500" onClick={() => setShowConfirm((value) => !value)} aria-label="Show confirm password">
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword ? <p className="text-sm text-red-600">{errors.confirmPassword.message}</p> : null}
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already registered? <Link href="/login" className="font-medium text-blue-600">Sign in</Link>
      </p>
    </form>
  );
}
