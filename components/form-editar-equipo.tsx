'use client'

import editarEquipo from "@/actions/editarEquipo";
import { EquipoAdaptado } from "@/respositorios/equipo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTablaEquipos } from "./tabla-equipos";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formEditarEquipoSchema = z.object({
    idCliente: z.number().int().positive(),
    idTipoDeEquipo: z.number().int().positive(),
    nroSerie: z.string().min(1),
    idMarca: z.number().int().positive(),
    idModelo: z.number().int().positive(),
    razonDeIngreso: z.string().min(1),
    observaciones: z.string(),
    enciende: z.boolean(),
})

interface FormEditarEquipoProps {
    equipo: EquipoAdaptado
}

export default function FormEditarEquipo(props: FormEditarEquipoProps) {
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(formEditarEquipoSchema),
        defaultValues: {
            idCliente: props.equipo.idCliente,
            idTipoDeEquipo: props.equipo.idTipoDeEquipo,
            nroSerie: props.equipo.nroSerie,
            idMarca: props.equipo.idMarca,
            idModelo: props.equipo.idModelo,
            razonDeIngreso: props.equipo.razonDeIngreso,
            observaciones: props.equipo.observaciones,
            enciende: props.equipo.enciende
        },
    });

    const tablaEquipos = useTablaEquipos()

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(async (values) => {
            setSubmitting(true)

            try {
                await editarEquipo(props.equipo.id, {
                    idCliente: values.idCliente,
                    nroSerie: values.nroSerie,
                    idMarca: values.idMarca,
                    idModelo: values.idModelo,
                    razonDeIngreso: values.razonDeIngreso,
                    observaciones: values.observaciones,
                    deleted: props.equipo.deleted,
                    idTipoDeEquipo: values.idTipoDeEquipo,
                    enciende: values.enciende
                })

                toast.success(`Equipo ${props.equipo.id} editado correctamente.`);

                tablaEquipos.actualizarEquipo({
                    id: props.equipo.id,
                    nombreCliente: tablaEquipos.clientes.find(cliente => cliente.id === values.idCliente)?.firstName + ' ' + tablaEquipos.clientes.find(cliente => cliente.id === values.idCliente)?.lastName || '',
                    nombreTipoDeEquipo: tablaEquipos.tiposDeEquipo.find(tipo => tipo.id === values.idTipoDeEquipo)?.descripcion || '',
                    nroSerie: values.nroSerie,
                    nombreMarca: tablaEquipos.marcas.find(marca => marca.id === values.idMarca)?.descripcion || '',
                    nombreModelo: tablaEquipos.modelos.find(modelo => modelo.id === values.idModelo)?.descripcion || '',
                    razonDeIngreso: values.razonDeIngreso,
                    observaciones: values.observaciones,
                    enciende: values.enciende,
                    deleted: props.equipo.deleted,
                    idCliente: values.idCliente,
                    idTipoDeEquipo: values.idTipoDeEquipo,
                    idMarca: values.idMarca,
                    idModelo: values.idModelo
                })
            } catch(error) {
                if(error instanceof Error) {
                    toast.error(`Error al editar el equipo: ${error.message}`);
                }
            } finally {
                setSubmitting(false);
            }
        })} className="space-y-6">
            <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cliente</FormLabel>
                            <Select onValueChange={(newValue) => {
                                field.onChange(Number(newValue));
                            }} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Elige el cliente..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        tablaEquipos.clientes.map(
                                            cliente => <SelectItem key={cliente.id} value={String(cliente.id)}>
                                                {cliente.firstName} {cliente.lastName} ({cliente.dni})
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="idTipoDeEquipo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de equipo</FormLabel>
                            <Select onValueChange={(newValue) => {
                                field.onChange(Number(newValue));
                            }} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Elige el tipo de equipo..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        tablaEquipos.tiposDeEquipo.map(
                                            tipoDeEquipo => <SelectItem key={tipoDeEquipo.id} value={String(tipoDeEquipo.id)}>
                                                {tipoDeEquipo.descripcion}
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="nroSerie"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Numero de serie</FormLabel>
                        <FormControl>
                            <Input placeholder="Numero de serie..." {...field} />
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="idMarca"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marca</FormLabel>
                            <Select onValueChange={(newValue) => {
                                field.onChange(Number(newValue));
                            }} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Elige la marca..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        tablaEquipos.marcas.map(
                                            marca => <SelectItem key={marca.id} value={String(marca.id)}>
                                                {marca.descripcion}
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="idModelo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Modelo</FormLabel>
                            <Select onValueChange={(newValue) => {
                                field.onChange(Number(newValue));
                            }} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Elige el modelo..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        tablaEquipos.modelos.map(
                                            modelo => <SelectItem key={modelo.id} value={String(modelo.id)}>
                                                {modelo.descripcion}
                                            </SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="razonDeIngreso"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Razon de ingreso</FormLabel>
                        <FormControl>
                            <Input placeholder="Razon de ingreso..." {...field} />
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                            <Input placeholder="Observaciones..." {...field} />
                            </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="enciende"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                }}
                            />
                        </FormControl>
                        <FormLabel>Enciende</FormLabel>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button disabled={submitting} type="submit" className="w-full">
                {
                    submitting 
                    ? 'Guardando...'
                    : 'Guardar cambios'
                }
            </Button>
        </form>
    </Form>
}