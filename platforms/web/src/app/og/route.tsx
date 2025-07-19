import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

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
          alt="ServerHeaven background"
          width={size.width}
          height={size.height}
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
          <span style={{ position: "absolute", top: "-2px", left: "2px", fontSize: 96, color: "rgba(34, 211, 238, 0.8)", fontWeight: 700 }}>SERVER HEAVEN</span>
          <span style={{ position: "absolute", top: "2px", left: "-2px", fontSize: 96, color: "rgba(52, 211, 153, 0.8)", fontWeight: 700 }}>SERVER HEAVEN</span>
          <span
            style={{
              position: "relative",
              fontSize: 96,
              color: "#ffffff",
              textShadow: "0 0 10px rgba(52, 211, 153, 0.6)",
              fontWeight: 700,
            }}
          >
            SERVER HEAVEN
          </span>
        </div>
        {/* Subtitle */}
        <span style={{
          fontSize: 48,
          color: "#34D399",
          marginTop: 20,
          fontWeight: 700,
        }}>
          Minecraft Matchmaking
        </span>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
} 