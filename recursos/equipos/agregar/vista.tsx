'use client'


interface Cliente {
    id: number
    firstName: string
    lastName: string
    dni: string
    email: string
    phoneNumber: string
    deleted: boolean
}


import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Laptop2, User } from 'lucide-react'
import { useEffect, useState } from 'react'




export default function vistaAgregarEquipo() {

    const [clientes, setClientes] = useState<Cliente[]>([])

    useEffect(() => {
        async function cargarClientes() {
            try {
                const res = await fetch('/api/clientes')
                const data = await res.json()
                const clientesActivos = data.filter((cliente: any) => cliente.deleted === false)
                setClientes(clientesActivos)
            } catch (error) {
                console.error('Error al cargar clientes', error)
            }
        }

        cargarClientes()
    }, [])



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white font-mono">
            <div className="flex w-[90%] max-w-7xl bg-[#1e293b] rounded-2xl shadow-2xl p-6 mt-10 space-x-6">

                {/* Sección izquierda: Asociar cliente */}
                <div className="w-1/2 flex flex-col space-y-4 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <User className="w-8 h-8" />
                        <h2 className="text-xl font-bold">1. Asociar cliente</h2>
                    </div>

                    <select className="bg-[#334155] text-white px-4 py-2 rounded focus:outline-none">
                        <option value="" disabled hidden>
                            Seleccione un cliente
                        </option>
                        {clientes
                            .filter((c) => c.id !== undefined)
                            .map((cliente) => (
                                <option key={cliente.id} value={cliente.id.toString()}>
                                    {cliente.dni} - {cliente.firstName} {cliente.lastName}
                                </option>
                            ))}
                    </select>

                    <Button className="bg-violet-700 hover:bg-violet-800 transition-all text-white">
                        Agregar cliente
                    </Button>
                </div>

                {/* Sección derecha: Agregar equipo */}
                <div className="w-1/2 flex flex-col space-y-4 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Laptop2 className="w-8 h-8" />
                        <h2 className="text-xl font-bold">2. Agregar equipo</h2>
                    </div>

                    <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-3">
                        <label>Tipo de equipo</label>
                        <select className="bg-[#334155] text-white px-4 py-2 rounded">
                            <option>Impresora con inyección de tinta</option>
                            <option>Impresora Láser</option>
                            <option>Computadora</option>
                            <option>Fotocopiadora</option>
                        </select>

                        <label>N° de serie</label>
                        <Input className="bg-[#334155] text-white" placeholder="Ej: 12345ABC" />

                        <label>Marca</label>
                        <div className="flex space-x-2">
                            <Input className="bg-[#334155] text-white" placeholder="Ej: HP, Epson" />
                            <Button className="bg-violet-600 hover:bg-violet-800">+</Button>
                        </div>

                        <label>Modelo</label>
                        <div className="flex space-x-2">
                            <Input className="bg-[#334155] text-white" placeholder="Ej: 2015" />
                            <Button className="bg-violet-600 hover:bg-violet-800">+</Button>
                        </div>

                        <label>Razón de ingreso</label>
                        <textarea className="bg-[#334155] text-white rounded p-2 col-span-1" rows={2}></textarea>

                        <label>Observaciones</label>
                        <textarea className="bg-[#334155] text-white rounded p-2 col-span-1" rows={2}></textarea>
                    </div>

                    <div className="flex items-center mt-2 space-x-2">
                        <input type="checkbox" />
                        <label>Marcar si el equipo enciende a la hora de ingresar</label>
                    </div>

                    <Button className="bg-gradient-to-r from-violet-500 to-violet-800 hover:from-violet-600 hover:to-violet-900 transition-all mt-4 text-white">
                        Agregar equipo
                    </Button>
                </div>
            </div>
        </div>
    )
}

