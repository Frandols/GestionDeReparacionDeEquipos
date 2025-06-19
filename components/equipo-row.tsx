import activarEquipo from "@/actions/activarEquipo";
import eliminarEquipo from "@/actions/eliminarEquipo";
import { EquipoAdaptado } from "@/respositorios/equipo";
import FormEditarEquipo from "./form-editar-equipo";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TableCell, TableRow } from "./ui/table";

interface EquipoRowProps {
    equipo: EquipoAdaptado;
    showActions: boolean;
}

export default function EquipoRow(props: EquipoRowProps) {
    return <TableRow>
        <TableCell className={`font-medium${props.equipo.deleted ? ' text-destructive' : ' text-base'}`}>{props.equipo.id}</TableCell>
        <TableCell>{props.equipo.nombreTipoDeEquipo as string}</TableCell>
        <TableCell>{props.equipo.nombreMarca as string}</TableCell>
        <TableCell>{props.equipo.nombreModelo}</TableCell>
        <TableCell>{props.equipo.nombreCliente}</TableCell>
        <TableCell>{props.equipo.observaciones}</TableCell>
        <TableCell>{props.equipo.razonDeIngreso as string}</TableCell>
        <TableCell>{props.equipo.nroSerie as string}</TableCell>
        <TableCell>{props.equipo.enciende ? 'Si' : 'No'}</TableCell>
        <TableCell className={`text-right${props.equipo.deleted ? ' text-destructive' : ' text-green-500'}`}>{props.equipo.deleted ? 'Eliminado' : 'Activo'}</TableCell>
        {
            props.showActions
            ? <>
                <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild><Button variant='ghost'>Editar</Button></DialogTrigger>
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
                </TableCell>
                <TableCell className="text-right">
                    {
                        props.equipo.deleted
                        ? <Button onClick={() => {
                            activarEquipo(props.equipo)
                        }}>Activar</Button>
                        : <Button variant='destructive' onClick={() => {
                            eliminarEquipo(props.equipo)
                        }}>Eliminar</Button>
                    }
                </TableCell>
            </>
            : null
        }
    </TableRow>
}