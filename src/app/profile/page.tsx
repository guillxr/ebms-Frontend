'use client'

import React, { useEffect, useState } from 'react'
import { getDonorById, updateDonor, deleteDonor, Donor } from '@/services/donorService'
import { jwtDecode } from 'jwt-decode'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface TokenPayload {
  id: string
}

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

const reverseBloodTypeMap = Object.fromEntries(
  Object.entries(bloodTypeMap).map(([k, v]) => [v, k])
)

export default function ProfilePage() {
  const router = useRouter()
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    blood_type: '',
    phone: '',
    address: '',
    birth_date: '',
  })

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1]

        if (!token) {
          toast.error('Token de autenticação não encontrado')
          return
        }

        const decoded = jwtDecode<TokenPayload>(token)
        const data = await getDonorById(decoded.id)

        setDonor(data)
        setForm({
          name: data.name,
          blood_type: reverseBloodTypeMap[data.blood_type] || '',
          phone: data.phone,
          address: data.address,
          birth_date: data.birth_date.slice(0, 10),
        })
      } catch (err) {
        console.error(err)
        toast.error('Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchDonor()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donor) return
    setSaving(true)

    const payload = {
      name: form.name,
      blood_type: bloodTypeMap[form.blood_type as keyof typeof bloodTypeMap],
      phone: form.phone,
      address: form.address,
      birth_date: new Date(form.birth_date).toISOString(),
    }

    try {
      await updateDonor(donor.id, payload)
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar perfil.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!donor) return
    setDeleting(true)
    try {
      await deleteDonor(donor.id)
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      
      toast.success('Conta excluída com sucesso!')
      router.push('/register')
    } catch {
      toast.error('Erro ao excluir conta.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando perfil...</p>
  if (!donor) return <p className="text-center mt-10 text-red-500">Erro ao carregar dados.</p>

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    {/* Botão fixo no canto superior esquerdo */}
    <Button
      variant="outline"
      className="fixed top-4 left-4 z-50"
      onClick={() => router.push('/dashboard/user')}
    >
      ← Voltar para Dashboard
    </Button>

    <h1 className="text-4xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo Sanguíneo:</label>
          <select
            name="blood_type"
            value={form.blood_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione</option>
            {Object.keys(bloodTypeMap).map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
          <Input name="phone" value={form.phone} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
          <Input name="address" value={form.address} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Data de Nascimento:</label>
          <Input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>

        {/* Botão e modal de exclusão */}
        <div className="mt-6 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Excluir Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tem certeza que deseja excluir sua conta?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600">
                Esta ação é irreversível. Todos os dados serão perdidos.
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="ghost">Cancelar</Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  )
}