import { Identity, signout } from "@/lib/apis/payments";
import { hasRole, Roles } from "@/lib/apis/payments/models";
import useUser from "@/lib/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";

interface SideBarPropos {
  identity: Identity;
}

interface NavItem {
  href: string;
  text: string;
  icon: string[];
  // Si és cert, només es marca actiu quan la ruta coincideix exactament.
  exact?: boolean;
}

const mainItems: NavItem[] = [
  {
    href: "/admin",
    text: "Administració",
    exact: true,
    icon: ["M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"],
  },
  {
    href: "/",
    text: "Pagar",
    exact: true,
    icon: ["M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"],
  },
  {
    href: "/admin/people",
    text: "Persones",
    icon: ["M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"],
  },
  {
    href: "/admin/events",
    text: "Esdeveniments",
    icon: ["M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"],
  },
  {
    href: "/admin/groups",
    text: "Grups",
    icon: [
      "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z",
      "M6 6h.008v.008H6V6z",
    ],
  },
];

// TODO: Get list of pages from server
const superUserItems: NavItem[] = [
  {
    href: "/admin/courses",
    text: "Cursos",
    icon: ["M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"],
  },
  {
    href: "/admin/ougrouprelations",
    text: "Relacions UO",
    icon: ["M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"],
  },
  {
    href: "/admin/tasks",
    text: "Sincronització",
    icon: ["M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"],
  },
];

const NavIcon = ({ paths }: { paths: string[] }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6 shrink-0"
  >
    {paths.map((d, idx) => (
      <path key={idx} strokeLinecap="round" strokeLinejoin="round" d={d} />
    ))}
  </svg>
);

// Les etiquetes només es veuen amb la barra desplegada.
const labelClass = "opacity-0 transition-opacity group-hover/sidebar:opacity-100";

const itemClass = (active: boolean) =>
  `relative flex items-center gap-4 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors ${active
    ? "bg-white/10 text-white before:absolute before:-left-2 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-brand-400"
    : "text-slate-400 hover:bg-white/5 hover:text-white"
  }`;

export const SideBar = ({ identity }: SideBarPropos) => {
  const router = useRouter();

  const onSignout = async () => {
    await signout();
    window.location.replace("/admin/signin");
  };

  const isActive = ({ href, exact }: NavItem) =>
    exact ? router.pathname === href : router.pathname === href || router.pathname.startsWith(`${href}/`);

  const items = hasRole(identity.role, Roles.SuperUser) ? [...mainItems, ...superUserItems] : mainItems;
  const initial = (identity.givenName || identity.username || "?").charAt(0).toUpperCase();

  return (
    <nav className="fixed inset-y-0 left-0 z-50 print:hidden">
      <div className="group/sidebar flex h-full w-16 flex-col overflow-hidden bg-slate-900 transition-[width,box-shadow] duration-200 ease-out hover:w-60 hover:shadow-2xl">
        <div className="flex h-16 min-w-max items-center gap-3 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white opacity-0 transition-opacity group-hover/sidebar:opacity-100">
            {process.env.SCHOOL_NAME ?? "Pagaments"}
          </span>
        </div>

        <ul className="mt-4 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3">
          {items.map((x) => (
            <li key={x.href} className="min-w-max">
              <Link href={x.href} title={x.text} className={itemClass(isActive(x))}>
                <NavIcon paths={x.icon} />
                <span className={labelClass}>{x.text}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-2 flex min-w-max items-center gap-4 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-200">
              {initial}
            </div>
            <div className="text-sm leading-tight opacity-0 transition-opacity group-hover/sidebar:opacity-100">
              <p className="font-medium text-white">{identity.givenName}</p>
              <p className="text-xs text-slate-400">{identity.username}</p>
            </div>
          </div>
          <button
            type="button"
            title="Tancar sessió"
            onClick={onSignout}
            className={`${itemClass(false)} w-full min-w-max hover:!bg-red-500/10 hover:!text-red-300`}
          >
            <NavIcon paths={["M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"]} />
            <span className={labelClass}>Tancar sessió</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

interface ContainerPropos {
  children: React.ReactElement;
}

export const Container = ({ children }: ContainerPropos) => {
  const { user, loading } = useUser();
  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen">
      <SideBar identity={user} />
      <div className="ml-16 max-h-screen min-w-0 flex-1 overflow-y-auto print:ml-0 print:max-h-none">
        {children}
      </div>
    </div>
  );
};
