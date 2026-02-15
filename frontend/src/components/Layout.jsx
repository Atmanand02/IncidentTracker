import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">
          <Link to="/">Incident Tracker</Link>
        </h1>
        <Link to="/incidents/new" className="btn btn-primary">
          New Incident
        </Link>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
