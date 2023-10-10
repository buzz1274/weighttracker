FROM python:3.11-slim-bullseye AS base-image

ARG ENVIRONMENT

ENV POETRY_VERSION=1.4.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTIONS=1 \
    WORKDIR_PATH="/opt/weighttracker" \
    VENV_PATH="/opt/weighttracker/.venv" \
    ENVIRONMENT=${ENVIRONMENT}

ENV PATH="$POETRY_HOME/bin:/$VENV_PATH/bin:$PATH"

FROM base-image AS builder-image

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    sudo \
    vim \
    curl \
    postgresql-client \
    nodejs

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR $WORKDIR_PATH
COPY pyproject.toml pyproject.toml

RUN poetry install

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["sleep infinity"]