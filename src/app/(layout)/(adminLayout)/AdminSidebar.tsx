import { PathsList } from './PathsList';

export const AdminSidebar = () => {
  return (
    <aside className="sticky top-0 h-dvh w-full bg-background p-4 shadow-md">
      <PathsList />
    </aside>
  );
};
