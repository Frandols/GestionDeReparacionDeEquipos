'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Download, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ListarClientes() {

	const [searchQuery, setSearchQuery] = useState('')
	const [clientes, setClientes] = useState<any[]>([]) // Usamos 'any' para no definir el tipo
	const [filteredClientes, setFilteredClientes] = useState<any[]>([]) // Usamos 'any' para no definir el tipo
	const [filter, setFilter] = useState<'all' | 'active' | 'deleted'>('all')
	const router = useRouter()

	useEffect(() => {
		const fetchClientes = async () => {
			try {
				const response = await fetch('/api/clientes')
				const data = await response.json()
				setClientes(data)
				setFilteredClientes(data) // Inicialmente mostramos todos los clientes
			} catch (error) {
				console.error('Error fetching clients:', error)
			}
		}

		fetchClientes()
	}, [])

	useEffect(() => {
		const applyFilters = () => {
		  let filtered = clientes
	  
		  if (filter === 'active') {
			filtered = filtered.filter((cliente) => cliente.deleted === false)
		  } else if (filter === 'deleted') {
			filtered = filtered.filter((cliente) => cliente.deleted === true)
		  }
	  
		  if (searchQuery.trim() !== '') {
			const lowerQuery = searchQuery.toLowerCase()
			filtered = filtered.filter((cliente) =>
			  cliente.firstName.toLowerCase().includes(lowerQuery) ||
			  cliente.lastName.toLowerCase().includes(lowerQuery) ||
			  cliente.dni.toString().includes(lowerQuery) ||
			  (cliente.email && cliente.email.toLowerCase().includes(lowerQuery))
			)
		  }
	  
		  setFilteredClientes(filtered)
		}
	  
		applyFilters()
	  }, [filter, searchQuery, clientes.length])
	  


	const handleEdit = (dni: string) => {
		router.push(`/editarCliente/${dni}`)
	}

	const handleDelete = async (dni: string) => {
		try {
			const response = await fetch(`/api/clientes/${dni}`, {
				method: 'DELETE',
			})

			const data = await response.json()

			if (response.ok) {
				setClientes((prevClientes) =>
					prevClientes.map((cliente) =>
						cliente.dni === dni ? { ...cliente, deleted: true } : cliente
					)
				)
			} else {
				console.error('Error al eliminar cliente:', data.error)
			}
		} catch (error) {
			console.error('Error al eliminar cliente:', error)
		}
	}

	const handleActivate = async (dni: string) => {
		try {
			const response = await fetch(`/api/clientes/${dni}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ deleted: false }),
			})

			const data = await response.json()

			if (response.ok) {
				setClientes((prevClientes) =>
					prevClientes.map((cliente) =>
						cliente.dni === dni ? { ...cliente, deleted: false } : cliente
					)
				)
			} else {
				console.error('Error al activar cliente:', data.error)
			}
		} catch (error) {
			console.error('Error al activar cliente:', error)
		}
	}


	return (
		<div className='container mx-auto py-6 bg-gray-50 text-gray-900 min-h-screen'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold'>Listado de Clientes</h1>
				<div className='flex items-center gap-2'>

				</div>
			</div>

			<div className='flex gap-4 mb-6'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setFilter('active')}
					className={`${filter === 'active' ? 'bg-gray-700 text-white' : ''}`}
				>
					Activos
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setFilter('deleted')}
					className={`${filter === 'deleted' ? 'bg-gray-700 text-white' : ''}`}
				>
					Eliminados
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setFilter('all')}
					className={`${filter === 'all' ? 'bg-gray-700 text-white' : ''}`}
				>
					Todos
				</Button>
			</div>

			<Card className='mb-6 bg-gray-900 border-gray-700 text-white'>
				<CardHeader className='pb-3'>
					<CardTitle className='text-white'>Filtros</CardTitle>
					<CardDescription className='text-gray-300'>
						Busca y filtra la lista de clientes
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='relative'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
						<Input
							type='search'
							placeholder='Buscar por nombre, apellido, DNI o email...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-gray-600'
						/>


					</div>
				</CardContent>
			</Card>

			<Card className='bg-gray-900 border-gray-700'>
				<CardContent className='p-0'>
					<div className='rounded-md border border-gray-700'>
						<Table>
							<TableHeader className='bg-gray-800'>
								<TableRow>
									<TableHead className='w-[100px] text-gray-200'>
										ID Cliente
									</TableHead>
									<TableHead className='text-gray-200'>DNI</TableHead>
									<TableHead className='text-gray-200'>Nombre</TableHead>
									<TableHead className='text-gray-200'>Apellido</TableHead>
									<TableHead className='text-gray-200'>Email</TableHead>
									<TableHead className='text-gray-200'>Teléfono</TableHead>
									<TableHead className='text-right text-gray-200'>
										Acciones
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredClientes.map((cliente: any) => (
									<TableRow
										key={cliente.id}
										className="border-gray-800 hover:bg-gray-800"
									>
										<TableCell className="font-medium text-white">
											{cliente.id}
										</TableCell>
										<TableCell className="text-gray-200">{cliente.dni}</TableCell>
										<TableCell className="text-gray-200">{cliente.firstName}</TableCell>
										<TableCell className="text-gray-200">{cliente.lastName}</TableCell>
										<TableCell className="text-gray-200">{cliente.email}</TableCell>
										<TableCell className="text-gray-200">{cliente.phoneNumber}</TableCell>
										<TableCell className="text-right flex justify-end gap-2">
											{cliente.deleted ? (
												<Button
													variant="ghost"
													size="sm"
													className="text-green-400 hover:text-white hover:bg-green-700"
													onClick={() => handleActivate(cliente.dni)}
												>
													Activar
												</Button>
											) : (
												<>
													<Button
														variant="ghost"
														size="sm"
														className="text-gray-200 hover:text-white hover:bg-gray-700"
														onClick={() => handleEdit(cliente.dni)}
													>
														Editar
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-400 hover:text-white hover:bg-red-700"
														onClick={() => handleDelete(cliente.dni)}
													>
														Eliminar
													</Button>
												</>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>

						</Table>
					</div>
				</CardContent>
			</Card>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					className='border-gray-200 hover:bg-gray-100'
				>
					Anterior
				</Button>
				<Button
					variant='outline'
					size='sm'
					className='border-gray-200 hover:bg-gray-100'
				>
					Siguiente
				</Button>
			</div>
		</div>
	)
}
