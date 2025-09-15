import { NavLink, Outlet } from 'react-router'

export function CoreLayout({ links }: { links: { label: string; to: string }[] }) {
  return (
    <div className="h-full flex flex-col justify-between items-stretch">
      <header className="bg-secondary/50 px-4 py-2">
        <div className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink key={link.to} className={({ isActive }) => (isActive ? 'font-bold' : '')} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-2 lg:p-4">
        <Outlet />
      </main>
    </div>
  )
}
