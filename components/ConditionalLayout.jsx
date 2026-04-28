"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";

const PRIVATE = ["/portail", "/pointage", "/admin"];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE.some(r => pathname.startsWith(r));
  return (
    <>
      {!isPrivate && <Nav />}
      <main>{children}</main>
      {!isPrivate && <FloatingCTA />}
      {!isPrivate && <Footer />}
    </>
  );
}
