
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

const COPYRIGHT_YEAR = 2026;

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-full lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT - BRANDING PANEL */}
        <section className="relative hidden overflow-hidden bg-[#1456E8] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[100px]" />
            <div className="absolute -bottom-48 -right-32 h-[550px] w-[550px] rounded-full bg-indigo-900/50 blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1456E8] shadow-lg">
              <Layers3 size={25} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                ResourceHub
              </h2>
              <p className="text-xs tracking-wide text-blue-100">
                RESOURCE MANAGEMENT
              </p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 my-12">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-200" />
              Smarter workspace management
              <ArrowUpRight size={14} />
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
              Everything your
              <br />
              team needs.
              <br />
              <span className="text-cyan-200">
                One smart space.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
              Simplify resource reservations, manage availability,
              and empower your team to work better together.
            </p>

            {/* Booking preview */}
            <div className="relative mt-12 max-w-[480px]">

              <div className="rounded-3xl border border-white/25 bg-white/95 p-5 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      YOUR WORKSPACE
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      Upcoming Bookings
                    </h3>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <CalendarDays size={21} />
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarDays size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      Conference Room A
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 size={12} />
                      Today, 10:00 AM - 11:00 AM
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
                    Confirmed
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Layers3 size={22} />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">
                      Creative Workspace
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 size={12} />
                      Tomorrow, 02:00 PM
                    </p>
                  </div>

                  <CheckCircle2
                    size={19}
                    className="text-green-500"
                  />
                </div>

              </div>

              {/* Floating notification */}
              <div className="absolute -bottom-7 -right-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-slate-900 shadow-xl xl:-right-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check size={21} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    Booking confirmed!
                  </p>
                  <p className="text-xs text-slate-500">
                    You're all set to go.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center gap-2 text-sm text-blue-100">
            <ShieldCheck size={17} />
            Secure and reliable resource management
          </div>
        </section>

        {/* RIGHT - LOGIN FORM */}
        <section className="flex min-h-screen flex-col bg-white px-6 py-8 sm:px-12 lg:min-h-0 lg:px-14 xl:px-20">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Layers3 size={23} />
            </div>
            <span className="text-xl font-bold text-slate-900">
              ResourceHub
            </span>
          </div>

          {/* Login container */}
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="w-full max-w-[420px]">

              <div className="mb-9">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={27} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Welcome back
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Sign in to your
                  <br />
                  workspace
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Enter your credentials to access your
                  ResourceHub dashboard.
                </p>
              </div>

              {/* Existing login functionality */}
              <LoginForm />


            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
