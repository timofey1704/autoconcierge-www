FROM python:3.14-alpine
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app
RUN apk add iproute2-ss=6.17.0-r0 --no-cache && rm -rf /var/cache/apk/*
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
uv run manage.py collectstatic -c --noinput &&
uv run gunicorn --bind 0.0.0.0:8000 base.wsgi:application
EOT

COPY --chmod=755 <<EOT ./cron_1h.sh
#!/usr/bin/env sh
set -e
uv run manage.py activate_new_memberships
uv run manage.py deactivate_outdated_membership
uv run manage.py deactivate_overdue_qrs
EOT

RUN --mount=type=cache,target=/root/.cache/uv \
  --mount=type=bind,source=uv.lock,target=uv.lock \
  --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
  uv sync --frozen --no-install-workspace

COPY . /app

RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --locked

# RUN uv sync --no-managed-python --compile-bytecode --no-dev --locked
# COPY . .
EXPOSE 8000
ENTRYPOINT  ["./entrypoint.sh"]
