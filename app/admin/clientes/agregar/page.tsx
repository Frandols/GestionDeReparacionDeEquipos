"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function FormCliente() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    numero: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      //Hay que mapear ya que el back espera de esta manera los datos
      const mappedData = {
        firstName: formData.nombre,
        lastName: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        phoneNumber: formData.numero,
        deleted: false,
      };

      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedData),
      });

      if (!response.ok) {
        throw new Error("Error al agregar cliente");
      }

      const data = await response.json();
      console.log("Cliente agregado:", data);
      // Reset form if you want
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        numero: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-600 min-h-screen">
      {/* ICONO */}
      <div
        style={{ top: "10rem" }}
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-32 h-32 bg-[#202020]/80 rounded-full shadow-2xl"
      >
        <UserPlus className="w-20 h-20 text-white" />
      </div>

      <section className="flex flex-col items-center justify-center bg-[#202020]/80 rounded-2xl p-8 w-[350px] h-[500px] space-y-4 shadow-2xl mt-16">
        <h1 className="text-white text-bold italic font-mono text-2xl">
          Agregar cliente
        </h1>

        <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 gap-y-4 mt-8">
          <h1 className="text-white text-bold italic font-mono text-x1">
            Apellido
          </h1>
          <Input
            name="apellido"
            type="text"
            placeholder="Ingrese apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all"
          />

          <h1 className="text-white text-bold italic font-mono text-x1">
            Nombre
          </h1>
          <Input
            name="nombre"
            type="text"
            placeholder="Ingrese nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all"
          />

          <h1 className="text-white text-bold italic font-mono text-x1">DNI</h1>
          <Input
            name="dni"
            type="text"
            placeholder="Ingrese DNI"
            value={formData.dni}
            onChange={handleChange}
            required
            className="text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all"
          />

          <h1 className="text-white text-bold italic font-mono text-x1">
            Teléfono
          </h1>
          <Input
            name="numero"
            type="text"
            placeholder="Ingrese teléfono"
            value={formData.numero}
            onChange={handleChange}
            required
            className="text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all"
          />

          <h1 className="text-white text-bold italic font-mono text-x1">
            Correo
          </h1>
          <Input
            name="email"
            type="email"
            placeholder="Ingrese correo"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-white w-40 flex-1 focus:ring-2 focus:ring-gray-200 hover:ring-2 hover:ring-gray-400 transition-all"
          />
        </div>

        <div className="flex flex-col justify-start items-center">
          <Button
            onClick={handleSubmit}
            className="vibrate bg-gradient-to-r from-violet-400 to-violet-800 text-white px-15 py-2 rounded-md shadow-xl hover:from-violet-500 hover:to-violet-900 transition-all mt-5"
          >
            Agregar
          </Button>
        </div>
      </section>
    </section>
  );
}
