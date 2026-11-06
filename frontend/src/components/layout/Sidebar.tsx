const menus = [
  { id: 'students', label: 'Murid' },
  { id: 'teachers', label: 'Guru' },
  { id: 'all', label: 'Kelas' },
];
interface Props {
  activePage: string;
  onNavigate: (x: string) => void;
  onLogout: () => void;
}
export default function Sidebar({ activePage, onNavigate, onLogout }: Props) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-neutral-900 p-5 text-white">
      <h1 className="mb-10 text-xl font-bold">School Management</h1>

      <p className="mb-3 text-xs font-semibold text-neutral-500">MENU UTAMA</p>

      <nav className="space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onNavigate(menu.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ${
              activePage === menu.id
                ? 'bg-neutral-700 text-white'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}>
            {menu.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto rounded-lg px-4 py-3 text-left text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white">
        Logout
      </button>
    </aside>
  );
}
