"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Removed duplicate LoginForm function implementation

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inicialize o useRouter

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      console.log("Login data", data);
      // Simulação de uma chamada de API de login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulação de sucesso de login
      // Em um cenário real, você receberia um token de sessão ou similar
      // e o armazenaria (ex: em um cookie)
      document.cookie = 'session_token=your_fake_token; path=/; max-age=3600'; // Exemplo de cookie

      toast.success("Login realizado com sucesso!");
      
      // Redirecionar para o dashboard após o login bem-sucedido
      router.push('/dashboard'); 

    } catch (error) {
      toast.error("Erro ao logar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow-md">
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
        {typeof errors.email?.message === "string" && (
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
        {typeof errors.password?.message === "string" && (
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
    </form>
  );
}