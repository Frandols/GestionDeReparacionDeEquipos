import TablaEquipos from "@/components/tabla-equipos";
import { ClienteAdaptado } from "@/respositorios/client";
import { EquipoAdaptado } from "@/respositorios/equipo";
import { MarcaAdaptada } from "@/respositorios/marcas";
import { ModeloAdaptado } from "@/respositorios/modelos";
import { TipoDeEquipoAdaptado } from "@/respositorios/tipoDeEquipo";

export default function VistaAdministrarEquipos(
  equipos: EquipoAdaptado[], 
  clientes: ClienteAdaptado[], 
  tiposDeEquipo: TipoDeEquipoAdaptado[], 
  marcas: MarcaAdaptada[], 
  modelos: ModeloAdaptado[]
) {
  return <TablaEquipos 
    equipos={equipos} 
    showActions={true} 
    clientes={clientes} 
    tiposDeEquipo={tiposDeEquipo} 
    marcas={marcas} 
    modelos={modelos} 
  />
}