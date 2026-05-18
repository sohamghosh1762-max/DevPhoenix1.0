"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import LeadPopup from '@/components/sections/LeadPopup';
import { FloatingEnquiryCTA } from '@/components/cta/FloatingEnquiryCTA';

export default function PublicChrome() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;
  return (
    <>
      <Navbar />
      <LeadPopup />
      <FloatingEnquiryCTA />
    </>
  );
}
