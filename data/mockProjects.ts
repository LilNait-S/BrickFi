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
    ],
    totalRaised: 850000,
    softCap: 1200000,
    hardCap: 1500000,
    roi: 2.3,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días
    description: "Desarrollo residencial de lujo en el corazón de San Isidro",
    tokenPrice: 100,
    minInvestment: 500,
  },
  {
    id: "2",
    name: "Centro Comercial Plaza Norte",
    location: "Independencia, Lima",
    type: "commercial",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    ],
    totalRaised: 2100000,
    softCap: 2500000,
    hardCap: 3000000,
    roi: 1.8,
    deadline: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 días
    description: "Ampliación de centro comercial en zona de alto tráfico",
    tokenPrice: 200,
    minInvestment: 1000,
  },
  {
    id: "3",
    name: "Residencial Los Jardines",
    location: "Surco, Lima",
    type: "residential",
    status: "funded",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    ],
    totalRaised: 1800000,
    softCap: 1800000,
    hardCap: 2200000,
    roi: 2.1,
    deadline: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 días
    description: "Condominio de casas exclusivas con áreas verdes",
    tokenPrice: 150,
    minInvestment: 750,
  },
  {
    id: "4",
    name: "Edificio Corporativo Sky",
    location: "Miraflores, Lima",
    type: "commercial",
    status: "construction",
    images: [
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
    ],
    totalRaised: 3500000,
    softCap: 3500000,
    hardCap: 4000000,
    roi: 1.9,
    deadline: Date.now() - 10 * 24 * 60 * 60 * 1000, // Pasado
    description: "Torre de oficinas premium con tecnología de punta",
    tokenPrice: 250,
    minInvestment: 1500,
  },
  {
    id: "5",
    name: "Complejo Mixto Avenue",
    location: "San Borja, Lima",
    type: "mixed",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    ],
    totalRaised: 1650000,
    softCap: 2800000,
    hardCap: 3500000,
    roi: 2.5,
    deadline: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 días
    description: "Desarrollo mixto con residencias, oficinas y comercio",
    tokenPrice: 175,
    minInvestment: 875,
  },
  {
    id: "6",
    name: "Residencial Costa Verde",
    location: "Barranco, Lima",
    type: "residential",
    status: "completed",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    totalRaised: 2200000,
    softCap: 2200000,
    hardCap: 2500000,
    roi: 2.2,
    deadline: Date.now() - 30 * 24 * 60 * 60 * 1000, // Completado
    description: "Departamentos frente al mar con acabados de primera",
    tokenPrice: 180,
    minInvestment: 900,
  },
]
