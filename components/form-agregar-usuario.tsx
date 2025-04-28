"use client"

import agregarUsuario from "@/app/(autenticado)/usuarios/agregar/actions/agregarUsuario"
import getCurrentDateForToast from "@/utils/get-current-date-for-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const userFormSchema = z.object({
  nombre: z.string({ message: 'Debe ingresar un nombre' }).min(4, { message: 'El nombre es demasiado corto' }),
  apellido: z.string({ message: 'Debe ingresar un apellido' }).min(4, { message: 'El apellido es demasiado corto' }),
  email: z.string({ message: 'Debe ingresar una direccion de correo electronico' }).email({ message: 'La direccion de correo no es valida' }),
  nombreDeUsuario: z.string({ message: 'Debe ingresar un nombre de usuario' }).min(4, { message: 'El nombre de usuario es demasiado corto' }),
  password: z.string({ message: 'Debe ingresar una contraseña' }).min(8, { message: 'La contraseña es demasiado corta' }).max(16, { message: 'La contraseña es demasiado larga' }),
  telefono: z
    .string()
    .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 números"),
  DNI: z
    .string()
    .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 números"),
  rol: z.string()
    .refine(val => ['administrador', 'tecnico'].includes(val), {
        message: "El usuario debe ser administrador o tecnico",
    })
})

export function FormAgregarUsuario() {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        nombre: '',
        apellido: '',
        email: '',
        nombreDeUsuario: '',
        password: '',
        telefono: '',
        DNI: '',
        rol: ''
    },
  })

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    await agregarUsuario(values)

    toast("El usuario fue creado exitosamente", {
      description: getCurrentDateForToast(),
      action: {
        label: "Entendido",
        onClick: () => {}
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input type="password" placeholder="Contraseña del usuario..." {...field} />
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
        <FormField
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
        <Button type="submit">Agregar</Button>
      </form>
    </Form>
  )
}
