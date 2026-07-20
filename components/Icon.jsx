"use client";
import {
  SprayCan, CookingPot, ShoppingCart, FileText, Leaf, Boxes,
  KeyRound, BedDouble, ClipboardCheck, Trees, Waves, Wrench, CalendarDays,
  MessageCircle, Check, CheckCircle2, Star, BadgeCheck, ShieldCheck, Phone,
  Clock, MapPin, CreditCard, Euro, ArrowRight, Heart, Sparkles, Search,
  Scissors, Users, TrendingUp, Camera, Rocket, Lock, Lightbulb, HelpCircle,
  Truck, Mail, Sun, Home, Building2, Calculator, BadgePercent, Handshake,
  ThumbsUp, Plane, Moon, CalendarClock, Wallet, Gem,
} from "lucide-react";

/**
 * Icon — icône vectorielle pro (lucide) via un nom sémantique.
 *   <Icon name="menage" size={24} color="#0DA9A4" />
 * Les noms correspondent aux id de services (entretien/repas/…) + concepts UI.
 */
const MAP = {
  // Prestations (alignées sur les id de lib/data.js SERVICES)
  entretien: SprayCan, menage: SprayCan, repas: CookingPot, courses: ShoppingCart,
  assistance: FileText, admin: FileText, jardinage: Leaf, rangement: Boxes,
  // Conciergerie
  cle: KeyRound, linge: BedDouble, etatdeslieux: ClipboardCheck, exterieur: Trees,
  piscine: Waves, maintenance: Wrench, annonces: CalendarDays, chat: MessageCircle, voyageurs: MessageCircle,
  // Confiance / UI
  check: Check, checkCircle: CheckCircle2, star: Star, sap: BadgeCheck, shield: ShieldCheck,
  phone: Phone, clock: Clock, pin: MapPin, credit: CreditCard, euro: Euro, wallet: Wallet,
  arrow: ArrowRight, heart: Heart, sparkles: Sparkles, search: Search, scissors: Scissors,
  users: Users, trending: TrendingUp, camera: Camera, rocket: Rocket, lock: Lock,
  conseils: Lightbulb, faq: HelpCircle, mail: Mail, sun: Sun, home: Home, building: Building2,
  livraison: Truck, calc: Calculator, percent: BadgePercent, handshake: Handshake,
  thumbsup: ThumbsUp, plane: Plane, moon: Moon, calendar: CalendarClock, gem: Gem,
};

export default function Icon({ name, size = 22, color = "currentColor", strokeWidth = 1.8, style, ...rest }) {
  const C = MAP[name] || Sparkles;
  return <C size={size} color={color} strokeWidth={strokeWidth} style={{ display: "block", flexShrink: 0, ...style }} {...rest} />;
}

/**
 * IconTile — tuile d'icône premium en relief (le "3D") : dégradé, ombre portée,
 * reflet supérieur + ombre interne pour un rendu bombé/glassy.
 *   <IconTile name="menage" from="#0DA9A4" to="#12B5B0" />
 */
export function IconTile({ name, size = 54, icon = 24, from = "#0DA9A4", to = "#12B5B0", radius = 16, color = "#fff", style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(145deg, ${from}, ${to})`,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      boxShadow: `0 12px 26px ${from}40, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.14)`,
      ...style,
    }}>
      {/* Reflet vitré */}
      <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: radius, background: "linear-gradient(160deg, rgba(255,255,255,0.32), transparent 55%)", pointerEvents: "none" }} />
      <Icon name={name} size={icon} color={color} strokeWidth={2} style={{ position: "relative", zIndex: 1 }} />
    </div>
  );
}
