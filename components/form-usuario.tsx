'use client'

import getUserFormSchema from "@/utils/get-user-form-schema";
import translate from '@/utils/translate';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FormUsuarioProps {
    onSubmit: (values: z.infer<ReturnType<typeof getUserFormSchema>>, reset: () => void) => void
    defaultValues: DefaultValues<z.infer<ReturnType<typeof getUserFormSchema>>>
    isPasswordOptional?: boolean
}

export default function FormUsuario({isPasswordOptional = false, ...props}: FormUsuarioProps) {
    const [isPasswordRequired, setIsPasswordRequired] = useState(!isPasswordOptional)

    const form = useForm<z.infer<ReturnType<typeof getUserFormSchema>>>({
        resolver: zodResolver(getUserFormSchema(!isPasswordRequired)),
        defaultValues: props.defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(async (values) => {
                try {
                    await props.onSubmit(values, () => {
                        form.reset()
                    })
                } catch(error) {
                    const info = error as { message: string; cause: string }

                    const message = translate(info.message, info.cause)
                    
                    toast.error(message)
                }
            })} className="space-y-8">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                            <Input placeholder="Nombre del usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="apellido"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                            <Input placeholder="Apellido del usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="Direccion de correo del usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nombreDeUsuario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl>
                            <Input placeholder="Nombre de usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Contraseña del usuario..." {...field} onChange={(event) => {
                                    const length = event.target.value.length 

                                    if(length > 0 && !isPasswordRequired) setIsPasswordRequired(true)
            
                                    if(length === 0 && isPasswordRequired) setIsPasswordRequired(false)

                                    field.onChange(event)
                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Telefono</FormLabel>
                            <FormControl>
                            <Input placeholder="Numero de telefono del usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="DNI"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>DNI</FormLabel>
                            <FormControl>
                            <Input placeholder="Numero de DNI del usuario..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    props.defaultValues.rol !== 'maestro' 
                    ? <FormField
                        control={form.control}
                        name="rol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rol</FormLabel>
                                <FormControl>
                                <Select {...field} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Rol del usuario..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="administrador">Administrador</SelectItem>
                                        <SelectItem value="tecnico">Tecnico</SelectItem>
                                    </SelectContent>
                                </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    : null
                }
                <Button type="submit">Confirmar</Button>
            </form>
        </Form>
    )
}