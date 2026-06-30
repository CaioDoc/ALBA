import './globals.css';
import type { Metadata } from 'next';
import { Footer } from '../components/Footer'; // <-- Importe o Footer aqui

export const metadata: Metadata = {
  title: 'ALBA | Associação Luso-Brasileira de Ayurveda',
  description: 'Promovendo o conhecimento milenar para a saúde integral.',
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
