FROM ilteoood/claude-code:latest

USER root
ENV HOME=/root \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get full-upgrade -y \
 && apt-get install -y --no-install-recommends \
        curl git gnupg wget python3 procps jq unzip ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

RUN mkdir -p -m 755 /etc/apt/keyrings \
 && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
 && cat $out | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
 && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
 && mkdir -p -m 755 /etc/apt/sources.list.d \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
 && curl -fsSL https://deb.nodesource.com/setup_24.x | bash \
 && curl -sL https://raw.githubusercontent.com/kerolloz/go-installer/master/go.sh | bash \
 && curl -fsSL https://bun.sh/install | bash \
 && apt-get install -y gh nodejs \
 && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:/root/.bun/bin:/root/go/bin:${PATH}"

RUN gh auth setup-git \
 && npm i -g skills pnpm lighthouse \
 && skills add https://github.com/ilteoood/harness -g -a claude-code -y \
 && claude plugin marketplace add https://github.com/wakatime/claude-code-wakatime.git \
 && claude plugin marketplace add DietrichGebert/ponytail \
 && claude plugin marketplace add thedotmack/claude-mem \
 && claude plugin i claude-code-wakatime@wakatime \
 && claude plugin i typescript-lsp@claude-plugins-official \
 && claude plugin i rust-analyzer-lsp@claude-plugins-official \
 && claude plugin i ponytail@ponytail \
 && claude plugin i claude-mem \
 && gh release download --pattern '*aarch64-linux*' -O /tmp/tokensave.tar.gz -R aovestdipaperino/tokensave \
 && tar -xzf /tmp/tokensave.tar.gz -C /usr/local/bin \
 && rm /tmp/tokensave.tar.gz \
 && chmod +x /usr/local/bin/tokensave \
 && tokensave install --agent claude --git-hook yes \
 && gh extension install github/gh-stack \
 && git config --global user.email "matteopietro.dazzi@gmail.com" \
 && git config --global user.name "Matteo Pietro Dazzi"

COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh
COPY --chmod=755 claude-code.sh /usr/local/bin/claude-code-init.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]