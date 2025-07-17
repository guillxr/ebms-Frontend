"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { toast } from "react-toastify";
import { useState } from "react";
import { loginUser } from "@/services/authService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await loginUser(data.email, data.password);
      const token = result.token;

      Cookies.set("token", token, {
        expires: 30,
        path: "/",
      });

      toast.success("Login realizado com sucesso!");

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error("Erro ao tentar fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[400px] mx-auto space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-center">Entrar no sistema</h2>

      <div>
        <label className="block mb-1 text-sm" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full p-3 border border-border rounded-lg focus:ring focus:outline-none bg-input text-black dark:text-white"
          placeholder="Digite seu email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full p-3 border border-border rounded-lg focus:ring focus:outline-none bg-input text-black dark:text-white"
          placeholder="Digite sua senha"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Fazer Login"}
      </button>

      <div className="text-sm text-center">
        <Link href="/register" className="text-primary hover:underline cursor-pointer">
          Não tenho conta
        </Link>
      </div>
    </form>
  );
}
