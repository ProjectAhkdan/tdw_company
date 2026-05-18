export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  message?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
