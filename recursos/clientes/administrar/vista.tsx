"use client";

import TablaClientes from "@/components/tabla-clientes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VistaAdministrarClientes() {
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
    router.push(`/clientes/administrar/${dni}`);
  };

  const handleDelete = async (dni: string) => {
    try {
      const response = await fetch(`/api/clientes/${dni}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        if('message' in data) {
          toast.error(`Error al eliminar cliente: ${data.message}`)

          return
        }

        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.dni === dni ? { ...cliente, deleted: true } : cliente
          )
        );
      } else {
        toast.error(`Error al eliminar cliente: ${data.error}`);
      }
    } catch (error) {
      toast.error(`Error al eliminar cliente: ${error}`);
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

    return <TablaClientes 
      showActions 
      onDelete={(cliente) => handleDelete(cliente.dni)} 
      onUpdate={(cliente) => handleEdit(cliente.dni)} 
      onActivate={(cliente) => handleActivate(cliente.dni)}
      clientes={clientes} 
  />
}
