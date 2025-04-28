import { FormAgregarUsuario } from "@/components/form-agregar-usuario"
import { Separator } from "@/components/ui/separator"

export default function AgregarUsuarioPage() {
    return <section>
        <div className="space-y-1">
            <h1 className="text-sm font-medium leading-none">Agregar usuario</h1>
            <p className="text-sm text-muted-foreground">
                Ingrese los siguientes datos
            </p>
        </div>
        <Separator className="my-4" />
        <div className='max-w-2xl'>
            <FormAgregarUsuario/>
        </div>
    </section>
}