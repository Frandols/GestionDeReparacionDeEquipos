import agregarEntrega from "@/actions/agregarEntrega";
import agregarPresupuesto from "@/actions/agregarPresupuesto";
import editarPresupuesto from "@/actions/editarPresupuesto";
import editarReparacion from "@/actions/editarReparacion";
import finalizarRevision from "@/actions/finalizarRevision";
import iniciarReparacion from "@/actions/iniciarReparacion";
import iniciarRevision from "@/actions/iniciarRevision";
import { EquipoPayloadRespuesta } from "@/respositorios/equipo";
import formatearFecha from "@/utils/formatear-fecha";
import obtenerPasoInicial from "@/utils/obtener-paso-inicial";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleAlert, DollarSign, HardDriveUpload, Minus, MoveRight, Play, Plus, RefreshCcw, ThumbsDown, ThumbsUp, Trash, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BadgeEstado from "./badge-estado";
import { useTablaEquipos } from "./tabla-equipos";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

interface ProgresoEstadosProps {
    equipo: EquipoPayloadRespuesta
}

interface Paso {
    titulo: string;
    Contenido: (props: { equipo: EquipoPayloadRespuesta }) => React.JSX.Element
}

const pasos: Paso[] = [
    {
        titulo: 'Resumen',
        Contenido: Resumen
    },
    {
        titulo: 'Revision',
        Contenido: Revision
    },
    {
        titulo: 'Presupuesto',
        Contenido: Presupuesto
    },
    {
        titulo: 'Reparacion',
        Contenido: Reparacion
    },
    {
        titulo: 'Entrega',
        Contenido: Entrega
    }
]

export default function ProgresoEstados(props: ProgresoEstadosProps) {
    const [pasoActual, setPasoActual] = useState(() => {
        return obtenerPasoInicial(props.equipo)
    });

    function anterior() {
        if(pasoActual === 0) return
        
        setPasoActual(pasoActual - 1);
    }

    function siguiente() {
        if(pasoActual === pasos.length - 1) return

        setPasoActual(pasoActual + 1);
    }

    const PasoActual = pasos[pasoActual];

    return <>
        <DialogHeader>
            <Description/>
            <DialogTitle className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <div className="overflow-hidden">
                    <p className="flex gap-2 items-baseline flex-wrap">
                        {PasoActual.titulo}
                        <Badge variant="secondary">Equipo #{props.equipo.id}</Badge>
                        <BadgeEstado estado={props.equipo.estado}/>
                    </p>
                </div>
                <div className="space-x-1 w-max">
                    <Button className="rounded-full w-9" variant='outline' onClick={anterior} disabled={pasoActual === 0}>
                        <ArrowLeft/>
                    </Button>
                    <Button className="rounded-full w-9" variant='outline' onClick={siguiente} disabled={pasoActual === pasos.length - 1}>
                        <ArrowRight/>
                    </Button>
                </div>
            </DialogTitle>
        </DialogHeader>
        <PasoActual.Contenido equipo={props.equipo} />
    </>
}

function Description() {
    return <DialogDescription className="flex gap-1 items-center">
        Revision 
        <DescriptionSeparator/> 
        Presupuesto 
        <DescriptionSeparator/> 
        Reparacion 
        <DescriptionSeparator/> 
        Entrega
    </DialogDescription>
}

function DescriptionSeparator() {
    return <MoveRight className="text-muted-foreground" size={12}/>
}

interface PasoProps {
    equipo: EquipoPayloadRespuesta
}

function Resumen(props: PasoProps) {
    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 text-md">
            <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">Ingreso el 20 de Junio de 2025</p>
                <p className="font-semibold inline">Razon: <span className="text-muted-foreground font-normal">{props.equipo.razonDeIngreso}</span></p>
            </div>
            <Separator className="my-1"/>
            <div className="flex flex-col gap-1">
                <p className="font-semibold inline">Observaciones: <span className="text-muted-foreground font-normal">{props.equipo.observaciones}</span></p>
            </div>
        </div>
    </div>
}

const revisionFormSchema = z.object({
    observaciones: z.string().min(1, 'Ingresa una descripcion de la revision')
})

function Revision(props: PasoProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const user = useUser()

    const form = useForm({ resolver: zodResolver(revisionFormSchema), defaultValues: {
        observaciones: ''
    } })

    const disabled = !form.formState.isValid

    const tablaEquipos = useTablaEquipos()

    if(props.equipo.revision === null) {
        if(user.user?.publicMetadata.role !== 'tecnico') return <WarningIndicator>Solo un usuario tecnico puede iniciar la revision de un equipo</WarningIndicator>

        return <div className="border border-dashed rounded-lg grid place-content-center p-4">
            <Button variant='outline' disabled={loading} onClick={async () => {
                setLoading(true)

                try {
                    await iniciarRevision(props.equipo.id)

                    toast.success(`Revision iniciada correctamente.`);

                    tablaEquipos.actualizarEquipo({
                        ...props.equipo,
                        revision: {
                            fechaDeFinalizacion: null,
                            observaciones: null
                        },
                        estado: 'En revisión'
                    })
                } catch(error) {
                    if(error instanceof Error) {
                        toast.error(`Error al iniciar la revision: ${error.message}`);
                    }
                } finally {
                    setLoading(false);
                }
            }}>{
                loading
                ? 'Iniciando revision...'
                : <>Inciar revision <Play/></>
            }</Button>
        </div>
    }

    if(props.equipo.revision?.fechaDeFinalizacion === null) {
        if(user.user?.publicMetadata.role !== 'tecnico') return <WarningIndicator>Solo un usuario tecnico puede finalizar la revision de un equipo</WarningIndicator>

        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(async (values) => {
                        setLoading(true)

                        try {
                            await finalizarRevision(props.equipo.id, values.observaciones)

                            toast.success(`Revision finalizada correctamente.`);

                            tablaEquipos.actualizarEquipo({
                                ...props.equipo,
                                revision: {
                                    fechaDeFinalizacion: new Date(),
                                    observaciones: values.observaciones
                                },
                                estado: 'Pendiente de presupuesto'
                            })
                        } catch(error) {
                            if(error instanceof Error) {
                                toast.error(`Error al finalizar la revision: ${error.message}`);
                            }
                        } finally {
                            setLoading(false);
                        }
                    })}>
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Se observo durante la revision:</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Observaciones de la revision..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-start pt-6">
                            <Button type="submit" variant='outline' disabled={disabled || loading}>
                                {
                                    loading
                                    ? 'Confirmado revision...'
                                    : <>Confirmar revision <HardDriveUpload/></>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    }

    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 text-md">
            <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">Revisado el {formatearFecha(props.equipo.revision.fechaDeFinalizacion)}</p>
                <p className="font-semibold inline">Se observo durante la revision: <span className="text-muted-foreground font-normal">{props.equipo.revision.observaciones}</span></p>
            </div>
        </div>
    </div>
}

const itemPresupuestoFormSchema = z.object({
    descripcion: z.string().min(1),
    monto: z.number().int().positive().min(1)
})

const presupuestoFormSchema = z.object({
    detalle: z.string().min(1),
    monto: z.number().int().positive().min(1)
})

function Presupuesto(props: PasoProps) {
    const formItem = useForm({ resolver: zodResolver(itemPresupuestoFormSchema), defaultValues: {
        descripcion: '',
        monto: 0
    } })

    const formPresupuesto = useForm({ resolver: zodResolver(presupuestoFormSchema), defaultValues: {
        detalle: '',
        monto: 0
    } })

    const [loading, setLoading] = useState<boolean>(false)
    const [items, setItems] = useState<z.infer<typeof itemPresupuestoFormSchema>[]>([])

    const onChangeItems = (nuevosItems: typeof items) => {
        setItems(nuevosItems)

        const monto = nuevosItems.reduce((suma, item) => suma + item.monto, 0)
        const detalle = nuevosItems.map((nuevoItem, indice) => {
            const cantidad = items.filter(otroItem => otroItem.descripcion === nuevoItem.descripcion && otroItem.monto === nuevoItem.monto).length + 1
        
            if(items.some((otroItem, otroIndice) => (otroItem.descripcion === nuevoItem.descripcion && otroItem.monto === nuevoItem.monto) && otroIndice < indice)) return null

            return `x${cantidad} ${nuevoItem.descripcion} - $ARS${nuevoItem.monto * cantidad}`
        }).filter(item => item !== null).join('\n\n')

        formPresupuesto.setValue('detalle', detalle)
        formPresupuesto.setValue('monto', monto)
    }

    const user = useUser()
    const tablaEquipos = useTablaEquipos()

    if(props.equipo.revision === null || props.equipo.revision.fechaDeFinalizacion === null) return <WarningIndicator>El equipo debe estar revisado para poder asignarle un presupuesto</WarningIndicator>

    if(props.equipo.presupuesto === null) {
        if(user.user?.publicMetadata.role !== 'administrador') return <WarningIndicator>Solo un usuario administrador puede asignar un presupuesto al equipo</WarningIndicator>

        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
            <Form {...formItem}>
                    <form onSubmit={formItem.handleSubmit(async (values) => {
                            const nuevosItems = [...items, values]

                            onChangeItems(nuevosItems)

                            formItem.reset()
                        })}>
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">Agrega los items del presupuesto:</p>
                            <div className="grid grid-cols-[50%_auto_min-content] gap-2 items-center">
                                <FormField
                                    control={formItem.control}
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Describe el item..." {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    $ <FormField
                                        control={formItem.control}
                                        name="monto"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="number" placeholder="Monto..." {...field} onChange={(event) => {
                                                        const value = event.currentTarget.value

                                                        field.onChange(Number(value))
                                                    }} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button>
                                    Agregar <Plus/>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {
                                    items.map(
                                        (item, indice) => {
                                            const cantidad = items.filter(otroItem => otroItem.descripcion === item.descripcion && otroItem.monto === item.monto).length

                                            if(items.some((otroItem, otroIndice) => (otroItem.descripcion === item.descripcion && otroItem.monto === item.monto) && otroIndice < indice)) return null

                                            return (
                                                <div key={`${item.descripcion}-${item.monto}`} className="grid grid-cols-[36px_auto_min-content] gap-2 border rounded-lg p-2 items-center shadow-xs">
                                                    <div className="flex items-center justify-center bg-accent h-full rounded-sm border">
                                                        <X size={12}/>
                                                        <p>{cantidad}</p>
                                                    </div>
                                                    <p>{item.descripcion} - ${item.monto * cantidad}</p>
                                                    <div className="flex gap-1">
                                                        <Button onClick={() => {
                                                            const nuevosItems = [...items, item]

                                                            onChangeItems(nuevosItems)
                                                        }} type="button" variant="outline">
                                                            <Plus/>
                                                        </Button>
                                                        <Button disabled={cantidad === 1} onClick={() => {
                                                            const indiceAEliminar = items.findLastIndex(otroItem => otroItem.descripcion === item.descripcion && otroItem.monto === item.monto)

                                                            const nuevosItems = items.filter((_, otroIndice) => otroIndice !== indiceAEliminar)
                                                        
                                                            onChangeItems(nuevosItems)
                                                        }} type="button" variant="outline">
                                                            <Minus/>
                                                        </Button>
                                                        <Button onClick={() => {
                                                            const nuevosItems = items.filter(otroItem => otroItem.descripcion !== item.descripcion || otroItem.monto !== item.monto)

                                                            onChangeItems(nuevosItems)
                                                        }} type="button" variant="destructive">
                                                            <Trash/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                                }
                            </div>
                        </div>
                    </form>
                    <p className="font-medium text-lg">Total: ARS${items.reduce((suma, item) => suma + item.monto, 0)}</p>
                </Form>
                <div className="flex justify-start pt-4">
                    <Button disabled={items.length === 0 || loading} onClick={async () => {
                        const valores = formPresupuesto.getValues()

                        const { success, data } = presupuestoFormSchema.safeParse(valores)

                        if(!success) return

                        setLoading(true)

                        try {
                            const id = await agregarPresupuesto({
                                idRevision: props.equipo.id,
                                detalles: data.detalle,
                                monto: data.monto
                            })

                            toast.success(`Presupuesto agregado correctamente.`);

                            tablaEquipos.actualizarEquipo({
                                ...props.equipo,
                                presupuesto: {
                                    id,
                                    detalle: data.detalle,
                                    aprobado: null,
                                    monto: data.monto
                                },
                                estado: 'Pendiente de aprobacion de presupuesto'
                            })
                        } catch(error) {
                            if(error instanceof Error) {
                                toast.error(`Error al agregar el presupuesto: ${error.message}`);
                            }
                        } finally {
                            setLoading(false);
                        }
                    }} variant='outline'>
                        {
                            loading
                            ? 'Confirmado presupuesto...'
                            : <>Confirmar presupuesto <HardDriveUpload/></>
                        }
                    </Button>
                </div>
            </div>
        </div>
    }

    if(props.equipo.presupuesto.aprobado === null) {
        if(user.user?.publicMetadata.role !== 'administrador') return <WarningIndicator>Solo un usuario administrador puede aprobar o desaprobar un presupuesto</WarningIndicator>
        
        const presupuestoSinAprobar = props.equipo.presupuesto

        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
                <div className="flex flex-col">
                    <p className="text-muted-foreground text-sm">Datos del presupuesto propuesto</p>
                    <p className="font-semibold inline">Monto: <span className="text-green-500 font-normal">$ARS: {props.equipo.presupuesto.monto}</span></p>
                </div>
                <Separator className="my-1"/>
                <div className="flex flex-col gap-1">
                    <p className="font-semibold inline">Detalles: <span className="text-muted-foreground font-normal">{props.equipo.presupuesto.detalle}</span></p>
                </div>
            </div>
            <div className="flex justify-start pt-6 gap-2">
                <Button disabled={loading} variant='outline' onClick={async () => {
                    setLoading(true)

                    try {
                        await editarPresupuesto(
                            presupuestoSinAprobar.id,
                            {
                                idRevision: props.equipo.id,
                                detalles: presupuestoSinAprobar.detalle,
                                monto: presupuestoSinAprobar.monto
                            },
                            true
                        )

                        toast.success(`Presupuesto aprobado correctamente.`);

                        tablaEquipos.actualizarEquipo({
                            ...props.equipo,
                            presupuesto: {
                                ...presupuestoSinAprobar,
                                aprobado: true
                            },
                            estado: 'Pendiente de reparación'
                        })
                    } catch(error) {
                        if(error instanceof Error) {
                            toast.error(`Error al aprobar el presupuesto: ${error.message}`);
                        }
                    } finally {
                        setLoading(false);
                    }
                }}>
                    Aprobar <ThumbsUp/>
                </Button>
                <Button disabled={loading} variant='outline' onClick={async () => {
                    setLoading(true)

                    try {
                        await editarPresupuesto(
                            presupuestoSinAprobar.id,
                            {
                                idRevision: props.equipo.id,
                                detalles: presupuestoSinAprobar.detalle,
                                monto: presupuestoSinAprobar.monto
                            },
                            false
                        )

                        toast.success(`Presupuesto desaprobado correctamente.`);

                        tablaEquipos.actualizarEquipo({
                            ...props.equipo,
                            presupuesto: {
                                ...presupuestoSinAprobar,
                                aprobado: false
                            },
                            estado: 'Pendiente de presupuesto'
                        })
                    } catch(error) {
                        if(error instanceof Error) {
                            toast.error(`Error al desaprobar el presupuesto: ${error.message}`);
                        }
                    } finally {
                        setLoading(false);
                    }
                }}>
                    Desaprobar <ThumbsDown/>
                </Button>
            </div>
        </div>
    }

    if(!props.equipo.presupuesto.aprobado) return <WarningIndicator>El presupuesto no ha sido aprobado, se debe entregar el equipo</WarningIndicator>

    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 text-md">
            <div className="flex flex-col">
                <p className="font-semibold inline">Detalle: <span className="text-muted-foreground font-normal">{props.equipo.presupuesto.detalle}</span></p>
                <Separator className="my-2"/>
                <p className="font-medium text-lg">Total: <span className="text-green-500">ARS${props.equipo.presupuesto.monto}</span></p>
            </div>
        </div>
    </div>
}

const reparacionFormSchema = z.object({
    observaciones: z.string().min(1),
    reparado: z.boolean(),
    irreparable: z.boolean()
})

function Reparacion(props: PasoProps) {
    const form = useForm({ resolver: zodResolver(reparacionFormSchema), defaultValues: {
        observaciones: '',
        reparado: false,
        irreparable: false
    } })

    const disabled = !form.formState.isValid

    const user = useUser()

    const [loading, setLoading] = useState<boolean>(false)
    const tablaEquipos = useTablaEquipos()

    if(props.equipo.presupuesto === null || props.equipo.presupuesto.aprobado === null || !props.equipo.presupuesto.aprobado) return <WarningIndicator>El presupuesto debe haber sido aprobado para poder iniciar la reparacion</WarningIndicator>

    const presupuestoAprobado = props.equipo.presupuesto

    if(props.equipo.reparacion === null) {
        if(user.user?.publicMetadata.role !== 'tecnico') return <WarningIndicator>Solo un usuario tecnico puede comenzar la reparacion</WarningIndicator>

        return <div className="border border-dashed rounded-lg grid place-content-center p-4">
            <Button variant='outline' disabled={loading} onClick={async () => {
                setLoading(true)

                try {
                    await iniciarReparacion({ idPresupuesto: presupuestoAprobado.id })

                    toast.success(`Reparacion iniciada correctamente.`);

                    tablaEquipos.actualizarEquipo({
                        ...props.equipo,
                        reparacion: {
                            observaciones: null,
                            fechaDeFinalizacion: null,
                            reparado: null,
                            irreparable: false
                        },
                        estado: 'En reparación'
                    })
                } catch(error) {
                    if(error instanceof Error) {
                        toast.error(`Error al iniciar la reparacion: ${error.message}`);
                    }
                } finally {
                    setLoading(false);
                }
            }}>{
                loading
                ? 'Iniciando reparacion...'
                : <>Iniciar reparacion <Play/></>
            }</Button>
        </div>
    }

    if(props.equipo.reparacion.fechaDeFinalizacion === null) {
        if(user.user?.publicMetadata.role !== 'tecnico') return <WarningIndicator>Solo un usuario tecnico puede finalizar la reparacion</WarningIndicator>

        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(async (values) => {
                        setLoading(true)

                        try {
                            await editarReparacion({
                                idPresupuesto: presupuestoAprobado.id,
                                observaciones: values.observaciones,
                                reparado: values.reparado,
                                irreparable: values.irreparable,
                            })

                            toast.success(`Reparacion confirmada correctamente.`);

                            tablaEquipos.actualizarEquipo({
                                ...props.equipo,
                                reparacion: {
                                    observaciones: values.observaciones,
                                    fechaDeFinalizacion: new Date(),
                                    ...(values.reparado ? {
                                        reparado: true,
                                        irreparable: false
                                    }: {
                                        reparado: false,
                                        irreparable: true
                                    })
                                },
                                estado: 'Pendiente de entrega'
                            })
                        } catch(error) {
                            if(error instanceof Error) {
                                toast.error(`Error al confirmar la reparacion: ${error.message}`);
                            }
                        } finally {
                            setLoading(false);
                        }
                    })}>
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Se observo durante la reparacion:</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Observaciones de la reparacion..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reparado"
                                render={({ field }) => (
                                    <FormItem className="flex gap-2 items-center">
                                        <FormControl>
                                            <Switch 
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked)

                                                    form.setValue('irreparable', false)
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel>Reparado</FormLabel>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="irreparable"
                                render={({ field }) => (
                                    <FormItem className="flex gap-2 items-center">
                                        <FormControl>
                                            <Switch 
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked)

                                                    form.setValue('reparado', false)
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel>Irreparable</FormLabel>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-start pt-6">
                            <Button type="submit" variant='outline' disabled={disabled || loading}>
                                {
                                    loading
                                    ? 'Confirmando reparacion...'
                                    : <>Confirmar reparacion <HardDriveUpload/></>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    }

    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 text-md">
            <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">Reparado el {formatearFecha(props.equipo.reparacion.fechaDeFinalizacion)}</p>
                <p className="font-semibold inline">Se informa luego de la reparacion: <span className="text-muted-foreground font-normal">{props.equipo.reparacion.observaciones}</span></p>
            </div>
        </div>
    </div>
}

const entregaFormSchema = z.object({
    metodoDePagoId: z.number().int().positive()
})

function Entrega(props: PasoProps) {
    const tablaEquipos = useTablaEquipos()

    const form = useForm({ resolver: zodResolver(entregaFormSchema), defaultValues: {
        metodoDePagoId: tablaEquipos.metodosDePago[0].id
    } })

    const disabled = !form.formState.isValid

    const [loading, setLoading] = useState<boolean>(false)

    const user = useUser()

    if(props.equipo.presupuesto === null) return <WarningIndicator>Se debe asignar un presupuesto para poder devolver un equipo</WarningIndicator>

    if(!props.equipo.presupuesto.aprobado) {
        if(props.equipo.entrega !== null) return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
                <div className="flex flex-col">
                    <p className="text-muted-foreground text-sm">Entregado el {formatearFecha(props.equipo.entrega.fecha)}</p>
                    <p className="font-semibold inline">El equipo fue devuelto a {props.equipo.nombreCliente}: <span className="text-muted-foreground font-normal">No aprobo el presupuesto.</span></p>
                </div>
            </div>
        </div>

        return <div className="border border-dashed rounded-lg grid place-content-center p-4">
            <Button variant='outline' disabled={loading} onClick={async () => {
                setLoading(true)

                try {
                    await agregarEntrega({ idEquipo: props.equipo.id })

                    toast.success(`Equipo devuelto correctamente.`);

                    tablaEquipos.actualizarEquipo({
                        ...props.equipo,
                        entrega: {
                            fecha: new Date(),
                            metodoDePago: null
                        },
                        estado: 'Entregado'
                    })
                } catch(error) {
                    if(error instanceof Error) {
                        toast.error(`Error al devolver el equipo: ${error.message}`);
                    }
                } finally {
                    setLoading(false);
                }
            }}>{
                loading
                ? 'Confirmando entrega...'
                : <>Entregar equipo <RefreshCcw/></>
            }</Button>
        </div>
    }

    if(props.equipo.reparacion === null || props.equipo.reparacion.fechaDeFinalizacion === null) return <WarningIndicator>La reparacion debe haber finalizado para poder entregar el equipo</WarningIndicator>

    const presupuestoAprobado = props.equipo.presupuesto

    if(props.equipo.entrega === null) {
        if(user.user?.publicMetadata.role !== 'administrador') return <WarningIndicator>Solo un usuario de tipo administrador puede confirmar la entrega del equipo</WarningIndicator>

        return <div className="flex flex-col">
            <div className="flex flex-col gap-2 text-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(async (values) => {
                        setLoading(true)

                        try {
                            await agregarEntrega({ idEquipo: props.equipo.id, idReparacion: presupuestoAprobado.id, idMetodoDePago: values.metodoDePagoId })

                            toast.success(`Entrega confirmada correctamente.`);

                            tablaEquipos.actualizarEquipo({
                                ...props.equipo,
                                entrega:{
                                    fecha: new Date(),
                                    metodoDePago: tablaEquipos.metodosDePago.find(metodo => metodo.id === values.metodoDePagoId)?.nombre || ''
                                },
                                estado: 'Entregado'
                            })
                        } catch(error) {
                            if(error instanceof Error) {
                                toast.error(`Error al confirmar la entrega: ${error.message}`);
                            }
                        } finally {
                            setLoading(false);
                        }
                    })}>
                        <div className="flex flex-col gap-4">
                            <p className="font-medium text-lg">Total a pagar: <span className="text-green-600">ARS${props.equipo.presupuesto.monto}</span></p>
                            <FormField
                                control={form.control}
                                name="metodoDePagoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Elige el metodo de pago:</FormLabel>
                                        <Select onValueChange={(newValue) => {
                                            field.onChange(Number(newValue));
                                        }} defaultValue={String(field.value)}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Elige el metodo de pago..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    tablaEquipos.metodosDePago.map(
                                                        metodoDePago => <SelectItem key={metodoDePago.id} value={String(metodoDePago.id)}>
                                                            {metodoDePago.nombre}
                                                        </SelectItem>
                                                    )
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-start pt-6">
                            <Button type="submit" variant='outline' disabled={disabled || loading}>
                                {
                                    loading
                                    ? 'Confirmando entrega...'
                                    : <>Confirmar entrega <DollarSign/></>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    }

    return <div className="flex flex-col">
        <div className="flex flex-col gap-2 text-md">
            <div className="flex flex-col">
                <p className="text-muted-foreground text-sm">Entregado el {formatearFecha(props.equipo.entrega.fecha)}</p>
                <p className="font-semibold inline">Entregado a {props.equipo.nombreCliente}: <span className="text-muted-foreground font-normal">Efectuo un pago de <span className="text-green-600">ARS${props.equipo.presupuesto.monto}</span> a traves de <span className="underline">{props.equipo.entrega.metodoDePago}</span></span></p>
            </div>
        </div>
    </div>
}

function WarningIndicator(props: React.PropsWithChildren) {
    return <p className="bg-accent border border-gray-300 text-gray-500 p-2 rounded-lg py-1 font-medium grid grid-cols-[24px_auto] gap-2 items-center"><CircleAlert size={24}/> {props.children}</p>
}