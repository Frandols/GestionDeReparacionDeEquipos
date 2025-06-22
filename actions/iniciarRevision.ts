'use server'

import { Revision } from '@/respositorios/revision'

export default async function iniciarRevision(idEquipo: number) {
	const nuevaRevision = new Revision(idEquipo, null, null)

	nuevaRevision.save()
}
