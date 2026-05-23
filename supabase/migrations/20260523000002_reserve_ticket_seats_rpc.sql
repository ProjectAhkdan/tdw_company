-- Atomic ticket seat reservation — prevents race condition / overbooking
create or replace function reserve_ticket_seats(p_ticket_id uuid, p_quantity int)
returns boolean language plpgsql security definer as $$
declare
  v_remaining int;
begin
  -- Lock row to prevent concurrent updates
  select (quota - sold) into v_remaining
  from tickets
  where id = p_ticket_id
  for update;

  if v_remaining is null or v_remaining < p_quantity then
    return false;
  end if;

  update tickets
  set sold = sold + p_quantity
  where id = p_ticket_id;

  return true;
end;
$$;
