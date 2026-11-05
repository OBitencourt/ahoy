"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../../src/utils/auth";
import Link from "next/link";
import { signIn } from "@/src/lib/auth-client";

// Campo de texto: 48px de altura, raio 12px, borda --line (igual aos filtros do Explorar)
const inputBase =
  "h-12 w-full rounded-xl border bg-white px-4 text-base font-normal text-ink outline-none transition-colors placeholder:text-muted focus:border-teal focus:ring-4 focus:ring-teal/20";

// Erros que o Better Auth devolve em `?error=` quando o fluxo OAuth falha
const oauthErrors: Record<string, string> = {
  access_denied: "Cancelaste o início de sessão com o Google.",
  email_not_found: "O Google não partilhou o teu email. Tenta com outra conta.",
  email_not_verified: "Confirma o email da tua conta Google antes de entrar.",
};
const oauthFallbackError =
  "Não foi possível entrar com o Google. Tenta novamente.";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Erro devolvido pelo Google/Better Auth no redirecionamento (/login?error=...)
  const oauthErrorCode = searchParams.get("error");
  const oauthError = oauthErrorCode
    ? (oauthErrors[oauthErrorCode] ?? oauthFallbackError)
    : undefined;
  const bannerError = serverError ?? oauthError;

  const isBusy = isSubmitting || isGoogleLoading;

  async function onSubmit(data: LoginFormData) {
    setServerError(undefined);
    const { email, password } = data;
    const result = await signIn.email({ email, password });

    if (result.error) {
      setServerError(result.error.message);
      return;
    }

    router.push("/");
  }

  async function onGoogleSignIn() {
    setServerError(undefined);
    setIsGoogleLoading(true);

    const result = await signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/login",
    });

    // Em caso de sucesso o browser é redirecionado para o Google,
    // por isso o loading só termina se algo falhar antes disso.
    if (result?.error) {
      setServerError(result.error.message ?? oauthFallbackError);
      setIsGoogleLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 py-16">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Ahoy">
        <Image
          src="/assets/logo.svg"
          width={54}
          height={48}
          alt=""
          className="h-[47.83px] w-[53.85px] shrink-0"
        />
        <span className="font-brand text-[30px] font-extrabold text-navy">
          Ahoy
        </span>
      </Link>

      <div className="w-full max-w-[480px] rounded-2xl border border-line bg-white p-8 sm:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-10 text-on-teal sm:text-[36px] sm:leading-[44px]">
            Bem-vindo de volta.
          </h1>
          <p className="text-base font-normal leading-6 text-muted">
            Entra na tua conta para continuar a partilhar.
          </p>
        </div>

        {bannerError && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {bannerError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-6"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputBase} ${
                errors.email ? "border-red-500" : "border-line"
              }`}
              placeholder="tu@exemplo.com"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-ink"
              >
                Palavra-passe
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-navy underline"
              >
                Esqueceste-te da palavra-passe?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`${inputBase} pr-24 ${
                  errors.password ? "border-red-500" : "border-line"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={
                  showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-semibold text-navy"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="mt-2 flex h-12 cursor-pointer items-center justify-center rounded-xl bg-teal px-6 text-sm font-bold text-on-teal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4" aria-hidden="true">
          <div className="h-px flex-1 bg-line" />
          <span className="text-sm font-normal text-muted">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={isBusy}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-line bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-sky disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image
            src="/assets/google.svg"
            width={20}
            height={20}
            alt=""
            className="shrink-0"
          />
          {isGoogleLoading ? "A ligar ao Google..." : "Continuar com o Google"}
        </button>

        <p className="mt-8 text-center text-sm font-normal text-muted">
          Ainda não tens conta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-navy hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}

// useSearchParams exige um limite de Suspense no Next.js (build estático)
const LoginPage = () => (
  <Suspense>
    <LoginForm />
  </Suspense>
);

export default LoginPage;