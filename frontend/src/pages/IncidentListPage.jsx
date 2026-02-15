import { useListParams } from '../hooks/useListParams';
import { useIncidents } from '../hooks/useIncidents';
import Filters from '../components/Filters';
import IncidentTable from '../components/IncidentTable';
import Pagination from '../components/Pagination';

export default function IncidentListPage() {
  const {
    page, limit, service, severity, status, search, sortBy, sortOrder,
    setParam, setSort, setPage,
  } = useListParams();

  const queryParams = { page, limit, service, severity, status, search, sortBy, sortOrder };
  const { data, isLoading, isFetching, isError, error, refetch } = useIncidents(queryParams);

  const total = data?.total ?? 0;
  const incidents = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="page-list">
      <Filters
        service={service}
        severity={severity}
        status={status}
        search={search}
        onServiceChange={(v) => setParam('service', v)}
        onSeverityChange={(v) => setParam('severity', v)}
        onStatusChange={(v) => setParam('status', v)}
        onSearchChange={(v) => setParam('search', v)}
        onFilterClick={() => { setParam('page', 1); refetch(); }}
      />

      {isError && (
        <div className="list-error" role="alert">
          <p>Failed to load incidents: {error?.message || 'Unknown error'}.</p>
          <button type="button" className="btn btn-secondary" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {(isLoading || isFetching) && (
        <div className="list-loading" aria-busy="true">
          <div className="table-skeleton" />
          <p>Loading incidents…</p>
        </div>
      )}

      {!isError && !isLoading && !isFetching && incidents.length === 0 && (
        <div className="list-empty">
          <p>No incidents match your filters.</p>
        </div>
      )}

      {!isError && !isLoading && !isFetching && incidents.length > 0 && (
        <>
          <IncidentTable incidents={incidents} sortBy={sortBy} sortOrder={sortOrder} onSort={setSort} />
          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
