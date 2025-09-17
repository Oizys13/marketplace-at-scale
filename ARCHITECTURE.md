# Architecture

## Overview

This project implements a **marketplace platform** using **microservices** deployed on Kubernetes.

## Components

- **Listings Service** (Node.js + Express + PostgreSQL + RabbitMQ)
- **Worker Service** (Node.js worker consuming RabbitMQ messages)
- **PostgreSQL** (persistent database)
- **RabbitMQ** (message queue for async communication)

## Data Flow

1. Listings service writes to PostgreSQL.
2. Events are published to RabbitMQ.
3. Worker consumes messages from RabbitMQ.

## Kubernetes Deployment

- `postgres-deployment.yaml`
- `rabbitmq-deployment.yaml`
- `listings-deployment.yaml`
- `worker-deployment.yaml`
