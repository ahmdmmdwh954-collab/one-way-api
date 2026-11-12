FROM node:24-bookworm-slim
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY --chown=node:node backend ./backend
COPY --chown=node:node supabase-ca.crt cloud_start.cjs ./
ENV NODE_ENV=production
ENV PORT=10000
ENV FLEETOPS_DB_DRIVER=postgres
ENV FLEETOPS_AUTH_MODE=supabase
ENV FLEETOPS_SEED_DEMO=false
ENV PGSSLROOTCERT=/app/supabase-ca.crt
ENV SUPABASE_URL=https://kpgjxpuisgjislwedbka.supabase.co
ENV SUPABASE_PUBLISHABLE_KEY=sb_publishable_cfT2W53MhzP6miZ2wpHKDw_w2aVsvLf
USER node
EXPOSE 10000
CMD ["node", "cloud_start.cjs"]
