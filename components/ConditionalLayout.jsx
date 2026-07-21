"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";
import CookieBanner from "./CookieBanner";
import ScrollProgressBar from "./ScrollProgressBar";
import PageTransition from "./PageTransition";

const PRIVATE = ["/portail", "/pointage", "/admin"];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE.some(r => pathname.startsWith(r));
  return (
    <>
      {!isPrivate && <a href="#main" className="skip-link">Aller au contenu</a>}
      {!isPrivate && <ScrollProgressBar />}
      {!isPrivate && <Nav />}
      <main id="main"><PageTransition>{children}</PageTransition></main>
      {!isPrivate && <FloatingCTA />}
      {!isPrivate && <Footer />}
      {!isPrivate && <CookieBanner />}
    </>
  );
}
