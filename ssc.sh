#!/bin/sh

# requires openssl > 1.1.1
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout selfssl.key -out selfssl.crt -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:10.0.0.1,IP:127.0.0.1"
