"use client"

import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        A página que você está procurando não existe.
      </p>
      <button
        onClick={() => router.push("/")}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Voltar para a Home
      </button>
    </div>
  )
}
