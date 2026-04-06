delete from public.news_subscriptions
where news_id in (select id from public.news where slug = 'bienvenida');

delete from public.news
where slug = 'bienvenida';