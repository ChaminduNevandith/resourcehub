import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-600">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Set up your ResourceHub profile</h1>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
