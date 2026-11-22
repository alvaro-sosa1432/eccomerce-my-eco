-- Run the entire file in Supabase SQL Editor after creating public.cart_items and its RLS policies.
begin;

create or replace function public.mutate_cart(
  p_user_id uuid,
  p_action text,
  p_product_id integer default null,
  p_delta integer default null,
  p_expected jsonb default null
)
returns void
language plpgsql
security invoker
set search_path = ''
as $mutate_cart$
declare
  owner_id uuid := auth.uid();
  current_cart jsonb;
  expected_count bigint;
  deleted_count bigint;
begin
  if owner_id is null or owner_id is distinct from p_user_id then
    raise exception using errcode = '42501', message = 'Cart session required';
  end if;

  -- Serialize changes made through this RPC across clients of the same account.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('cart:' || owner_id::text, 0));

  case p_action
    when 'adjust' then
      if p_product_id is null or p_product_id <= 0 or p_delta is null or p_delta not in (-1, 1) then
        raise exception using errcode = '22023', message = 'Invalid cart adjustment';
      end if;

      if p_delta = 1 then
        insert into public.cart_items as item (user_id, product_id, quantity)
        values (owner_id, p_product_id, 1)
        on conflict (user_id, product_id) do update
          set quantity = item.quantity + 1, updated_at = pg_catalog.now()
          where item.quantity between 1 and 98;
      else
        update public.cart_items as item
        set quantity = item.quantity - 1, updated_at = pg_catalog.now()
        where item.user_id = owner_id and item.product_id = p_product_id
          and item.quantity between 2 and 99;
      end if;

      if not found then
        raise exception using errcode = 'P4091', message = 'Cart quantity unavailable';
      end if;

    when 'remove' then
      if p_product_id is null or p_product_id <= 0 then
        raise exception using errcode = '22023', message = 'Invalid cart product';
      end if;

      delete from public.cart_items as item
      where item.user_id = owner_id and item.product_id = p_product_id;

      if exists (
        select 1 from public.cart_items as item
        where item.user_id = owner_id and item.product_id = p_product_id
      ) then
        raise exception using errcode = 'P4092', message = 'Cart item could not be removed';
      end if;

    when 'clear' then
      delete from public.cart_items as item where item.user_id = owner_id;

      if exists (select 1 from public.cart_items as item where item.user_id = owner_id) then
        raise exception using errcode = 'P4092', message = 'Cart could not be cleared';
      end if;

    when 'checkout' then
      select pg_catalog.jsonb_object_agg(item.product_id::text, item.quantity), pg_catalog.count(*)
      into current_cart, expected_count
      from public.cart_items as item where item.user_id = owner_id;

      if expected_count = 0 or current_cart is distinct from p_expected then
        raise exception using errcode = 'P4092', message = 'Cart changed before checkout';
      end if;

      -- Delete only the items and quantities confirmed by the client.
      delete from public.cart_items as item
      where item.user_id = owner_id and (p_expected ->> item.product_id::text) = item.quantity::text;

      get diagnostics deleted_count = row_count;
      if deleted_count <> expected_count
         or exists (select 1 from public.cart_items as item where item.user_id = owner_id) then
        raise exception using errcode = 'P4092', message = 'Cart changed during checkout';
      end if;

    else
      raise exception using errcode = '22023', message = 'Invalid cart action';
  end case;
end;
$mutate_cart$;

revoke all on function public.mutate_cart(uuid, text, integer, integer, jsonb) from public, anon, service_role;
grant execute on function public.mutate_cart(uuid, text, integer, integer, jsonb) to authenticated;

notify pgrst, 'reload schema';

commit;
