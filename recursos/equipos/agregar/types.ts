// Se definen interfaces que voy a utilizar en mi archivo hooks

export interface Cliente {
    id: number
    firstName: string
    lastName: string
    dni: string
    email: string
    phoneNumber: string
    deleted: boolean
}

export interface Modelo {
    id: number
    descripcion: string
}

export interface Marca {
    id: number
    descripcion: string
}

export interface TipoDeEquipo {
    id: number
    descripcion: string
}