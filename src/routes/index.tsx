import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { CartPage } from '@/pages/public/CartPage'
import { CatalogPage } from '@/pages/public/CatalogPage'
import { CheckoutPage } from '@/pages/public/CheckoutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalogo',
        element: <CatalogPage />,
      },
      {
        path: 'catalogo/:slug',
        element: <ProductDetailPage />,
      },
      {
        path: 'carrito',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'contacto',
        element: <ContactPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
