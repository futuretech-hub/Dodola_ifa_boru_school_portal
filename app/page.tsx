"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { DecorativeWaves } from "@/components/DecorativeWaves";

type Mode = "login" | "register";

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="field-icon">
      <circle cx="12" cy="7" r="3.25" />
      <path d="M5.5 20c.45-3.75 2.48-5.7 6.5-5.7s6.05 1.95 6.5 5.7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="field-icon">
      <rect x="5.25" y="10" width="13.5" height="10" rx="2" />
      <path d="M8.25 10V7.3a3.75 3.75 0 0 1 7.5 0V10" />
    </svg>
  );
}

function EyeIcon({ hidden = false }: { hidden?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="visibility-icon">
      {hidden ? (
        <>
          <path d="m4 4 16 16" />
          <path d="M9.7 9.7a3.25 3.25 0 0 0 4.6 4.6" />
          <path d="M6.1 6.8C3.9 8.25 2.65 10 2.65 12c0 3.1 4.2 6.7 9.35 6.7 1.6 0 3.05-.35 4.3-.92" />
          <path d="M13.3 5.38A11.4 11.4 0 0 1 21.35 12c0 1.2-.65 2.42-1.72 3.55" />
        </>
      ) : (
        <>
          <path d="M2.65 12c1.45-3.1 4.2-5.7 9.35-5.7s7.9 2.6 9.35 5.7c-1.45 3.1-4.2 5.7-9.35 5.7S4.1 15.1 2.65 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="chevron-icon">
      <path d="m6.5 9 5.5 5.5L17.5 9" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
      <path d="M13.5 4.5H19v15h-5.5" />
      <path d="M3.5 12h11" />
      <path d="m10.5 8.5 3.5 3.5-3.5 3.5" />
    </svg>
  );
}

function RegisterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="button-icon">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.45-3.2 2.3-5 5.5-5s5.05 1.8 5.5 5" />
      <path d="M18 12v7M14.5 15.5h7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="back-icon">
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function SchoolMark() {
  return (
    <div className="school-mark" aria-label="Ifa Boru school emblem">
      <div className="school-mark-fallback">IFB</div>
      <Image
        src="/images/school-logo.png"
        alt="Ifa Boru Boarding School emblem"
        fill
        sizes="(max-width: 880px) 112px, 182px"
      />
    </div>
  );
}

function FieldShell({ children }: { children: React.ReactNode }) {
  return <div className="field-shell">{children}</div>;
}

type SelectFieldProps = {
  label: string;
  name: string;
  options: string[];
};

function SelectField({ label, name, options }: SelectFieldProps) {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div className="select-field" ref={fieldRef}>
      <input type="hidden" name={name} value={selected} required />
      <button
        className={`select-trigger${open ? " is-open" : ""}${selected ? " has-value" : ""}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected || label}</span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="select-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              className={`select-option${selected === option ? " is-selected" : ""}`}
              key={option}
              type="button"
              role="option"
              aria-selected={selected === option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              <span>{option}</span>
              {selected === option && <span className="option-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setSubmitted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const isLogin = mode === "login";

  return (
    <main className="portal-landing">
      <section className="auth-stage" aria-label="Dodola Ifa Boru School Portal">
        <div className="hero-visual">
          <div className="hero-photo" role="img" aria-label="Dodola Ifa Boru school campus" />
          <div className="hero-sky-wash" />
          <div className="hero-copy">
            <SchoolMark />
            <h1>Dodola Ifa Boru</h1>
            <p className="hero-school-name">Special Boarding School</p>
          </div>
          <DecorativeWaves className="hero-waves" />
        </div>

        <div className="auth-panel">
          <div className="auth-heading">
            <p className="panel-kicker">School portal</p>
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p>
              {isLogin
                ? "Log in to continue to your school workspace."
                : "Register your account to get started."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="form-row">
                <FieldShell>
                  <UserIcon />
                  <label className="sr-only" htmlFor="full-name">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                  />
                </FieldShell>
                <SelectField label="Gender" name="gender" options={["Male", "Female"]} />
              </div>
            )}

            {mode === "register" && (
              <div className="form-row">
                <SelectField label="Grade" name="grade" options={["Grade 9", "Grade 10", "Grade 11", "Grade 12"]} />
                <SelectField
                  label="Section"
                  name="section"
                  options={["Section A", "Section B", "Section C", "Section D", "Section E", "Section F"]}
                />
              </div>
            )}

            {isLogin && (
              <>
                <label className="sr-only" htmlFor="full-name">
                  Full Name
                </label>
                <FieldShell>
                  <UserIcon />
                  <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                  />
                </FieldShell>
              </>
            )}

            <FieldShell>
              <LockIcon />
              <input
                id="password"
                name="password"
                className="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
              <button
                className="visibility-button"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                <EyeIcon hidden={showPassword} />
              </button>
            </FieldShell>

            {mode === "register" && (
              <FieldShell>
                <LockIcon />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  className="password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  required
                />
                <button
                  className="visibility-button"
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  <EyeIcon hidden={showConfirmPassword} />
                </button>
              </FieldShell>
            )}

            {isLogin && (
              <button className="forgot-button" type="button">
                Forgot Password
              </button>
            )}

            <button className="primary-button" type="submit">
              {isLogin ? <LoginIcon /> : <RegisterIcon />}
              <span>{isLogin ? "Log In" : "Register"}</span>
            </button>

            {submitted && (
              <p className="form-status" role="status">
                {isLogin
                  ? "The sign-in form is ready for Supabase authentication."
                  : "Your registration request is ready for review. Complete your profile after approval."}
              </p>
            )}
          </form>

          <div className="auth-divider" aria-hidden="true">
            <span />
            <b>or</b>
            <span />
          </div>

          {isLogin ? (
            <button className="secondary-button" type="button" onClick={() => switchMode("register")}>
              Register
            </button>
          ) : (
            <button className="secondary-button" type="button" onClick={() => switchMode("login")}>
              <ArrowLeftIcon />
              Back to Login
            </button>
          )}

        </div>
      </section>
    </main>
  );
}
