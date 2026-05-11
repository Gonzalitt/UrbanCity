import { useEffect, useState } from 'react'
import cityLogo from '@/assets/city-logo.jpg'
import {
  ArrowRight,
  AtSign,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Ruler,
  Store,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductVisual } from '@/components/product/ProductVisual'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/formatters'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

const promoStripItems = [
  'PEDIDOS POR WHATSAPP',
  'CONSULTA TALLES',
  'RETIRO COORDINADO',
  'NUEVOS INGRESOS',
]

const instagramTiles = [
  'Streetwear diario',
  'New drop',
  '@citycalzadourbano',
  'Sneakers urbanas',
  'City essentials',
  'Comodidad urbana',
]

export function HomePage() {
  const { products, storeSettings, loading } = useStorefrontData()
  const hasWhatsApp = Boolean(storeSettings.whatsapp_phone)

  const featuredProducts = products.filter((product) => product.featured)
  const visibleProducts =
    featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : products.slice(0, 4)
  const heroProducts =
    featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : products.slice(0, 3)
  const quickCategories = Array.from(
    new Map(
      products
        .filter((product) => product.category)
        .map((product) => [
          product.category?.id,
          {
            id: product.category?.id ?? product.id,
            name: product.category?.name ?? 'Categoria',
          },
        ]),
    ).values(),
  ).slice(0, 6)
  const instagramUrl =
    storeSettings.instagram_url ?? 'https://www.instagram.com/citycalzadourbano/'

  const heroSlides = [
    {
      eyebrow: 'Nuevos ingresos',
      title: 'Zapatillas urbanas para moverte con estilo.',
      description:
        'Elegi tu modelo, arma tu pedido y coordinamos disponibilidad por WhatsApp.',
      ctaLabel: 'Ver catalogo',
      ctaTo: '/catalogo',
      secondaryLabel: 'Consultar talles',
      secondaryHref: hasWhatsApp
        ? buildWhatsAppUrl(
            storeSettings.whatsapp_phone,
            'Hola, quiero consultar talles disponibles.',
          )
        : null,
      product: heroProducts[0] ?? null,
    },
    {
      eyebrow: 'Modelos destacados',
      title: 'Comodidad para todos los dias.',
      description:
        'Pares faciles de combinar para sumar estilo urbano en cualquier momento del dia.',
      ctaLabel: 'Ver destacados',
      ctaTo: '/catalogo',
      secondaryLabel: 'Consultar disponibilidad',
      secondaryHref: hasWhatsApp
        ? buildWhatsAppUrl(
            storeSettings.whatsapp_phone,
            'Hola, quiero consultar disponibilidad de un modelo destacado.',
          )
        : null,
      product: heroProducts[1] ?? heroProducts[0] ?? null,
    },
    {
      eyebrow: 'Consulta tu talle',
      title: 'Te ayudamos a elegir tu proximo par.',
      description:
        'Escribinos, consultanos talles y coordinamos retiro directo con el local.',
      ctaLabel: 'Arma tu pedido',
      ctaTo: '/catalogo',
      secondaryLabel: 'Hablar por WhatsApp',
      secondaryHref: hasWhatsApp
        ? buildWhatsAppUrl(
            storeSettings.whatsapp_phone,
            'Hola, quiero ayuda para elegir talle y modelo.',
          )
        : null,
      product: heroProducts[2] ?? heroProducts[0] ?? null,
    },
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 4800)

    return () => window.clearInterval(intervalId)
  }, [heroSlides.length])

  function goToPreviousSlide() {
    setActiveSlide((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1,
    )
  }

  function goToNextSlide() {
    setActiveSlide((current) => (current + 1) % heroSlides.length)
  }

  if (loading) {
    return <LoadingState label="Preparando la tienda..." />
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="space-y-4">
        <div className="promo-strip rounded-full border border-white/10 bg-[#111111] py-3 text-white/72">
          <div className="promo-strip-track">
            {[...promoStripItems, ...promoStripItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-6 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.26em]"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-brand-strong/70" />
              </span>
            ))}
          </div>
        </div>

        <div className="surface-panel relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,255,0,0.14),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_24%)]" />
          <div className="absolute -top-16 right-8 h-52 w-52 rounded-full bg-brand-strong/10 blur-3xl" />

          <div className="relative min-h-[640px] sm:min-h-[600px]">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.eyebrow}
                className={cn(
                  'absolute inset-0 transition duration-500',
                  activeSlide === index
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-2 opacity-0',
                )}
              >
                <div className="grid h-full gap-8 p-6 sm:p-8 lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
                  <div className="flex flex-col justify-between gap-8">
                    <div className="space-y-6">
                      <p className="eyebrow">{slide.eyebrow}</p>
                      <div className="space-y-4">
                        <h1 className="page-title">{slide.title}</h1>
                        <p className="page-copy">{slide.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={slide.ctaTo}
                          className={buttonStyles({
                            size: 'lg',
                            variant: 'secondary',
                          })}
                        >
                          {slide.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        {slide.secondaryHref ? (
                          <a
                            href={slide.secondaryHref}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonStyles({
                              variant: 'outline',
                              size: 'lg',
                            })}
                          >
                            <MessageCircle className="h-4 w-4" />
                            {slide.secondaryLabel}
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-white/72">
                      <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                        Zapatillas urbanas
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                        Comodidad diaria
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                        Retiro coordinado
                      </span>
                    </div>
                  </div>

                  <div className="relative flex min-h-[360px] items-end overflow-hidden rounded-[34px] border border-white/10 bg-[#0d0d0d] p-5 sm:p-6">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.18)),radial-gradient(circle_at_top_left,rgba(182,255,0,0.12),transparent_18%)]" />
                    <img
                      src={cityLogo}
                      alt="City Calzado Urbano"
                      className="absolute top-6 right-6 h-20 w-20 rounded-full border border-white/10 object-cover opacity-95 shadow-[0_20px_50px_rgba(0,0,0,0.32)]"
                    />
                    <div className="absolute left-5 top-6 text-[5rem] leading-none font-black uppercase tracking-[-0.08em] text-white/6 sm:text-[7rem]">
                      CITY
                    </div>

                    <div className="relative z-10 grid w-full gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
                      <ProductVisual
                        seed={slide.product?.slug ?? slide.eyebrow}
                        name={slide.product?.name ?? 'City Calzado Urbano'}
                        categoryName={slide.product?.category?.name ?? slide.eyebrow}
                        imageUrl={slide.product?.primaryImage?.url}
                        className="aspect-[4/4.35] min-h-[250px]"
                      />

                      <div className="rounded-[28px] border border-white/10 bg-[#101010] p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-brand-strong/82">
                          {slide.product?.category?.name ?? 'City Calzado Urbano'}
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                          {slide.product?.name ?? 'Streetwear para todos los dias'}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-white/68">
                          {slide.product?.description ??
                            'Modelos listos para combinar con tu estilo diario.'}
                        </p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-sm text-white/58">
                            Consulta talles
                          </span>
                          <span className="text-xl font-semibold text-white">
                            {slide.product ? formatCurrency(slide.product.price) : 'Nuevo ingreso'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute right-6 bottom-6 left-6 z-20 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  aria-label={`Ir al slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    'h-2.5 rounded-full transition',
                    activeSlide === index
                      ? 'w-8 bg-brand-strong'
                      : 'w-2.5 bg-white/28 hover:bg-white/42',
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Slide anterior"
                onClick={goToPreviousSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111111]/88 text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Slide siguiente"
                onClick={goToNextSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111111]/88 text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: MessageCircle,
            title: 'Atencion por WhatsApp',
            copy: 'Te respondemos directo para ayudarte con el pedido.',
          },
          {
            icon: Store,
            title: 'Retiro coordinado',
            copy: 'Confirmamos disponibilidad y retiro con el local.',
          },
          {
            icon: Ruler,
            title: 'Consulta talles',
            copy: 'Escribinos y te ayudamos a elegir el talle correcto.',
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-[#151515] p-5 shadow-[0_22px_48px_rgba(0,0,0,0.22)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/68">{item.copy}</p>
            </div>
          )
        })}
      </section>

      <section className="space-y-6">
        <SectionTitle
          eyebrow="Destacados"
          title="Modelos destacados"
          description="Zapatillas urbanas para todos los dias."
          tone="light"
        />

        {visibleProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Todavia no hay modelos destacados"
            description="En cuanto haya productos publicados, los vas a ver aqui primero."
            action={
              <Link to="/catalogo" className="text-sm font-medium text-brand-strong">
                Ver catalogo
              </Link>
            }
          />
        )}
      </section>

      <section className="space-y-5">
        <SectionTitle
          eyebrow="Categorias"
          title="Compra por categoria"
          description="Sneakers, urbanas y accesorios para encontrar rapido tu proximo par."
          tone="light"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickCategories.map((category) => (
            <Link
              key={category.id}
              to="/catalogo"
              className="rounded-[26px] border border-white/10 bg-[#151515] p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)] transition hover:border-brand-strong/30 hover:bg-[#1a1a1a]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-brand-strong/82">
                Categoria
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {category.name}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/64">
                Ver modelos y consultar disponibilidad.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#151515] p-6 shadow-[0_28px_60px_rgba(0,0,0,0.24)] sm:p-8">
          <p className="eyebrow">Instagram</p>
          <div className="mt-5 space-y-4">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Seguinos en Instagram
            </h2>
            <p className="text-lg text-brand-strong">@citycalzadourbano</p>
            <p className="max-w-lg text-sm leading-7 text-white/68">
              Mira nuevos ingresos, combinaciones urbanas y modelos que van
              entrando al local. Este bloque es visual y te lleva directo al perfil.
            </p>
          </div>

          <div className="mt-6">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'outline', size: 'lg' })}
            >
              <AtSign className="h-4 w-4" />
              Seguir en Instagram
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {instagramTiles.map((tile, index) => (
            <a
              key={tile}
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative min-h-[150px] overflow-hidden rounded-[26px] border border-white/10 bg-[#111111] p-4 shadow-[0_22px_50px_rgba(0,0,0,0.2)]"
            >
              <div
                className={cn(
                  'absolute inset-0',
                  index % 3 === 0
                    ? 'bg-[radial-gradient(circle_at_top_right,rgba(182,255,0,0.18),transparent_28%)]'
                    : index % 3 === 1
                      ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]'
                      : 'bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_32%)]',
                )}
              />
              <img
                src={cityLogo}
                alt=""
                className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-[0.08] grayscale"
              />
              <div className="relative flex h-full flex-col justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-strong/82">
                  Instagram
                </p>
                <p className="max-w-[12rem] text-lg font-semibold tracking-[-0.03em] text-white transition group-hover:text-brand-strong">
                  {tile}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="surface-panel overflow-hidden">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div className="space-y-4">
            <p className="eyebrow">WhatsApp</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Queres consultar talles o disponibilidad?
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              Escribinos y coordinamos directo con el local.
            </p>
          </div>

          {hasWhatsApp ? (
            <a
              href={buildWhatsAppUrl(
                storeSettings.whatsapp_phone,
                'Hola, quiero consultar talles y disponibilidad.',
              )}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
            >
              <MessageCircle className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          ) : (
            <div className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm text-white/72">
              WhatsApp pendiente de configurar
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
