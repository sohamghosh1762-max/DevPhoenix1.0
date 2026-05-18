import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/Sidebar';

export const metadata: Metadata = {
  title: { template: '%s | DevPhoeniX Admin', default: 'Admin | DevPhoeniX' },
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
