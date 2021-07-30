# Compile step
# ===============================================================
FROM    clux/muslrust:nightly as compiler

RUN     USER=root cargo new --bin page
WORKDIR /page

COPY    Cargo.lock .
COPY    Cargo.toml .

COPY    model ./model
COPY    page_backend ./page_backend
COPY    page_gateway ./page_gateway
COPY    hello ./hello

RUN     cargo build --release

# Final assembling step
# ===============================================================
FROM    alpine:latest

RUN     apk add --no-cache ca-certificates
RUN     apk add --no-cache libpq
RUN     apk add bash

COPY    --from=compiler /page/target/x86_64-unknown-linux-musl/release/page_gateway .
COPY    --from=compiler /page/target/x86_64-unknown-linux-musl/release/page_backend .

ENV     ROCKET_ADDRESS=0.0.0.0
ENV     ROCKET_DATABASES={postgres={url="postgres://yugabyte:yugabyte@10.111.71.185:5433/proc_production"}}

EXPOSE  8000 8001

COPY    running_script.sh running_script.sh
RUN     chmod +x running_script.sh

CMD     ["sh", "running_script.sh"]