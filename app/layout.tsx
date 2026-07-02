import './globals.css';
import type { Metadata } from 'next';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ALBA | Associação Luso-Brasileira de Ayurveda',
    template: '%s | ALBA',
  },
  description: 'Associação Luso-Brasileira de Ayurveda. Encontre terapeutas credenciados, cursos de formação, artigos sobre saúde integral e terapias ayurvédicas em Portugal e Brasil.',
  keywords: ['ayurveda', 'saúde integral', 'terapeutas', 'medicina alternativa', 'doshas', 'panchakarma', 'bem-estar', 'holístico'],
  authors: [{ name: 'ALBA' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'ALBA - Associação Luso-Brasileira de Ayurveda',
    title: 'ALBA | Associação Luso-Brasileira de Ayurveda',
    description: 'Encontre terapeutas credenciados, cursos de formação e terapias ayurvédicas em Portugal e Brasil.',
    images: [
      {
        url: 'https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png',
        width: 800,
        height: 600,
        alt: 'ALBA - Associação Luso-Brasileira de Ayurveda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALBA | Associação Luso-Brasileira de Ayurveda',
    description: 'Encontre terapeutas credenciados, cursos de formação e terapias ayurvédicas em Portugal e Brasil.',
    images: ['https://www.ayurvedica.org/wp-content/uploads/2019/05/miniLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* O children representa todo o conteúdo das suas páginas (Home, Cursos, etc) */}
        {children}
        
        {/* Adicione o Footer global aqui */}
        <Footer />
      </body>
    </html>
  );
}
