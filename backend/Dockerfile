# BUILD STAGE
FROM rust:1.78.0-alpine3.19 as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path .

# EXECUTION STAGE
FROM debian:buster-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/myapp /usr/local/bin/myapp
CMD ["myapp"]
