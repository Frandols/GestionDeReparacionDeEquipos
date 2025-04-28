import { AppSidebar } from "@/components/app-sidebar-admin";
import InsetHeader from "@/components/sidebar-inset-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user === null) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.username || "Name",
          email: user.emailAddresses[0].emailAddress || "example@xyz.com",
          avatarUrl: "/placeholder.svg",
        }}
      />
      <SidebarInset>
        <InsetHeader />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
