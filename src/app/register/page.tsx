'use client'

// Importações das bibliotecas de formulário e validação
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Axios para fazer requisições HTTP
import axios from 'axios'

// Hooks do React e Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Importação dos componentes do ShadCN
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// Esquema de validação com Zod
// Define as regras para cada campo do formulário
    const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

// Tipagem dos dados do formulário com base no esquema Zod
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  // Estados para loading e mensagem de erro
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

  // Hook de navegação do Next.js (App Router)
    const router = useRouter()

  // Configurações do React Hook Form com integração ao Zod
    const {
        register, // método para conectar campos do form
        handleSubmit, // função que lida com o envio do form
        formState: { errors }, // objeto que contém os erros de validação
    } = useForm<FormData>({
        resolver: zodResolver(schema), // conecta com o schema do Zod
    })

  // Função chamada quando o formulário for enviado
    const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    try {
      // Faz a requisição POST para a rota de registro da API
      // Inclui o campo 'role' que a API exige: DONOR ou ADMIN
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        ...data,
        role: 'DONOR', // fixado como DONOR
    })

      // Se der tudo certo, redireciona para a página de login
    router.push('/login')
    } catch (err: any) {
      // Se a API retornar erro, mostra a mensagem para o usuário
    setError(err.response?.data?.message || 'Erro ao registrar')
    } finally {
      setLoading(false) // Finaliza o estado de carregamento
    }
}

    return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4">
      {/* Card estilizado para centralizar o conteúdo */}
        <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

          {/* Formulário com os campos controlados */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register('name')} placeholder="Seu nome" />
                {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
            </div>

            {/* Campo Email */}
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com"
            />
            {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder=""
            />
            {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            </div>

            {/* Exibe erro geral da API (ex: email já existe) */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Botão de envio com estado de loading */}
            <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
            </Button>
        </form>
        </CardContent>
    </Card>
    </div>
)
}