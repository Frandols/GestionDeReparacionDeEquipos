'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus } from 'lucide-react'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditarCliente() {
  const [isMounted, setIsMounted] = useState(false)
  const [dni, setDni] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    numero: '',
  })

  const pathname = usePathname()

  // '/editarCliente/44293877'
  // '/editarCliente/44293877'.split('/') => ['', 'editarCliente', '44293877'].pop() => 

  const routerDni = pathname.split('/').pop()

  // Establecemos que el componente ha sido montado
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Solo después de que el componente haya sido montado, podemos acceder al router.query
  useEffect(() => {
    if (isMounted && routerDni) {
      setDni(routerDni as string)
    }
  }, [routerDni, isMounted])

  // Traer los datos del cliente si tenemos el DNI
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

          // Seteamos los datos obtenidos del cliente en el formulario
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

  if (!isMounted) return null // O muestra un loader mientras carga
  if (!dni) return <div>Cargando...</div> // Muestra mensaje mientras se obtiene el dni

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className='relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-600 min-h-screen'>
      {/* ICONO */}
      <div
        style={{ top: '10rem' }}
        className='absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-32 h-32 bg-[#202020]/80 rounded-full shadow-2xl'
      >
        <UserPlus className='w-20 h-20 text-white' />
      </div>

      <section className='flex flex-col items-center justify-center bg-[#202020]/80 rounded-2xl p-8 w-[350px] h-[500px] space-y-4 shadow-2xl mt-16'>
        <h1 className='text-white text-bold italic font-mono text-2xl'>
          Editar cliente
        </h1>

        <div className='grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-4 mt-8'>
          <h1 className='text-white text-bold italic font-mono text-x1'>
            Apellido
          </h1>
          <Input
            name='apellido'
            type='text'
            placeholder='Ingrese apellido'
            value={formData.apellido}
            onChange={handleChange}
            required
            
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>
            Nombre
          </h1>
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

          <h1 className='text-white text-bold italic font-mono text-x1'>
            Teléfono
          </h1>
          <Input
            name='numero'
            type='text'
            placeholder='Ingrese teléfono'
            value={formData.numero}
            onChange={handleChange}
            required
            
            className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
          />

          <h1 className='text-white text-bold italic font-mono text-x1'>
            Correo
          </h1>
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

        <div className='flex flex-col justify-start items-center'>
          {/* Botón de visualización */}
          <Button
            className='vibrate bg-gradient-to-r from-violet-400 to-violet-800 text-white px-15 py-2 rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all mt-5'
            
          >
            Editar Cliente
          </Button>
        </div>
      </section>
    </section>
  )
}
