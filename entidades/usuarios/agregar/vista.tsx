import { FormAgregarUsuario } from "@/components/form-agregar-usuario"
import { Separator } from "@/components/ui/separator"

export default function VistaAgregarUsuario() {
    return <section className="flex justify-center">
        <div className="w-full max-w-[400px] border rounded">
            <div className="space-y-1 p-4 pb-0">
                <h1 className="text-sm font-medium leading-none">Agregar usuario</h1>
                <p className="text-sm text-muted-foreground">
                    Ingrese los siguientes datos
                </p>
            </div>
            <Separator className="my-4" />
            <div className='p-4 pt-0'>
                <FormAgregarUsuario/>
            </div>
        </div>
    </section>
}