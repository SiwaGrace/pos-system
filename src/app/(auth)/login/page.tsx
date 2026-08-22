"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold text-white">
            T
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TillFlow</h1>
          <p className="text-sm text-slate-500">Sign in to your store</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@shop.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo admin: admin@shop.com / admin123
        </p>
      </div>
    </div>
  );
}