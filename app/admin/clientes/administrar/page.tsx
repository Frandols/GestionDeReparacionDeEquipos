"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListarClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "deleted">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("/api/clientes");
        const data = await response.json();
        setClientes(data);
        setFilteredClientes(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    let updatedClientes = [...clientes];

    if (filter === "active") {
      updatedClientes = updatedClientes.filter(
        (cliente) => cliente.deleted === false
      );
    } else if (filter === "deleted") {
      updatedClientes = updatedClientes.filter(
        (cliente) => cliente.deleted === true
      );
    }

    if (searchQuery.trim() !== "") {
      updatedClientes = updatedClientes.filter((cliente) => {
        const query = searchQuery.toLowerCase();
        return (
          (cliente.firstName &&
            cliente.firstName.toLowerCase().includes(query)) ||
          (cliente.lastName &&
            cliente.lastName.toLowerCase().includes(query)) ||
          (cliente.dni && cliente.dni.toLowerCase().includes(query)) ||
          (cliente.email && cliente.email.toLowerCase().includes(query))
        );
      });
    }

    setFilteredClientes(updatedClientes);
  }, [filter, clientes, searchQuery]);

  const handleEdit = (dni: string) => {
    router.push(`/editarCliente/${dni}`);
  };

  const handleDelete = async (dni: string) => {
    try {
      const response = await fetch(`/api/clientes/${dni}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.dni === dni ? { ...cliente, deleted: true } : cliente
          )
        );
      } else {
        console.error("Error al eliminar cliente:", data.error);
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleActivate = async (dni: string) => {
    try {
      const response = await fetch(`/api/clientes/${dni}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleted: false }),
      });

      const data = await response.json();

      if (response.ok) {
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.dni === dni ? { ...cliente, deleted: false } : cliente
          )
        );
      } else {
        console.error("Error al activar cliente:", data.error);
      }
    } catch (error) {
      console.error("Error al activar cliente:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Listado de Clientes</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilter("active")}
          className={`${filter === "active" ? "bg-gray-700 text-white" : ""}`}
        >
          Activos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilter("deleted")}
          className={`${filter === "deleted" ? "bg-gray-700 text-white" : ""}`}
        >
          Eliminados
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilter("all")}
          className={`${filter === "all" ? "bg-gray-700 text-white" : ""}`}
        >
          Todos
        </Button>
      </div>

      {/* 🧠 Search Bar Added Here */}
      <Card className="mb-6 bg-gray-900 border-gray-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Filtros</CardTitle>
          <CardDescription className="text-gray-300">
            Busca y filtra la lista de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar por nombre, apellido, DNI o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID Cliente</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.id}</TableCell>
              <TableCell>{cliente.dni}</TableCell>
              <TableCell>{cliente.firstName}</TableCell>
              <TableCell>{cliente.lastName}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.phoneNumber}</TableCell>
              <TableCell className="flex justify-end gap-2">
                {cliente.deleted ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleActivate(cliente.dni)}
                  >
                    Activar
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gray-200"
                      onClick={() => handleEdit(cliente.dni)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
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
  );
}
    