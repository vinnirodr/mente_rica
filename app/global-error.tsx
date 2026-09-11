"use client";

// Último recurso: captura erros que quebram o próprio root layout, por isso
// precisa renderizar <html>/<body> e não pode depender do CSS da aplicação.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "0 1.5rem",
          textAlign: "center",
          background: "#1A1A2E",
          color: "#F5F5F7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Algo deu errado</h1>
        <p style={{ maxWidth: "20rem", fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
          Não foi possível carregar o MindRich. Tente novamente em instantes.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            border: 0,
            borderRadius: "1rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            background: "#D4AF37",
            color: "#1A1A2E",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
