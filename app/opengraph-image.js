import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Renwize — Subscription tracker and renewal reminders";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1E254A 0%, #0f172a 55%, #1FA16833 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Renwize
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#cbd5e1",
            marginTop: 20,
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          Track subscriptions, see spend in Naira & USD, and get reminders before renewals.
        </div>
      </div>
    ),
    { ...size },
  );
}
