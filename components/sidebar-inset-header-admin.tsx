"use client";

import findTitlesByPaths from "@/utils/find-titles-by-paths";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { navItems } from "./app-sidebar-admin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

export default function InsetHeader() {
  const pathname = usePathname();

  const paths = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => `/${segment}`);

  const titles = findTitlesByPaths(navItems, paths);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {titles.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Inicio</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            titles.map((title, index) => {
              const isLast = index === titles.length - 1;

              return (
                <Fragment key={title}>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
