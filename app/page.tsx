import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { faqs, features } from "@/constants"
import { ArrowRight, Building2, CheckCircle2, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />

        <div className="container mx-auto relative z-10 px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 backdrop-blur-xl px-6 py-3 text-sm font-semibold text-white border border-primary/30 shadow-xl">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <Building2 className="h-4 w-4 text-primary" />
                Tokenización Inmobiliaria • Scroll Network
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight">
                  <span className="block text-white">El futuro</span>
                  <span className="block text-gradient">inmobiliario</span>
                  <span className="block text-white">es ahora</span>
                </h1>

                <div className="h-1 w-24 bg-linear-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0" />
              </div>

              {/* Subtitle */}
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <span className="font-semibold text-white">BrickFi</span>{" "}
                democratiza la inversión inmobiliaria a través de tokenización
                blockchain.{" "}
                <span className="text-primary font-medium">
                  Acceso global, retornos garantizados, transparencia total.
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button
                  asChild
                  size="lg"
                  className="transition-all duration-500 transform hover:scale-105"
                >
                  <Link href="/proyectos">
                    <span>Explorar Proyectos</span>
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard">Ver Dashboard</Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-8 space-y-4">
                <p className="text-sm text-slate-400 font-medium">
                  Más de 500+ inversores confían en nosotros
                </p>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale items-center">
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="Investor 1"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                      alt="Investor 2"
                    />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                      alt="Investor 3"
                    />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                      alt="Investor 4"
                    />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
                      alt="Investor 5"
                    />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                      alt="Investor 6"
                    />
                    <AvatarFallback>RG</AvatarFallback>
                  </Avatar>
                  <span className="ml-5 text-sm text-slate-300">+494 más</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Dashboard */}
            <div className="lg:pl-8">
              <div className="relative">
                {/* Main Stats Card */}
                <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="space-y-8">
                    <div className="text-center pb-4 border-b border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Portfolio Activo
                      </h3>
                      <p className="text-slate-300">
                        Rendimiento en tiempo real
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-gradient">
                          $2.5M+
                        </div>
                        <div className="text-sm text-slate-300 font-medium">
                          Capital Total
                        </div>
                        <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
                          <ArrowRight className="h-3 w-3 -rotate-45" />
                          <span>+18.2%</span>
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">4</div>
                        <div className="text-sm text-slate-300 font-medium">
                          Proyectos
                        </div>
                        <div className="flex items-center justify-center gap-1 text-primary text-xs">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <span>Activos</span>
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-gradient">
                          2.1x
                        </div>
                        <div className="text-sm text-slate-300 font-medium">
                          ROI Promedio
                        </div>
                        <div className="text-xs text-green-400 font-medium">
                          Garantizado
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">
                          98%
                        </div>
                        <div className="text-sm text-slate-300 font-medium">
                          Éxito
                        </div>
                        <div className="flex items-center justify-center gap-1 text-green-400 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verificado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -left-6 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white font-medium">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mx-auto">
              ¿Por qué elegir BrickFi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plataforma que democratiza la inversión inmobiliaria mediante
              blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="gradient-card border-border/50 shadow-card"
                >
                  <CardContent className="space-y-4 text-center">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mx-auto">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Invierte en proyectos inmobiliarios en 4 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Conecta tu Wallet",
                desc: "Usa MetaMask, WalletConnect o cualquier wallet compatible con Scroll",
              },
              {
                step: "2",
                title: "Verifica tu Identidad",
                desc: "Proceso rápido de KYC para cumplir con regulaciones internacionales",
              },
              {
                step: "3",
                title: "Invierte en USDT",
                desc: "Elige un proyecto de BrickFi y define tu monto de inversión",
              },
              {
                step: "4",
                title: "Reclama Retornos",
                desc: "Obtén tu ROI garantizado + NFT de participación al completarse",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center space-y-6">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-primary/50 to-transparent" />
                )}
                <div className="mx-auto h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Preguntas Frecuentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border gradient-card rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main CTA Card */}
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-linear-to-br from-primary/5 to-secondary/5 backdrop-blur-xl p-12 md:p-16 lg:p-20">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10" />

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/30">
                      <Zap className="h-4 w-4" />
                      Última oportunidad
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                      Comienza tu viaje como{" "}
                      <span className="text-gradient">
                        inversor inmobiliario
                      </span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Únete a cientos de inversores que ya están generando
                      retornos garantizados con BrickFi. Proyectos verificados,
                      transparencia blockchain, y acceso global.
                    </p>
                  </div>

                  {/* Benefits list */}
                  <div className="space-y-3">
                    {[
                      {
                        icon: CheckCircle2,
                        text: "Retornos garantizados desde el 12% anual",
                      },
                      {
                        icon: Shield,
                        text: "Proyectos verificados y asegurados",
                      },
                      {
                        icon: Zap,
                        text: "Acceso inmediato sin comisiones ocultas",
                      },
                    ].map((benefit, idx) => {
                      const Icon = benefit.icon
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-foreground font-medium">
                            {benefit.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
                    >
                      <Link href="/proyectos">
                        Ver Proyectos Disponibles
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="text-base px-8 py-6 border-primary/30 hover:bg-primary/5 transition-all duration-300 bg-transparent"
                    >
                      <Link href="/dashboard">Acceder al Dashboard</Link>
                    </Button>
                  </div>
                </div>

                {/* Right side - Stats showcase */}
                <div className="hidden md:grid grid-cols-2 gap-6">
                  {[
                    {
                      value: "$2.5M+",
                      label: "Capital Movilizado",
                      highlight: false,
                    },
                    { value: "2.1x", label: "ROI Promedio", highlight: true },
                    {
                      value: "4",
                      label: "Proyectos Activos",
                      highlight: false,
                    },
                    { value: "98%", label: "Tasa de Éxito", highlight: true },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                        stat.highlight
                          ? "bg-linear-to-br from-primary/20 to-secondary/20 border border-primary/30"
                          : "bg-card/30 border border-border/50 hover:bg-card/50"
                      }`}
                    >
                      <p
                        className={`text-3xl font-bold mb-2 ${
                          stat.highlight ? "text-gradient" : "text-foreground"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Seguridad Blockchain",
                  desc: "Todos los contratos auditados y verificados",
                },
                {
                  title: "Soporte 24/7",
                  desc: "Equipo dedicado para resolver tus dudas",
                },
                {
                  title: "Regulación Completa",
                  desc: "Cumplimiento total de normativas internacionales",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center hover:border-primary/30 transition-colors duration-300"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
