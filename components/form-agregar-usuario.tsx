"use client"

import agregarUsuario from "@/actions/agregarUsuario"
import getCurrentDateForToast from "@/utils/get-current-date-for-toast"
import getUserFormSchema from "@/utils/get-user-form-schema"
import { toast } from "sonner"
import { z } from "zod"
import FormUsuario from "./form-usuario"

export function FormAgregarUsuario() {
  async function onSubmit(values: z.infer<ReturnType<typeof getUserFormSchema>>) {
    const message = await agregarUsuario(values)

    if(message !== undefined) throw new Error(message.code, { cause: message.param })

    toast("El usuario fue creado exitosamente", {
      description: getCurrentDateForToast(),
      action: {
        label: "Entendido",
        onClick: () => {}
      },
    })
  }

  return <FormUsuario onSubmit={(values, reset) => {
    onSubmit(values)

    reset()
  }} defaultValues={{
      nombre: '',
      apellido: '',
      email: '',
      nombreDeUsuario: '',
      password: '',
      telefono: '',
      DNI: '',
      rol: ''
  }} />
}
