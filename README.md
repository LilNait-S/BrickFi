# BrickFi - Tokenización Inmobiliaria en Scroll

## Descripción

DApp híbrida que permite a constructoras tokenizar sus proyectos inmobiliarios, ofreciendo a inversionistas tokens ERC-20 respaldados por activos reales, con retorno on-chain y liquidez descentralizada.

## Tecnologías

- Blockchain: Scroll
- Smart Contracts: Solidity (ERC-20 + ICO Manager + Return Logic)
- Frontend: Next.js / React
- Backend: Node.js
- Wallet: MetaMask / Scroll Testnet
- Integraciones: Uniswap SDK

## Flujo principal

1. Admin (KYC verificado) crea proyecto desde dashboard.
2. Smart contract se despliega con parámetros del proyecto.
3. Inversionistas (KYC verificados) compran tokens.
4. Al alcanzar el softcap, se crea un pool Token/USDT.
5. Al finalizar el proyecto, se devuelve el retorno on-chain.
6. Inversionistas reclaman NFT Soulbound como certificado.

## Funcionalidades

- Creación de proyectos tokenizados (panel admin).
- Smart contracts verificados en Scroll testnet.
- Dashboard de inversionista con visualización de retorno.
- Integración con Uniswap para liquidez automática.
- Reclamación de NFT Soulbound de participación.

## Equipo

BrickFi Dev Team - EthLima Hackathon 2025
