'use server'

import { Revision } from '@/respositorios/revision'

export default async function finalizarRevision(
	idEquipo: number,
	observaciones: string
) {
	const nuevaRevision = new Revision(idEquipo, observaciones, new Date())

	nuevaRevision.update()
}
