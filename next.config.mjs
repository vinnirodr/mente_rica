// O GitHub Pages serve o site em /mente_rica. Fonte única do prefixo: o Next não
// aplica o basePath ao href do manifest, então a aplicação também precisa dele.
const basePath = "/mente_rica";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
