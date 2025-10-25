export interface Project {
  id: string
  name: string
  location: string
  type: "residential" | "commercial" | "mixed"
  status: "active" | "funded" | "construction" | "completed" | "payout"
  images: string[]
  totalRaised: number
  softCap: number
  hardCap: number
  roi: number
  deadline: number
  description: string
  tokenPrice: number
  minInvestment: number
  developer: string
  targetReturn: number
  startDate: number
  estimatedCompletion: number
  documents: Array<{ name: string; url: string }>
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Torre Mirador",
    location: "San Isidro, Lima",
    type: "residential",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    ],
    totalRaised: 850000,
    softCap: 1200000,
    hardCap: 1500000,
    roi: 2.3,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    description: "Desarrollo residencial de lujo en el corazón de San Isidro con acabados premium, áreas comunes exclusivas y ubicación privilegiada cerca de parques y centros comerciales.",
    tokenPrice: 100,
    minInvestment: 500,
    developer: "Inmobiliaria Premium SAC",
    targetReturn: 2760000,
    startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() + 365 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Estudio de Factibilidad", url: "#" },
      { name: "Planos Arquitectónicos", url: "#" },
      { name: "Licencia de Construcción", url: "#" },
      { name: "Contrato de Inversión", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Centro Comercial Plaza Norte",
    location: "Independencia, Lima",
    type: "commercial",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=400&h=300&fit=crop",
    ],
    totalRaised: 2100000,
    softCap: 2500000,
    hardCap: 3000000,
    roi: 1.8,
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
    description: "Ampliación de centro comercial en zona de alto tráfico con locales comerciales estratégicamente ubicados y alto potencial de rentabilidad.",
    tokenPrice: 200,
    minInvestment: 1000,
    developer: "Grupo Plaza Desarrollos",
    targetReturn: 4500000,
    startDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() + 540 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Análisis de Mercado", url: "#" },
      { name: "Proyección de Rentas", url: "#" },
      { name: "Permisos Municipales", url: "#" },
      { name: "Due Diligence Legal", url: "#" },
    ],
  },
  {
    id: "3",
    name: "Residencial Los Jardines",
    location: "Surco, Lima",
    type: "residential",
    status: "funded",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    ],
    totalRaised: 1800000,
    softCap: 1800000,
    hardCap: 2200000,
    roi: 2.1,
    deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
    description: "Condominio de casas exclusivas con áreas verdes, seguridad 24/7 y diseño contemporáneo en una de las mejores zonas de Santiago de Surco.",
    tokenPrice: 150,
    minInvestment: 750,
    developer: "Constructora Verde Ltda",
    targetReturn: 3780000,
    startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() + 450 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Master Plan", url: "#" },
      { name: "Certificado de Parámetros", url: "#" },
      { name: "Estudio de Impacto Ambiental", url: "#" },
      { name: "Contrato de Fideicomiso", url: "#" },
    ],
  },
  {
    id: "4",
    name: "Edificio Corporativo Sky",
    location: "Miraflores, Lima",
    type: "commercial",
    status: "construction",
    images: [
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=400&h=300&fit=crop",
    ],
    totalRaised: 3500000,
    softCap: 3500000,
    hardCap: 4000000,
    roi: 1.9,
    deadline: Date.now() - 10 * 24 * 60 * 60 * 1000,
    description: "Torre de oficinas premium con tecnología de punta, certificación LEED y ubicación estratégica en el corazón financiero de Miraflores.",
    tokenPrice: 250,
    minInvestment: 1500,
    developer: "Sky Builders Corp",
    targetReturn: 6650000,
    startDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() + 300 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Certificación LEED", url: "#" },
      { name: "Contratos de Pre-Arrendamiento", url: "#" },
      { name: "Especificaciones Técnicas", url: "#" },
      { name: "Póliza de Seguros", url: "#" },
    ],
  },
  {
    id: "5",
    name: "Complejo Mixto Avenue",
    location: "San Borja, Lima",
    type: "mixed",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=300&fit=crop",
    ],
    totalRaised: 1650000,
    softCap: 2800000,
    hardCap: 3500000,
    roi: 2.5,
    deadline: Date.now() + 60 * 24 * 60 * 60 * 1000,
    description: "Desarrollo mixto innovador con residencias, oficinas y comercio en un solo complejo, maximizando rentabilidad y diversificación de ingresos.",
    tokenPrice: 175,
    minInvestment: 875,
    developer: "Avenue Developers Inc",
    targetReturn: 7000000,
    startDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() + 600 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Plan Maestro Integrado", url: "#" },
      { name: "Estudio de Zonificación", url: "#" },
      { name: "Análisis de Rentabilidad", url: "#" },
      { name: "Acuerdo de Inversión", url: "#" },
    ],
  },
  {
    id: "6",
    name: "Residencial Costa Verde",
    location: "Barranco, Lima",
    type: "residential",
    status: "completed",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    ],
    totalRaised: 2200000,
    softCap: 2200000,
    hardCap: 2500000,
    roi: 2.2,
    deadline: Date.now() - 30 * 24 * 60 * 60 * 1000,
    description: "Departamentos frente al mar con acabados de primera, vista panorámica al océano y acceso directo a la costa verde de Barranco.",
    tokenPrice: 180,
    minInvestment: 900,
    developer: "Costa Real Estate",
    targetReturn: 4840000,
    startDate: Date.now() - 730 * 24 * 60 * 60 * 1000,
    estimatedCompletion: Date.now() - 30 * 24 * 60 * 60 * 1000,
    documents: [
      { name: "Acta de Entrega", url: "#" },
      { name: "Certificado de Conformidad", url: "#" },
      { name: "Informe de Liquidación", url: "#" },
      { name: "Reporte de ROI Final", url: "#" },
    ],
  },
]
