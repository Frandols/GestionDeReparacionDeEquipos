import TablaEquipos from "@/components/tabla-equipos";
import { ClienteAdaptado } from "@/respositorios/client";
import { EquipoPayloadRespuesta } from "@/respositorios/equipo";
import { MarcaAdaptada } from "@/respositorios/marcas";
import { MetodoDePagoPayloadRespuesta } from "@/respositorios/metodosDePago";
import { ModeloAdaptado } from "@/respositorios/modelos";
import { TipoDeEquipoAdaptado } from "@/respositorios/tipoDeEquipo";

export default function VistaAdministrarEquipos(
  equipos: EquipoPayloadRespuesta[], 
  clientes: ClienteAdaptado[], 
  tiposDeEquipo: TipoDeEquipoAdaptado[], 
  marcas: MarcaAdaptada[], 
  modelos: ModeloAdaptado[],
  metodosDePago: MetodoDePagoPayloadRespuesta[]
) {
  return <TablaEquipos 
    equipos={equipos} 
    showActions={true} 
    clientes={clientes} 
    tiposDeEquipo={tiposDeEquipo} 
    marcas={marcas} 
    modelos={modelos} 
    metodosDePago={metodosDePago}
  />
}