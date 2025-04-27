import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus } from 'lucide-react'



export default function FormCliente() {



    return (

        //Fondo de pantalla
        <section className='bg-gradient-to-b from-gray-800 to-gray-600 min-h-screen flex items-center justify-center'>
            {/*Icono agregar cliente*/}
            <div className="flex flex-col items-center justify-center w-32 h-32 bg-[#202020]/80 rounded-full absolute top-35 shadow-2xl">
                <UserPlus className="w-20 h-20 text-white" />
            </div>


            {/**Panel donde va info de agregar cliente */}
            <section className='flex flex-col items-center justify-center bg-[#202020]/80 rounded-2xl p-8 w-[350px] h-[500px] space-y-4 shadow-2xl'>
                <h1 className='text-white text-bold italic font-mono text-2xl'>
                    Agregar cliente
                </h1>

                {/**Grid datos personales del cliente */}
                <div className='grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-4 mt-8'>
                    <h1 className='text-white text-bold italic font-mono text-x1'>
                        Apellido
                    </h1>
                    <Input
                        type='text'
                        placeholder='Ingrese apellido'
                        required
                        className='text-white w-40 flex-1 ocus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />

                    <h1 className='text-white text-bold italic font-mono text-x1'>
                        Nombre
                    </h1>
                    <Input
                        type='text'
                        placeholder='Ingrese nombre'
                        required
                        className='text-white w-40 flex-1 ocus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />

                    <h1 className='text-white text-bold italic font-mono text-x1'>DNI</h1>
                    <Input
                        type='text'
                        placeholder='Ingrese DNI'
                        required
                        className='text-white w-40 flex-1 ocus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />

                    <h1 className='text-white text-bold italic font-mono text-x1'>
                        Teléfono
                    </h1>
                    <Input
                        type='text'
                        placeholder='Ingrese teléfono'
                        required
                        className='text-white w-40 flex-1 ocus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />

                    <h1 className='text-white text-bold italic font-mono text-x1'>
                        Correo
                    </h1>
                    <Input
                        type='email'
                        placeholder='Ingrese correo'
                        required
                        className='text-white w-40 flex-1 ocus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all'
                    />
                </div>
                
                {/**Boton para agregar cliente */}
                <div className='flex flex-col justify-start items-center'></div>
                <Button className='vibrate bg-gradient-to-r from-violet-400 to-violet-800 text-white px-10 py-2 rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all'>
                    Agregar
                </Button>


            </section>
        </section>
    )
}
