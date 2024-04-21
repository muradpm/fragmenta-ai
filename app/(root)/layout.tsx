import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SidebarLogo from "@/components/sidebar-logo";
import SearchCommand from "@/components/search-command";
import OrgSwitcher from "@/components/org";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full ">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:shadow-sm md:pb-4 md:pt-5">
        <SidebarLogo />
        <OrgSwitcher />
        <SearchCommand />
        <Sidebar />
      </div>
      <main className="md:pl-64 h-full">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
