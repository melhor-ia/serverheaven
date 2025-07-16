import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET(request: Request) {
  const { headers } = request;
  // Derive origin so local images resolve correctly when deployed
  const host = headers.get("x-forwarded-host") || headers.get("host") || "";
  const protocol = headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  const imageUrl = `${origin}/parallaxe-banner.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {/* Background image */}
        <img
          src={imageUrl}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 80%)",
          }}
        />
        {/* Glitch Title */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ position: "absolute", top: -2, left: 2, fontSize: 96, color: "#22D3EE", opacity: 0.8 }}>SERVER HEAVEN</span>
          <span style={{ position: "absolute", top: 2, left: -2, fontSize: 96, color: "#F472B6", opacity: 0.8 }}>SERVER HEAVEN</span>
          <span
            style={{
              position: "relative",
              fontSize: 96,
              backgroundClip: "text",
              backgroundImage: "linear-gradient(90deg, #34D399, #10B981)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            SERVER HEAVEN
          </span>
        </div>
        {/* Subtitle */}
        <span style={{
          fontSize: 36,
          color: "hsl(0 0% 90%)",
          marginTop: 20,
          textTransform: "uppercase",
          letterSpacing: "8px",
          fontWeight: 400,
          textShadow: "0 0 15px rgba(52, 211, 153, 0.5)"
        }}>
          matchmaking community
        </span>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
} 