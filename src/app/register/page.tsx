'use client'

// Importação de bibliotecas essenciais para formulário, validação e controle de estado
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Importação de componentes de UI personalizados (ShadCN)
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import Link from 'next/link'

// Mapeamento dos tipos sanguíneos visuais para os valores esperados pelo backend (enums)
const bloodTypeMap = {
  'A+': 'A_POSITIVO',
  'A-': 'A_NEGATIVO',
  'B+': 'B_POSITIVO',
  'B-': 'B_NEGATIVO',
  'AB+': 'AB_POSITIVO',
  'AB-': 'AB_NEGATIVO',
  'O+': 'O_POSITIVO',
  'O-': 'O_NEGATIVO',
} as const

// Validação dos dados com Zod, incluindo campos obrigatórios e regras de formato
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  donorData: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
    blood_type: z.string().min(1, 'Tipo sanguíneo é obrigatório'),
    gender: z.enum(['Masculino', 'Feminino', 'Outro'])
            .refine((val) => val, { message: 'Gênero é obrigatório' }),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    identity_document: z.string().min(1, 'Documento é obrigatório'),
    address: z.string().min(1, 'Endereço é obrigatório'),
  }),
})

// Geração do tipo de dados a partir do schema
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  // Estados de carregamento e erro
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Inicialização do formulário com validação Zod
  const {
    register,         // Usado para inputs simples
    handleSubmit,     // Função que trata o envio do formulário
    control,          // Usado para inputs controlados como Select
    formState: { errors }, // Contém erros de validação
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Função chamada ao enviar o formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    // Preparação do payload no formato que o backend espera
    const payload = {
      email: data.email,
      password: data.password,
      role: 'DONOR',
      donorData: {
        ...data.donorData,
        birth_date: new Date(data.donorData.birth_date).toISOString(),
        blood_type: bloodTypeMap[data.donorData.blood_type as keyof typeof bloodTypeMap],
        latitude: -23,
        longitude: -46,
      },
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, payload)
      router.push('/login')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erro completo:', err.response?.data)
        setError(err.response?.data?.error || 'Erro ao registrar')
      } else {
        console.error('Erro inesperado:', err)
        setError('Erro inesperado ao registrar')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // Layout da tela com fundo e centralização
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

          {/* Formulário com grid responsivo em duas colunas */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo de e-mail */}
            <div className="col-span-2 space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Campo de senha */}
            <div className="col-span-2 space-y-1">
              <Label>Senha</Label>
              <Input type="password" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Nome completo */}
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input {...register('donorData.name')} />
              {errors.donorData?.name && <p className="text-sm text-red-500">{errors.donorData.name.message}</p>}
            </div>

            {/* Data de nascimento */}
            <div className="space-y-1">
              <Label>Data de nascimento</Label>
              <Input type="date" {...register('donorData.birth_date')} />
              {errors.donorData?.birth_date && <p className="text-sm text-red-500">{errors.donorData.birth_date.message}</p>}
            </div>

            {/* Tipo sanguíneo (select controlado) */}
            <div className="space-y-1">
              <Label>Tipo Sanguíneo</Label>
              <Controller
                control={control}
                name="donorData.blood_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo sanguíneo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(bloodTypeMap).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.donorData?.blood_type && <p className="text-sm text-red-500">{errors.donorData.blood_type.message}</p>}
            </div>

            {/* Gênero (select com enum correto) */}
            <div className="space-y-1">
              <Label>Gênero</Label>
              <Controller
                control={control}
                name="donorData.gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.donorData?.gender && <p className="text-sm text-red-500">{errors.donorData.gender.message}</p>}
            </div>

            {/* Telefone */}
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input {...register('donorData.phone')} />
              {errors.donorData?.phone && <p className="text-sm text-red-500">{errors.donorData.phone.message}</p>}
            </div>

            {/* Documento de identidade */}
            <div className="space-y-1">
              <Label>Documento</Label>
              <Input {...register('donorData.identity_document')} />
              {errors.donorData?.identity_document && <p className="text-sm text-red-500">{errors.donorData.identity_document.message}</p>}
            </div>

            {/* Endereço */}
            <div className="col-span-2 space-y-1">
              <Label>Endereço</Label>
              <Input {...register('donorData.address')} />
              {errors.donorData?.address && <p className="text-sm text-red-500">{errors.donorData.address.message}</p>}
            </div>

            {/* Exibição de erro geral da API */}
            {error && <p className="text-sm text-red-600 col-span-2">{error}</p>}

            {/* Botão de envio do formulário */}
            <Button type="submit" className="w-full col-span-2" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </form>
          <div className="text-sm text-center">
            <Link href="/login" className="text-primary hover:underline cursor-pointer">
              Já tenho conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}