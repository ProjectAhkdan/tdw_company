-- Hitung total revenue & jumlah order PAID di DB (bukan di JS)
create or replace function get_paid_orders_stats()
returns json language sql stable security definer as $$
  select json_build_object(
    'total_amount', coalesce(sum(total_amount), 0),
    'order_count',  count(*)
  ) from orders where status = 'PAID';
$$;
