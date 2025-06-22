import activarEquipo from "@/actions/activarEquipo";
import eliminarEquipo from "@/actions/eliminarEquipo";
import { EquipoPayloadRespuesta } from "@/respositorios/equipo";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Archive, ArchiveRestore, EllipsisVertical, FileStack, PanelRightOpen, Pencil } from "lucide-react";
import { toast } from "sonner";
import BadgeEstado from "./badge-estado";
import FormEditarEquipo from "./form-editar-equipo";
import ProgresoEstados from "./progreso-estados";
import { useTablaEquipos } from "./tabla-equipos";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { TableCell, TableRow } from "./ui/table";

interface EquipoRowProps {
    equipo: EquipoPayloadRespuesta;
    showActions: boolean;
}

export default function EquipoRow(props: EquipoRowProps) {
    const tablaEquipos = useTablaEquipos()

    return <TableRow>
        <TableCell className={`font-medium${props.equipo.deleted ? ' text-destructive' : ' text-base'}`}>{props.equipo.nombreCliente}</TableCell>
        <TableCell>{props.equipo.nombreTipoDeEquipo as string}</TableCell>
        <TableCell>{props.equipo.nombreMarca as string}</TableCell>
        <TableCell>{props.equipo.nombreModelo}</TableCell>
        <TableCell>{props.equipo.nroSerie as string}</TableCell>
        <TableCell>{props.equipo.enciende ? 'Si' : 'No'}</TableCell>
        <TableCell>
            <BadgeEstado estado={props.equipo.estado} />
        </TableCell>
        <TableCell>{props.equipo.deleted ? 'Si' : 'No'}</TableCell>
        <TableCell className={props.showActions ? 'text-left' : 'text-right'}>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant='ghost'>
                        Abrir
                        <PanelRightOpen/>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Informacion</SheetTitle>
                        <SheetDescription>
                            {props.equipo.nombreTipoDeEquipo} {props.equipo.nombreMarca} {props.equipo.nombreModelo}, Nro: {props.equipo.nroSerie}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 p-4">
                        <div className="flex flex-col gap-1">
                            <p className="font-bold">Observaciones</p>
                            <p className="text-muted-foreground">{props.equipo.observaciones}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-bold">Razon de ingreso</p>
                            <p className="text-muted-foreground">{props.equipo.razonDeIngreso}</p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </TableCell>
        {
            props.showActions
            ? <>
                <TableCell className="text-right flex gap-2 justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Procesar <FileStack/></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <ProgresoEstados
                                equipo={props.equipo}
                            />
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-60" align="end">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pencil/>
                                        Editar
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Editar usuario</DialogTitle>
                                    <DialogDescription>
                                        Edita los datos de {props.equipo.nombreTipoDeEquipo} {props.equipo.nombreMarca} {props.equipo.nombreModelo} aqui:
                                    </DialogDescription>
                                    </DialogHeader>
                                    <FormEditarEquipo equipo={props.equipo} />
                                </DialogContent>
                            </Dialog>
                            {
                                props.equipo.deleted
                                ? <DropdownMenuItem onClick={async () => {
                                    try {
                                        await activarEquipo(props.equipo)

                                        toast.success(`Equipo ${props.equipo.id} activado correctamente.`);

                                        tablaEquipos.actualizarEquipo({
                                            ...props.equipo,
                                            deleted: false
                                        })
                                    } catch(error) {
                                        if(error instanceof Error) {
                                            toast.error(`Error al activar el equipo: ${error.message}`);
                                        }
                                    }
                                }} className="text-green-400">
                                    <ArchiveRestore className="text-green-400"/>
                                    Activar
                                </DropdownMenuItem>
                                : <DropdownMenuItem variant='destructive' onClick={async () => {
                                    try {
                                        await eliminarEquipo(props.equipo)

                                        toast.success(`Equipo ${props.equipo.id} eliminado correctamente.`);

                                        tablaEquipos.actualizarEquipo({
                                            ...props.equipo,
                                            deleted: true
                                        })
                                    } catch(error) {
                                        if(error instanceof Error) {
                                            toast.error(`Error al eliminar el equipo: ${error.message}`);
                                        }
                                    }
                                }}> 
                                    <Archive/>
                                    Eliminar
                                </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </>
            : null
        }
    </TableRow>
}