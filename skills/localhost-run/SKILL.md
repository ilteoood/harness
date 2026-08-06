---
name: localhost-run
description: >
  Expose local HTTP, HTTPS, and TLS applications to the public internet through
  localhost.run SSH tunnels. Use when the user wants to share a locally running
  app, demo work in progress, test webhooks, access a local server from a
  remote device, set up a Custom Domain, tunnel non-HTTP protocols, or
  troubleshoot an existing localhost.run tunnel. Triggers on phrases like
  "expose my localhost", "make my local server public", "share my dev server",
  "tunnel my local app", "ngrok alternative", or any localhost.run reference.
metadata:
  source: https://localhost.run/docs/
  author: ilteoood
  version: "1.0.0"
---

# localhost.run

[localhost.run](https://localhost.run) is a client-less tunneling service that
makes locally running HTTP, HTTPS, or TLS applications reachable from the
public internet. There is no client to install and no account needed for the
free tier — it works over plain SSH, which is already available on most
operating systems.

## When to use this skill

Use this skill when the user wants to:

- Share a locally running app with someone (preview link, demo, QA)
- Receive webhooks (Stripe, GitHub, Twilio, etc.) on a `localhost` dev server
- Test an app from a phone or another device on a different network
- Tunnel a database or other non-HTTP protocol through a Custom Domain
- Set up a Custom Domain on localhost.run
- Diagnose an existing localhost.run tunnel that is broken, slow, or unstable
- Replace tools like ngrok, Cloudflare Tunnel, or localtunnel

## Quick start

Expose a local app on port `8080`:

```bash
ssh -R 80:localhost:8080 localhost.run
```

The command prints a public URL (something like
`https://<random>.lhr.life`) that forwards HTTP and HTTPS traffic to
`localhost:8080`. Keep the SSH session open; the tunnel dies when it closes.

Other common ports:

```bash
ssh -R 80:localhost:3000 localhost.run   # Node / React dev server
ssh -R 80:localhost:5000 localhost.run   # Flask / general
ssh -R 80:localhost:8000 localhost.run   # Django / general
```

## Command structure

```
ssh -R [customdomain:]bindport:host:hostport localhost.run
```

| Field          | Meaning                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `customdomain` | Optional. Reserved for Custom Domain users; pass the full domain here. |
| `bindport`     | `80` for HTTP (HTTPS auto-provided), `443` for TLS passthrough.        |
| `host`         | Local hostname. Usually `localhost`. Use `127.0.0.1` if IPv6 misbehaves. |
| `hostport`     | Local port your app listens on.                                         |

If `localhost:8080` does not connect, try `127.0.0.1:8080` — some OSes
default `localhost` to IPv6 `[::1]` while frameworks bind to IPv4 only.

### SSH options

Forwarded `ssh -o` flags work normally. Useful ones:

```bash
# Keep the tunnel alive across NAT/router timeouts
ssh -o ServerAliveInterval=60 -R 80:localhost:8080 localhost.run

# Background it with autossh for auto-reconnect
autossh -M 0 -R 80:localhost:8080 localhost.run
```

## Output formats

The server prints one or more URLs. Pick a machine-readable form when
parsing:

```bash
# Human-readable (default)
ssh -R 80:localhost:8080 localhost.run -- --output text

# JSON
ssh -R 80:localhost:8080 localhost.run -- --output json
```

Pass anything after `--` to forward flags to localhost.run rather than ssh.

## HTTP tunnels

`bindport 80` is the default mode. localhost.run:

- Forwards HTTP traffic to your app
- Automatically generates an `https://` endpoint with a managed certificate
- Injects proxy headers so frameworks detect the original scheme/host/IP:
  - `X-Forwarded-For`
  - `X-Forwarded-Host`
  - `X-Forwarded-Proto`
  - `Forwarded` (RFC 7239)

Disable header injection if a downstream proxy already sets them:

```bash
ssh -R 80:localhost:8080 localhost.run -- --no-inject-http-proxy-headers
```

Best practice: configure the local app to **require HTTPS** — it is given
the correct scheme through the injected headers, so trusted clients see the
right URLs and assets.

### Proxy protocol

For apps that consume the HAProxy proxy protocol instead of `X-Forwarded-*`,
choose the wire version:

```bash
ssh -R 80:localhost:8080 localhost.run -- --proxy-protocol-header-version v2
# v1 is the default; v2 is binary and slightly faster
```

## TLS passthrough

For non-HTTP protocols (PostgreSQL, SSH-over-TLS, custom TCP) where the
application must see raw TLS bytes and validate the certificate itself:

```bash
ssh -R 443:localhost:8443 localhost.run
```

- Your app is responsible for providing and validating its own TLS cert
- Currently **requires a Custom Domain** (free `lhr.life` domains do not
  expose passthrough endpoints)

If you do not want to manage certificates, use an HTTP tunnel instead —
localhost.run handles TLS termination.

## Custom domains

The free tier rotates domain names regularly. For a stable URL, sign up for
the Custom Domain plan at $9/month billed annually via
[https://admin.localhost.run](https://admin.localhost.run). Two options:

1. **Use your own domain** — bring DNS, get a stable URL
2. **Use an `lhr.rocks` subdomain** — no DNS to configure, first come first served

### Connect with a custom domain

```bash
ssh -R yourdomain.com:80:localhost:8080 plan@localhost.run
```

Note the `plan@` SSH user. The connection is refused on the default user.

### DNS setup

1. Add a TXT record at `_lhr.yourdomain.com` proving ownership
2. Either:
   - **Apex domain** (`example.com`): three A records
     - `54.161.197.247`
     - `54.82.85.249`
     - `35.171.254.69`
   - **Subdomain** (`app.example.com`): one CNAME to `cd.localhost.run`
3. Add a wildcard CNAME `*.yourdomain.com → cd.localhost.run` to unlock
   unlimited subdomains (`api.yourdomain.com`, `web.yourdomain.com`, …)

Limits: up to 5 simultaneous tunnels per plan; subdomain count is bounded
by Let's Encrypt certificate rate limits.

Manage billing, add SSH keys, change or cancel domains at
[https://admin.localhost.run](https://admin.localhost.run).

## Forever free tier

No client, no signup required for short-lived tunnels. Two intentional
restrictions to deter phishing:

1. Domain names change regularly (the URL printed on connect is not stable)
2. There is a speed limit

To get a longer-lasting free domain, sign up at admin.localhost.run and
upload an SSH public key. The key binds a stable subdomain to your machine.

Generate a key if you do not have one:

```bash
ssh-keygen -t ed25519
# Upload ~/.ssh/id_ed25519.pub to https://admin.localhost.run
```

Custom Domain plans are not subject to either restriction.

## Tunnel my <thing>

Common patterns documented on the site:

### WordPress

WordPress stores the site URL in the database, so rotating free domains
break it. Either:

- Use a Custom Domain (recommended for any WordPress site)
- Or with a free domain, install `relative-url` and set both `WP_HOME` and
  `WP_SITEURL` to `'https://' . $_SERVER['HTTP_HOST']`

### Web frameworks

If the browser dev tools show requests still going to `localhost:PORT`, the
framework is generating absolute URLs from the request and ignoring proxy
headers. Configure the framework's "trusted proxy" / "reverse proxy" mode
to honor `X-Forwarded-Proto` and `X-Forwarded-Host`. Most frameworks
(Fastify, Express, Next.js, Rails, Django, Flask) have this as a setting
or middleware.

### SSH servers (Custom Domain only)

Tunneling SSH requires a Custom Domain plus [stunnel](https://www.stunnel.org/)
on the client to wrap TCP in TLS:

1. Open a localhost.run tunnel from the SSH server
2. Install stunnel on the client machine
3. Configure stunnel to accept local connections and forward them over TLS
   to the custom domain
4. Run the SSH client against the local stunnel endpoint

## Security

- **SSH transport**: end-to-end encrypted between localhost.run and your
  local app regardless of HTTP/TLS settings
- **HTTP tunnels**: HTTPS endpoints are auto-issued; localhost.run handles
  certificate management. Configure the local app to require HTTPS via the
  injected `X-Forwarded-Proto` header
- **TLS passthrough**: localhost.run does not decrypt the traffic; your app
  validates certificates directly

## Troubleshooting

| Symptom                                                  | Fix                                                                                                                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Permission denied (publickey)` on the free tier         | Use the `nokey` user: `ssh -R 80:localhost:8080 nokey@localhost.run`                                                                                                  |
| Custom domain connection refused                         | Use the `plan` user: `ssh -R yourdomain.com:80:localhost:8080 plan@localhost.run`                                                                                    |
| Free tunnel URL keeps changing                           | Add an SSH key at admin.localhost.run and avoid the `nokey` user                                                                                                       |
| `connect_to localhost port 8080: failed`                 | Local app is not reachable on that port — verify with `curl http://localhost:8080` from the same machine                                                              |
| Tunnel drops after a few minutes                         | Add `ssh -o ServerAliveInterval=60`, or wrap in `autossh -M 0 -R 80:localhost:8080 localhost.run` for auto-reconnect                                                  |
| IPv4 / IPv6 mismatch                                     | Try `127.0.0.1` instead of `localhost` (or vice versa)                                                                                                                 |
| App sees `http://` instead of `https://`                 | Proxy headers disabled — re-enable injection, or set `X-Forwarded-Proto: https` in the upstream proxy. Configure the framework's "trust proxy" mode.                  |
| Browser still hits `localhost:PORT`                      | Framework is generating absolute URLs — configure its reverse-proxy / trusted-proxy setting so it trusts `X-Forwarded-Host`                                          |
| Want to migrate domain to a new account                  | Cancel the old subscription, set up the domain in the new account, verify with TXT record, pay, then email `help@localhost.run` to transfer remaining credit       |

## Reference

- Main docs: [https://localhost.run/docs/](https://localhost.run/docs/)
- CLI: [https://localhost.run/docs/cli/](https://localhost.run/docs/cli/)
- HTTP tunnels: [https://localhost.run/docs/http-tunnels/](https://localhost.run/docs/http-tunnels/)
- TLS passthrough: [https://localhost.run/docs/tls-passthru-tunnels/](https://localhost.run/docs/tls-passthru-tunnels/)
- Custom domains: [https://localhost.run/docs/custom-domains/](https://localhost.run/docs/custom-domains/)
- Forever free tier: [https://localhost.run/docs/forever-free/](https://localhost.run/docs/forever-free/)
- Security: [https://localhost.run/docs/security/](https://localhost.run/docs/security/)
- FAQ: [https://localhost.run/docs/faq/](https://localhost.run/docs/faq/)
- Admin / signup: [https://admin.localhost.run](https://admin.localhost.run)
- Source: [github.com/localhost-run/site](https://github.com/localhost-run/site)
