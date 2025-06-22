import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import { useState } from "react"



export default function FormularioCliente() {
    const [successMessage, setSuccessMessage] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        phoneNumber: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  const handleSubmit = async () => {
	try {
		const newClient = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			dni: formData.dni,
			email: formData.email,
			phoneNumber: formData.phoneNumber,
			deleted: false,
		}

		const response = await fetch('/api/clientes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newClient),
		})

		const data = await response.json()
		console.log('Mensaje recibido del backend:', data.message)

		if (!response.ok) {
			const msg = data.message?.toLowerCase?.() || ''
			let customMessage = 'Error al agregar cliente.'

			if (msg.includes('faltan campos')) {
				customMessage = 'Faltan campos por completar.'
			} else if (msg.includes('dni ingresado no es válido')) {
				customMessage = 'El DNI ingresado no es válido.'
			} else if (msg.includes('correo electrónico no es válido')) {
				customMessage = 'El correo electrónico no es válido.'
			} else if (msg.includes('teléfono no es válido')) {
				customMessage = 'El número de teléfono no es válido.'
			} else if (msg.includes('ya está registrado')) {
				customMessage = 'Este cliente ya está registrado en el sistema.'
			}

			throw new Error(customMessage)
		}

		setSuccessMessage('Cliente agregado exitosamente.')
		setFormData({
			firstName: '',
			lastName: '',
			dni: '',
			email: '',
			phoneNumber: '',
		})
		setTimeout(() => setSuccessMessage(''), 3000)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error inesperado.'
		setSuccessMessage(message)
		setTimeout(() => setSuccessMessage(''), 3000)
	}
}


    return (
        <section className="relative flex flex-col items-center justify-center h-full">


            {/* ICONO */}

            {/* FORMULARIO */}
            <section className='relative flex flex-col items-center justify-center bg-[#202020]/90 rounded-2xl p-8 w-[350px] h-[500px] space-y-4 shadow-2xl mt-16'>
                <div
                    style={{ bottom: 'calc(100% - 32px)' }}
                    className="absolute left-[calc(100% - 32px)] flex items-center justify-center w-32 h-32 bg-[#202020] rounded-full shadow-2xl"
                >
                    <UserPlus className="w-20 h-20 text-white" />
                </div>

                <h1 className='text-white text-bold italic font-mono text-2xl'>
                    Agregar cliente
                </h1>

                <div className='grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-4 mt-8'>
                    <h1 className='text-white text-bold italic font-mono text-x1'>Apellido</h1>
                    <Input
                        name='lastName'
                        type='text'
                        placeholder='Ingrese apellido'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className='text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />

                    <h1 className='text-white text-bold italic font-mono text-x1'>Nombre</h1>
                    <Input
                        name='firstName'
                        type='text'
                        placeholder='Ingrese nombre'
                        value={formData.firstName}
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
                        name='phoneNumber'
                        type='text'
                        placeholder='Ingrese teléfono'
                        value={formData.phoneNumber}
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

                {/* Mostrar mensaje de éxito */}
                {successMessage && (
                    <p
                        className={`mt-2 ${successMessage.includes('exitosamente')
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}
                    >
                        {successMessage}
                    </p>
                )}

                <div className='flex flex-col justify-start items-center space-y-4 mt-5'>
                    <Button
                        onClick={handleSubmit}
                        className='vibrate bg-gradient-to-r from-violet-400 to-violet-800 text-white px-15 py-2 rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all'
                    >
                        Agregar
                    </Button>
                </div>
            </section>
        </section>
    )
}