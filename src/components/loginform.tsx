"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { toast } from "react-toastify";
import { useState } from "react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // validator em tempo real
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      console.log("Login data", data);
      // Simulator de autenticação — aqui voce pode conectar com uma API
      await new Promise((r) => setTimeout(r, 1500));

      toast.success("Login realizado com sucesso!");
    } catch {
      toast.error("Erro ao logar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold">Entrar no sistema</h2>

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
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Fazer Login"}
      </button>
    </form>
  );
}
