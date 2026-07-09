# rabbitmq-lab

A hands-on learning repo for exploring **RabbitMQ** — working through the official documentation and tutorials to build practical intuition for message brokers and async communication patterns.

This isn't a production project — it's a sandbox for testing concepts (queues, exchanges, routing, producers/consumers) before applying them in real systems.

---

## 🧱 What's in here

- **RabbitMQ broker** (`rabbitmq:management` image), with the management UI enabled for visually inspecting queues, exchanges, and message flow
- **App container** — a lightweight environment for running producer/consumer scripts against the broker, kept alive for interactive use rather than running as a long-lived service

## 🛠️ Services & Ports

| Service | Purpose | Port(s) |
|---|---|---|
| `rabbitmq` | Message broker | `5672` (AMQP) / `15672` (Management UI) |
| `app` | Sandbox container for running scripts against RabbitMQ | — |

## 🚀 Getting started

```bash
docker compose up -d
```

1. Open the **Management UI** at `http://localhost:15672` (`guest` / `guest`) to watch queues, exchanges, and messages in real time.
2. Exec into the app container to run scripts against the broker:
   ```bash
   docker exec -it rabbitmq_app sh
   ```
3. From there, follow along with [RabbitMQ's official tutorials](https://www.rabbitmq.com/tutorials) — this repo is meant to be experimented with, not read.

## 📌 Why this exists

Message brokers show up constantly in backend/DevOps work, but reading about them only gets you so far — this repo is where I actually ran the tutorials, broke things, and watched message flow happen in the management UI instead of just imagining it.

## ⚠️ Note

Default credentials (`guest`/`guest`) are used throughout for local learning purposes only — not meant for anything beyond `localhost`.
