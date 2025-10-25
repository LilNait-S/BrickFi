import Link from "next/link"

export default function NoAccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="text-xl font-semibold">Acceso denegado</h1>
        <p className="text-sm text-neutral-400">
          Tu wallet no está en la lista de administradores o tu sesión expiró.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-white text-black text-sm font-medium px-4 py-2 hover:opacity-80"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
