import { Building2, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-blue-600 via-blue-700 to-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">RH</span>
              <span className="text-2xl font-semibold">ResourceHub</span>
            </div>
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium"><Sparkles className="h-4 w-4" /> Demo login</p>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">Book smarter, manage resources, and keep teams in sync.</h1>
              <p className="max-w-md text-base text-blue-100">A polished resource booking dashboard for meeting rooms, workspaces, parking, and employee equipment.</p>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-blue-50">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><Building2 className="h-5 w-5" /> Mock bookings with conflict detection</div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-600">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to ResourceHub</h2>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
