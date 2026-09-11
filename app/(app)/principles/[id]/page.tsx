import PrincipleDetail from "./PrincipleDetail";

export function generateStaticParams() {
  return Array.from({ length: 13 }, (_, i) => ({ id: String(i + 1) }));
}

// Só existem 13 princípios: qualquer outro id cai no not-found.tsx em vez de
// renderizar sob demanda e mostrar o "Princípio não encontrado" interno.
export const dynamicParams = false;

export default function PrincipleDetailPage() {
  return <PrincipleDetail />;
}
