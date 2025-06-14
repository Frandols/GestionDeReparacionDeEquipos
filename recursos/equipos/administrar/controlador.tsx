'use client'

import vistaAgregarEquipo from "./vista"

/**
 * Componente controlador que simplemente renderiza
 * el componente de vista para agregar un equipo.
 * 
 * Actualmente no contiene lógica adicional,
 * solo delega la representación a la vista.
 */
export default function ControladorAgregarEquipo() {
  return vistaAgregarEquipo()
}
