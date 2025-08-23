export type Page = {
  path: string;
  label: string;
  isMenu: boolean;
  roles?: string[];
};

export const pages: Page[] = [
  {
    path: "/",
    label: "Hem",
    isMenu: true,
  },
  {
    path: "/dashboard/ansvarig",
    label: "Dashboard",
    isMenu: true,
    roles: ["phöz", "ansvarig"],
  },
  {
    path: "/reg-points",
    label: "➕",
    isMenu: true,
  },
];
