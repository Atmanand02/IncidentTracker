import { useNavigate } from 'react-router-dom';
import { formatDate } from '../lib/utils';

export default function IncidentTable({ incidents, sortBy, sortOrder, onSort }) {
  const navigate = useNavigate();

  const handleSort = (field) => {
    const nextOrder =
      sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, nextOrder);
  };

  const sortIcon = (field) => {
    if (sortBy !== field) return ' ⇅';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-wrap">
      <table className="incident-table">
        <thead>
          <tr>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('title')}>
                Title{sortIcon('title')}
              </button>
            </th>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('service')}>
                Service{sortIcon('service')}
              </button>
            </th>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('severity')}>
                Severity{sortIcon('severity')}
              </button>
            </th>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('status')}>
                Status{sortIcon('status')}
              </button>
            </th>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('createdAt')}>
                Created At{sortIcon('createdAt')}
              </button>
            </th>
            <th>
              <button type="button" className="th-sort" onClick={() => handleSort('owner')}>
                Owner{sortIcon('owner')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr
              key={inc.id}
              onClick={() => navigate(`/incidents/${inc.id}`)}
              className="incident-row"
            >
              <td>{inc.title}</td>
              <td>{inc.service}</td>
              <td>{inc.severity}</td>
              <td>{inc.status}</td>
              <td>{formatDate(inc.createdAt)}</td>
              <td>{inc.owner || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
