import PrincipleDetail from "./PrincipleDetail";

export function generateStaticParams() {
  return Array.from({ length: 13 }, (_, i) => ({ id: String(i + 1) }));
}

export default function PrincipleDetailPage() {
  return <PrincipleDetail />;
}
