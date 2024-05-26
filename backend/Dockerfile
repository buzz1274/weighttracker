FROM python:3.11-slim-bookworm AS base-image

ARG ENVIRONMENT

ENV POETRY_VIRTUALENVS_IN_PROJECT=false \
    #POETRY_VIRTUALENVS_PATH="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTIONS=1 \
    WORKDIR_PATH="/opt/weighttracker.zz50.co.uk" \
    ENVIRONMENT=${ENVIRONMENT}

ENV PATH="$POETRY_HOME/bin:$PATH"

FROM base-image AS builder-image

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    apt-utils \
    sudo \
    vim \
    curl \
    postgresql-client

RUN pip install --no-cache-dir --upgrade pip poetry

WORKDIR $WORKDIR_PATH

COPY pyproject.toml .
RUN poetry install

COPY . .

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["sleep infinity"]
