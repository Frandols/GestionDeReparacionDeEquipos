
//-- Se importan dependencias, como hooks y componentes--
'use client'
'use modelos'
'use marcas'
'use tipoDeEquipo'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Laptop2, User } from 'lucide-react'
import { useAgregarEquipo } from './hooks'


export default function vistaAgregarEquipo() {

    //-- Se obtienen las variables y las funciones que se utilizaran en la vista
    const {
        nuevoTipo, setNuevoTipo, modalTDEAbierto, setModalTDEAbierto, tipoDeEquipo,
        nuevaMarca, setNuevaMarca, modalMarcaAbierto, setModalMarcaAbierto, marcas,
        nuevoModelo, setNuevoModelo, modalModeloAbierto, setModalModeloAbierto, modelos,
        clientes, formData, handleChange, handleCheckboxChange, handleSubmit,
        agregarTipoDeEquipo, agregarMarca, agregarModelo, successMessage, errorMessage
    } = useAgregarEquipo()


    return (
        // Vista
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white font-mono">
            <div className="flex w-[90%] max-w-8xl bg-[#1e293b] rounded-2xl shadow-2xl p-6 mt-10 space-x-6">

                {/* Sección izquierda: Asociar cliente */}
                <div className="w-1/2 flex flex-col space-y-4 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <User className="w-8 h-8" />
                        <h2 className="text-xl font-bold">1. Asociar cliente</h2>
                    </div>

                    <select className="bg-[#334155] text-white px-4 py-2 rounded focus:outline-none" name="idCliente"
                        value={formData.idCliente}
                        onChange={handleChange}>
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
                        <div className="flex items-center space-x-2">
                            <select name="idTipoDeEquipo"
                                value={formData.idTipoDeEquipo}
                                onChange={handleChange} className="flex-grow bg-[#334155] text-white px-4 py-2 rounded h-10">
                                <option value="" disabled hidden>
                                    Seleccione un tipo de equipo
                                </option>
                                {tipoDeEquipo
                                    .filter((c) => c.id !== undefined)
                                    .map((unTipoDeEquipo) => (
                                        <option key={unTipoDeEquipo.id} value={unTipoDeEquipo.id.toString()}>
                                            {unTipoDeEquipo.descripcion}
                                        </option>
                                    ))}
                            </select>
                            <Button className="bg-violet-600 hover:bg-violet-800 h-10 px-4" onClick={() => setModalTDEAbierto(true)}>+</Button>
                        </div>
                        {modalTDEAbierto && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                                <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar tipo de equipo</h2>
                                    <Input
                                        className="mb-4 text-black"
                                        placeholder="Ingrese tipo de equipo"
                                        value={nuevoTipo}
                                        onChange={(e) => setNuevoTipo(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button onClick={() => setModalTDEAbierto(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={agregarTipoDeEquipo} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ---------------------------------------------------------------------------------------------------------------------    */}

                        <label>N° de serie</label>
                        <Input className="bg-[#334155] text-white" placeholder="Ej: 12345ABC" name="nroSerie"
                            value={formData.nroSerie}
                            onChange={handleChange} />



                        {/* ---------------------------------------------------------------------------------------------------------------------    */}

                        <label>Marca</label>
                        <div className="flex items-center space-x-2">
                            <select className="flex-grow bg-[#334155] text-white px-4 py-2 rounded h-10" name="idMarca"
                                value={formData.idMarca}
                                onChange={handleChange}>
                                <option value="" disabled hidden>
                                    Seleccione una marca
                                </option>
                                {marcas
                                    .filter((c) => c.id !== undefined)
                                    .map((marca) => (
                                        <option key={marca.id} value={marca.id.toString()}>
                                            {marca.descripcion}
                                        </option>
                                    ))}
                            </select>
                            <Button className="bg-violet-600 hover:bg-violet-800 h-10 px-4" onClick={() => setModalMarcaAbierto(true)}>+</Button>
                        </div>
                        {modalMarcaAbierto && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                                <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar marca</h2>
                                    <Input
                                        className="mb-4 text-black"
                                        placeholder="Ingrese marca"
                                        value={nuevaMarca}
                                        onChange={(e) => setNuevaMarca(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button onClick={() => setModalMarcaAbierto(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={agregarMarca} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* ---------------------------------------------------------------------------------------------------------------------    */}

                        <label>Modelo</label>
                        <div className="flex items-center space-x-2">
                            <select className="flex-grow bg-[#334155] text-white px-4 py-2 rounded h-10" name="idModelo"
                                value={formData.idModelo}
                                onChange={handleChange}>
                                <option value="" disabled hidden>
                                    Seleccione un modelo
                                </option>
                                {modelos
                                    .filter((c) => c.id !== undefined)
                                    .map((modelo) => (
                                        <option key={modelo.id} value={modelo.id.toString()}>
                                            {modelo.descripcion}
                                        </option>
                                    ))}
                            </select>
                            <Button className="bg-violet-600 hover:bg-violet-800 h-10 px-4" onClick={() => setModalModeloAbierto(true)}>+</Button>
                        </div>
                        {modalModeloAbierto && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                                <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar modelo</h2>
                                    <Input
                                        className="mb-4 text-black"
                                        placeholder="Ingrese modelo"
                                        value={nuevoModelo}
                                        onChange={(e) => setNuevoModelo(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button onClick={() => setModalModeloAbierto(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={agregarModelo} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ---------------------------------------------------------------------------------------------------------------------    */}

                        <label>Razón de ingreso</label>
                        <textarea name="razonDeIngreso"
                            value={formData.razonDeIngreso}
                            onChange={handleChange} className="bg-[#334155] text-white rounded p-2 col-span-1" rows={2} ></textarea>
                        {/* ---------------------------------------------------------------------------------------------------------------------    */}


                        <label>Observaciones</label>
                        <textarea name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange} className="bg-[#334155] text-white rounded p-2 col-span-1" rows={2}></textarea>
                    </div>
                    {/* ---------------------------------------------------------------------------------------------------------------------    */}


                    <div className="flex items-center mt-2 space-x-2">
                        <input type="checkbox"
                            name="enciende"
                            checked={formData.enciende}
                            onChange={handleCheckboxChange}
                            id="enciende" />
                        <label>Marcar si el equipo enciende a la hora de ingresar</label>
                    </div>
                    {/* ---------------------------------------------------------------------------------------------------------------------    */}

                    <Button className="bg-gradient-to-r from-violet-500 to-violet-800 hover:from-violet-600 hover:to-violet-900 transition-all mt-4 text-white" onClick={handleSubmit}>
                        Agregar equipo
                    </Button>
                    {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
                    {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                </div>
            </div>
        </div>
    )
}

