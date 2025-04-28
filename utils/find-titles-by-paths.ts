import { navItems } from "@/components/app-sidebar";

export default function findTitlesByPaths(
  items: typeof navItems,
  paths: string[]
): string[] {
  const titles: string[] = [];

  for (const path of paths) {
    let found = false;

    for (const item of items) {
      if (item.url === path) {
        titles.push(item.title);
        found = true;
        break;
      }

      if (item.subItems) {
        const subItem = item.subItems.find((sub) => sub.url === path);
        if (subItem) {
          titles.push(subItem.title);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      titles.push("(No encontrado)");
    }
  }

  return titles;
}
