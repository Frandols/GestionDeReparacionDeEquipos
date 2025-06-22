import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto w-3xl h-full rounded-lg p-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Sistema de Gestion de Reparacion de Equipos
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-2xl my-5">
        Version: Segunda entrega
      </p>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Funcionalidades implementadas
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Procesar equipo: <Link className="hover:underline" href={'/equipos/administrar'}>ver aqui</Link></li>
      </ul>
    </section>
  );
}
