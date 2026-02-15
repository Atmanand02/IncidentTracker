import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE } from '../lib/constants';

export function useListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10)));
  const service = searchParams.get('service') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') === 'asc' ? 'asc' : 'desc';

  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value == null || value === '') next.delete(key);
      else next.set(key, String(value));
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  };

  const setSort = (field, order) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', field);
      next.set('sortOrder', order);
      next.set('page', '1');
      return next;
    });
  };

  const setPage = (p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(Math.max(1, p)));
      return next;
    });
  };

  return {
    page, limit, service, severity, status, search, sortBy, sortOrder,
    setParam, setSort, setPage,
  };
}
