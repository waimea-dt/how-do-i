# Simplified TLS Handshake

TLS uses a hybrid model:

1. Asymmetric cryptography to establish trust and shared secret material
2. Symmetric cryptography for fast encrypted data transfer

## Default

<tls></tls>

Use top-right toggle to switch between TLS 1.2 and TLS 1.3 flow.

## Different domain

<tls domain="portal.school.nz"></tls>

## Force TLS 1.2 mode

<tls version="1.2"></tls>

## Force TLS 1.3 mode

<tls version="1.3"></tls>

## With interception view

<tls intercept></tls>

## Custom domain + interception

<tls domain="payments.school.nz" intercept></tls>
