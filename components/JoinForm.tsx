"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const inputClass =
  "w-full rounded-xl border-2 border-borderish bg-surface px-4 py-3 text-lg text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent/70 focus:ring-2 focus:ring-accent/15";

const roles = ["AI · ML", "Software", "Hardware", "Product", "Design", "Creator"];

export default function JoinForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roles: [] as string[],
    why: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleRole = (role: string) =>
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role)
        ? f.roles.filter((r) => r !== role)
        : [...f.roles, role],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.why.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and why you want in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("error");
      setErrorMsg("That email address doesn't look right.");
      return;
    }

    setStatus("sending");

    const needTurn = `Application — VOIKES Technologies`;
    const body = encodeURIComponent(
      [
        "Name: " + form.name,
        "Email: " + form.email,
        "Interested in: " + (form.roles.length ? form.roles.join(", ") : "—"),
        "",
        "Why I want to join:",
        form.why,
        form.message ? "\nAnything else:\n" + form.message : "",
      ].join("\n")
    );
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      needTurn
    )}&body=${body}`;

    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block font-hand text-xl text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block font-hand text-xl text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block font-hand text-xl text-muted">
            What do you want to build?{" "}
            <span className="text-faint">(pick any)</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const active = form.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  aria-pressed={active}
                  className={`rounded-full border-2 border-dashed px-4 py-1.5 font-hand text-lg transition-all hover:-translate-y-0.5 ${
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-borderish bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="why" className="mb-1.5 block font-hand text-xl text-muted">
            Why do you want to join?
          </label>
          <textarea
            id="why"
            name="why"
            rows={4}
            value={form.why}
            onChange={update}
            placeholder="Tell us what you'd bring to the bench..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block font-hand text-xl text-muted">
            Anything else? <span className="text-faint">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={form.message}
            onChange={update}
            placeholder="Portfolio, links, wild ideas..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-lg text-red-700"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="w-full rounded-full border-2 border-foreground bg-foreground px-7 py-3.5 font-hand text-xl text-background shadow-[0_10px_30px_-12px_rgba(60,50,30,0.5)] transition-all hover:-translate-y-0.5 hover:rotate-1 hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "sending"
            ? "Opening your email app…"
            : status === "sent"
              ? "Opening…"
              : "Send application"}
        </button>
      </form>

      <AnimatePresence>
        {status === "sent" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-2xl border-2 border-dashed border-emerald-600/50 bg-emerald-50 px-5 py-4 text-lg text-emerald-800"
          >
            Your email app should have opened with the application filled in.
            If not, send it directly to{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium underline underline-offset-2"
            >
              {site.email}
            </a>
            .
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}