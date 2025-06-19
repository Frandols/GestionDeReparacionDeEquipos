
//-- Se importan dependencias, como hooks y componentes--
import { useState, useEffect } from 'react'
import { Cliente, Modelo, Marca, TipoDeEquipo } from './types'

export function useAgregarEquipo() {


    // Se declaran variables

    ///Variables que utilizo para: el input a la hora de agregar un nuevo tipo de equipo, para abrir y cerrar el modal, y para el array que utilizo a la hora de mostrar los equipos
    const [nuevoTipo, setNuevoTipo] = useState('')
    const [modalTDEAbierto, setModalTDEAbierto] = useState(false);
    const [tipoDeEquipo, setTipoDeEQuipo] = useState<TipoDeEquipo[]>([])

    ///Variables que utilizo para: el input a la hora de agregar una marca, para abrir y cerrar el modal, y para el array que utilizo a la hora de mostrar las marcas
    const [nuevaMarca, setNuevaMarca] = useState('')
    const [modalMarcaAbierto, setModalMarcaAbierto] = useState(false);
    const [marcas, setMarcas] = useState<Marca[]>([])

    ///Variables que utilizo para: el input a la hora de agregar un modelo, para abrir y cerrar el modal, y para el array que utilizo a la hora de mostrar los modelos
    const [nuevoModelo, setNuevoModelo] = useState('')
    const [modalModeloAbierto, setModalModeloAbierto] = useState(false);
    const [modelos, setModelos] = useState<Modelo[]>([])

    ///Variables que utilizo para traer el array de clientes y luego poder mostrarlos
    const [clientes, setClientes] = useState<Cliente[]>([])

    /// Objeto que contiene los datos actuales del formulario para luego agregar un equipo
    const [formData, setFormData] = useState({
        idCliente: '',          
        nroSerie: '',
        idMarca: '',
        idModelo: '',
        razonDeIngreso: '',
        observaciones: '',
        enciende: false,        
        idTipoDeEquipo: '',
    })

    /// Para inputs tipo texto o select
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    /// Para checkbox (enciende)
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    //Funcion asincronica que se e ejecuta para agregar un equipo
    const handleSubmit = async () => {
        // Validaciones básicas
        if (
            !formData.idCliente ||
            !formData.idTipoDeEquipo ||
            !(formData.nroSerie || '').trim() ||
            !formData.idMarca ||
            !formData.idModelo ||
            !(formData.razonDeIngreso || '').trim() ||
            !(formData.observaciones || '').trim()
        ) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        try {
            const nuevoEquipo = {
                idCliente: Number(formData.idCliente),
                idTipoDeEquipo: Number(formData.idTipoDeEquipo),
                nroSerie: formData.nroSerie,
                idMarca: Number(formData.idMarca),
                idModelo: Number(formData.idModelo),
                razonDeIngreso: formData.razonDeIngreso,
                observaciones: formData.observaciones,
                enciende: formData.enciende,
            };

            const response = await fetch('/api/equipos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEquipo),
            });

            if (!response.ok) throw new Error('Error al agregar equipo');

            const data = await response.json();
            console.log('Equipo agregado:', data);

            alert('Equipo agregado exitosamente.');

            // Limpiar formulario
            setFormData({
                idCliente: '',
                idTipoDeEquipo: '',
                nroSerie: '',
                idMarca: '',
                idModelo: '',
                razonDeIngreso: '',
                observaciones: '',
                enciende: false,
            });
        } catch (error) {
            console.error(error);
            alert('Error al agregar equipo.');
        }
    };

    // Funcion asincronica que agrega un tipoDeEquipo nuevo
    async function agregarTipoDeEquipo() {
        if (!nuevoTipo.trim()) return;
        try {

            const res = await fetch('/api/tipoDeEquipo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descripcion: nuevoTipo })
            });

            if (res.ok) {
                const nuevo = await res.json()
                ///Actualiza la lista
                setTipoDeEQuipo((prev) => [...prev, nuevo]);
                ///Borra el input
                setNuevoTipo('')
                ///Cierra el modal
                setModalTDEAbierto(false)
            }
            else {
                const error = await res.text();
                console.error('Error en la API:', error);
                alert('Error al agregar el tipo de equipo: ' + error);
            }
        }
        catch (error) {
            console.error('Error al hacer fetch:', error);
        }
    }

    // Funcion asincronica que agrega un modelo nuevo
    async function agregarModelo() {
        if (!nuevoModelo.trim()) return;
        try {

            const res = await fetch('/api/modelos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descripcion: nuevoModelo })
            });

            if (res.ok) {
                const nuevo = await res.json()
                 ///Actualiza la lista
                setModelos((prev) => [...prev, nuevo]);
                ///Borra el input
                setNuevoModelo('')
                ///Cierra el modal
                setModalModeloAbierto(false)
            }
            else {
                const error = await res.text();
                console.error('Error en la API:', error);
                alert('Error al agregar el modelo: ' + error);
            }
        }
        catch (error) {
            console.error('Error al hacer fetch:', error);
        }
    }

    // Funcion asincronica que agrega una marca nueva
    async function agregarMarca() {
        if (!nuevaMarca.trim()) return;
        try {

            const res = await fetch('/api/marcas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descripcion: nuevaMarca })
            });

            if (res.ok) {
                const nuevo = await res.json()
                ///Actualiza la lista
                setMarcas((prev) => [...prev, nuevo]);
                ///Borra el input
                setNuevaMarca('')
                ///Cierra el modal
                setModalMarcaAbierto(false)
            }
            else {
                const error = await res.text();
                console.error('Error en la API:', error);
                alert('Error al agregar el la marca: ' + error);
            }
        }
        catch (error) {
            console.error('Error al hacer fetch:', error);
        }
    }

    useEffect(() => {
        //Funciones que utilizo para traer los clientes, modelos, marcas y tipos de equipos (respectivamente) existentes de mi base de datos y poder mostrarlos 

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

        async function cargarModelos() {
            try {
                const res = await fetch('/api/modelos')
                const data = await res.json()
                setModelos(data)
            }
            catch (error) {
                console.error('Error al cargar el modelo', error)
            }

        }

        async function cargarMarcas() {
            try {
                const res = await fetch('/api/marcas')
                const data = await res.json()
                setMarcas(data)
            }
            catch (error) {
                console.error('Error al cargar la marca', error)
            }
        }

        async function cargarTipoDeEquipo() {
            try {
                const res = await fetch('/api/tipoDeEquipo')
                const data = await res.json()
                setTipoDeEQuipo(data)
            }
            catch (error) {
                console.error('Error al cargar el tipo de equipo', error)
            }
        }

        cargarTipoDeEquipo()
        cargarMarcas()
        cargarClientes()
        cargarModelos()
    }, [])


    return {
        //Retorno todas las variables y metodos para poder llamarlos desde mi vista
        nuevoTipo, setNuevoTipo, modalTDEAbierto, setModalTDEAbierto, tipoDeEquipo,
        nuevaMarca, setNuevaMarca, modalMarcaAbierto, setModalMarcaAbierto, marcas,
        nuevoModelo, setNuevoModelo, modalModeloAbierto, setModalModeloAbierto, modelos,
        clientes, formData, handleChange, handleCheckboxChange, handleSubmit,
        agregarTipoDeEquipo, agregarMarca, agregarModelo
    }

}