"use client";
import { useState } from "react";
import { SapMark } from "./SapBadge";
import { DECLARATION_SAP } from "../lib/data";

/**
 * Logo officiel "Services à la Personne".
 * Affiche /public/sap-officiel.png si présent (l'utilisateur y dépose le fichier),
 * sinon repli propre sur le badge SapMark maison + mention — jamais d'image cassée.
 *
 * variant:
 *  - "logo"  : juste le logo (héros, bandeau)
 *  - "badge" : logo + libellé "Déclaré SAP · N°…"
 */
export default function SapOfficiel({ height = 96, variant = "badge" }) {
  const [err, setErr] = useState(false);

  const logo = err ? (
    <SapMark size={height} />
  ) : (
    <img
      src="/sap-officiel.jpg"
      alt="Logo officiel Services à la Personne"
      onError={() => setErr(true)}
      style={{ height, width: "auto", display: "block", objectFit: "contain" }}
    />
  );

  if (variant === "logo") return logo;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
      {logo}
      <div style={{ lineHeight: 1.3, textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1A2D3D" }}>
          Organisme déclaré Services à la Personne
        </div>
        <div style={{ fontSize: 12.5, color: "#64748B", fontWeight: 600 }}>
          N° {DECLARATION_SAP} · crédit d'impôt 50 %
        </div>
      </div>
    </div>
  );
}
