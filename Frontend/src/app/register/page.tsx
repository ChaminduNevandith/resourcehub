
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

const COPYRIGHT_YEAR = 2026;

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT - BRANDING PANEL */}
        <section className="relative hidden overflow-hidden bg-[#1456E8] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          {/* Background effects */}
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

          {/* Brand */}
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

          {/* Main introduction */}
          <div className="relative z-10 my-12">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">
              <Sparkles size={14} className="shrink-0 text-cyan-200" aria-hidden="true" />
              Your workspace starts here
              <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
              Better bookings.
              <br />
              Smarter teams.
              <br />
              <span className="text-cyan-200">
                Endless possibilities.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
              Join ResourceHub and experience a simpler way
              to book resources, manage availability, and
              organize your workspace.
            </p>

            {/* Feature preview */}
            <div className="mt-12 max-w-[480px] rounded-3xl border border-white/25 bg-white/95 p-5 text-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Your workspace
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Everything in one place
                  </h3>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Layers3 size={21} className="shrink-0" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-3">

                {/* Feature 1 */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarCheck2 size={22} className="shrink-0" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Easy Resource Booking
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Reserve rooms and equipment
                    </p>
                  </div>

                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Users size={22} className="shrink-0" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Team Collaboration
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Keep everyone connected
                    </p>
                  </div>

                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Zap size={22} className="shrink-0" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Real-Time Availability
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Find available resources faster
                    </p>
                  </div>

                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
                <Check size={16} className="shrink-0" aria-hidden="true" />
                Your organized workspace starts here
              </div>
            </div>
          </div>

          {/* Left footer */}
          <div className="relative z-10 flex items-center gap-2 text-sm text-blue-100">
            <ShieldCheck size={17} className="shrink-0" aria-hidden="true" />
            Simple, secure and efficient resource management
          </div>
        </section>

        {/* RIGHT - REGISTRATION */}
        <section className="flex min-h-screen flex-col bg-white px-6 py-8 sm:px-12 lg:px-14 xl:px-20">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Layers3 size={23} className="shrink-0" aria-hidden="true" />
            </div>

            <span className="text-xl font-bold text-slate-900">
              ResourceHub
            </span>
          </div>

          {/* Back navigation */}
          <div className="mt-8 lg:mt-0">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
              <ArrowLeft
                size={17}
                className="shrink-0 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              Back to sign in
            </Link>
          </div>

          {/* Form container */}
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-[420px]">

              {/* Heading */}
              <div className="mb-8">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Users size={27} className="shrink-0" aria-hidden="true" />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Get started
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Create your
                  <br />
                  account
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Set up your ResourceHub account and start
                  managing your workspace with ease.
                </p>
              </div>

              {/* Existing registration form */}
              <RegisterForm />
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
