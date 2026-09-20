export type AppTab = 'today' | 'exercises' | 'progress' | 'profile';

type BottomNavProps = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

const items: Array<{ id: AppTab; icon: string; label: string }> = [
  { id: 'today', icon: '⌂', label: 'Hoje' },
  { id: 'exercises', icon: '◇', label: 'Exercícios' },
  { id: 'progress', icon: '↗', label: 'Progresso' },
  { id: 'profile', icon: '◎', label: 'Perfil' },
];

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
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
