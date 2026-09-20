export type AppTab = 'today' | 'exercises' | 'progress' | 'profile';

type BottomNavProps = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

const items: Array<{ id: AppTab; label: string }> = [
  { id: 'today', label: 'Hoje' },
  { id: 'exercises', label: 'Exercícios' },
  { id: 'progress', label: 'Progresso' },
  { id: 'profile', label: 'Perfil' },
];

function NavIcon({ id }: { id: AppTab }) {
  if (id === 'today') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-8Z" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (id === 'exercises') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 9v6M8 7v10M16 7v10M19 9v6M8 12h8" />
      </svg>
    );
  }

  if (id === 'progress') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18V9M12 18V5M19 18v-7" />
        <path d="m5 8 7-4 7 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
    </svg>
  );
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.id === active ? 'bottom-nav__item is-active' : 'bottom-nav__item'}
          aria-current={item.id === active ? 'page' : undefined}
          onClick={() => onChange(item.id)}
        >
          <NavIcon id={item.id} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
