'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VistaAdministrarClientePorDNI() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('') // <-- Nuevo
  const [dni, setDni] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    numero: '',
  })

  const pathname = usePathname()
  const routerDni = pathname.split('/').pop()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && routerDni) {
      setDni(routerDni as string)
    }
  }, [routerDni, isMounted])

  useEffect(() => {
    const fetchClientData = async () => {
      if (dni) {
        try {
          const response = await fetch(`/api/clientes/${dni}`)
          const data = await response.json()
          if (data.error) {
            console.error('Cliente no encontrado:', data.error)
            return
          }
          setFormData({
            nombre: data.firstName,
            apellido: data.lastName,
            dni: data.dni,
            email: data.email,
            numero: data.phoneNumber,
          })
        } catch (error) {
          console.error('Error fetching client data:', error)
        }
      }
    }
    fetchClientData()
  }, [dni])

  if (!isMounted) return null
  if (!dni) return <div>Cargando...</div>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email || !formData.numero) {
      setSuccessMessage('Faltan campos por completar.')
      return
    }

    try {
      const response = await fetch(`/api/clientes/${dni}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.nombre,
          lastName: formData.apellido,
          dni: formData.dni,
          email: formData.email,
          phoneNumber: formData.numero,
        }),
      })

      const data = await response.json()
      const msg = data.message?.toLowerCase?.() || ''

      if (!response.ok) {
        let customMessage = 'Error al actualizar cliente.'
        if (msg.includes('faltan campos')) {
          customMessage = 'Faltan campos por completar.'
        } else if (msg.includes('dni ingresado no es válido')) {
          customMessage = 'El DNI ingresado no es válido.'
        } else if (msg.includes('correo electrónico no es válido')) {
          customMessage = 'El correo electrónico no es válido.'
        } else if (msg.includes('teléfono no es válido')) {
          customMessage = 'El número de teléfono no es válido.'
        } else if (msg.includes('ya existe otro cliente con ese dni')) {
          customMessage = 'Ya existe otro cliente con ese DNI.'
        }
        throw new Error(customMessage)
      }

      setSuccessMessage('Cliente actualizado exitosamente.')
      setTimeout(() => router.back(), 1000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado.'
      setSuccessMessage(message)
    }
  }


  return (
    <section className='relative flex flex-col items-center justify-center h-full'>
      <div className="absolute top-0 left-0">
        <Button
          onClick={() => router.back()}
          className="bg-gradient-to-r from-violet-400 to-violet-800 text-white rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all"
        >
          Volver
        </Button>
      </div>

      <section className='relative flex flex-col items-center justify-center bg-[#202020]/90 rounded-2xl p-8 w-[350px] h-[600px] space-y-4 shadow-2xl mt-16'>
        <div
          style={{ bottom: 'calc(100% - 32px)' }}
          className='absolute left-[calc(100% - 32px)] flex items-center justify-center w-32 h-32 bg-[#202020] rounded-full shadow-2xl'
        >
          <UserPlus className='w-20 h-20 text-white' />
        </div>

        <h1 className='text-white text-bold italic font-mono text-2xl'>
          Editar cliente
        </h1>

        <div className='grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-4 mt-8'>
          <h1 className='text-white text-bold italic font-mono text-x1'>Apellido</h1>
          <Input
            name='apellido'
            type='text'
            placeholder='Ingrese apellido'
            value={formData.apellido}
            onChange={handleChange}
            required
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>Nombre</h1>
          <Input
            name='nombre'
            type='text'
            placeholder='Ingrese nombre'
            value={formData.nombre}
            onChange={handleChange}
            required
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>DNI</h1>
          <Input
            name='dni'
            type='text'
            placeholder='Ingrese DNI'
            value={formData.dni}
            onChange={handleChange}
            required
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>Teléfono</h1>
          <Input
            name='numero'
            type='text'
            placeholder='Ingrese teléfono'
            value={formData.numero}
            onChange={handleChange}
            required
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>Correo</h1>
          <Input
            name='email'
            type='email'
            placeholder='Ingrese correo'
            value={formData.email}
            onChange={handleChange}
            required
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />
        </div>

        {/* Mostrar mensaje de éxito o error */}
        {successMessage && (
          <div
            className={`text-center mt-2 ${successMessage.includes('correctamente') || successMessage.includes('exitosamente')
                ? 'text-green-500'
                : 'text-red-500'
              }`}
          >
            {successMessage}
          </div>
        )}

        <div className='flex flex-col justify-start items-center'>
          <Button
            onClick={handleSubmit}
            className='vibrate bg-gradient-to-r from-violet-400 to-violet-800 text-white px-15 py-2 rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all mt-5'
          >
            Editar Cliente
          </Button>
        </div>
      </section>
    </section>
  )
}
