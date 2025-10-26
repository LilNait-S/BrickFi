import { NextRequest, NextResponse } from "next/server"

/**
 * API Route para subir imágenes a IPFS usando Pinata
 * 
 * Este endpoint recibe un archivo desde el cliente y lo sube a IPFS/Filecoin.
 * El CID (Content Identifier) retornado es agnóstico de blockchain y puede
 * guardarse en cualquier smart contract EVM (Ethereum, Scroll, BNB Chain, etc.)
 * 
 * La imagen se puede recuperar usando gateways IPFS:
 * - https://ipfs.io/ipfs/{cid}
 * - https://gateway.pinata.cloud/ipfs/{cid}
 * - Cualquier otro gateway IPFS público
 */

export async function POST(request: NextRequest) {
  try {
    // Verificar que existe el token de Pinata (no debe ser expuesto al cliente)
    const pinataJwt = process.env.PINATA_JWT
    if (!pinataJwt) {
      return NextResponse.json(
        { error: "Configuración de IPFS no disponible" },
        { status: 500 }
      )
    }

    // Leer el FormData del request
    const formData = await request.formData()
    const file = formData.get("file") as File

    // Validar que existe el archivo
    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      )
    }

    // Crear FormData para Pinata
    const pinataFormData = new FormData()
    pinataFormData.append("file", file)

    // Subir archivo a IPFS usando API de Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: pinataFormData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Error al subir a Pinata")
    }

    const data = await response.json()

    // Retornar el CID (Content Identifier)
    return NextResponse.json(
      {
        cid: data.IpfsHash,
        name: file.name,
        size: file.size,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error subiendo archivo a IPFS:", error)
    return NextResponse.json(
      {
        error: "Error al subir el archivo a IPFS",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
