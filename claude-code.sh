#!/bin/bash

apt-get update
apt-get full-upgrade -y
apt-get install curl git gnupg wget python3 procps jq unzip -y

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

. "$HOME/.cargo/env"

mkdir -p -m 755 /etc/apt/keyrings \
&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
&& cat $out | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& mkdir -p -m 755 /etc/apt/sources.list.d \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \

curl -fsSL https://deb.nodesource.com/setup_24.x | bash

curl -sL https://raw.githubusercontent.com/kerolloz/go-installer/master/go.sh | bash

curl -fsSL https://bun.sh/install | bash

apt-get install gh nodejs -y

gh auth setup-git

npm i -g skills pnpm lighthouse

skills add https://github.com/ilteoood/harness -g -a claude-code -y

claude plugin marketplace add https://github.com/wakatime/claude-code-wakatime.git
claude plugin marketplace add DietrichGebert/ponytail
claude plugin marketplace add thedotmack/claude-mem

claude plugin i claude-code-wakatime@wakatime
claude plugin i typescript-lsp@claude-plugins-official
claude plugin i rust-analyzer-lsp@claude-plugins-official
claude plugin i ponytail@ponytail
claude plugin i claude-mem

npx -y ctx7 setup --claude --cli --api-key $CONTEXT7_API_KEY

gh release download --pattern "*aarch64-linux*" -O /tmp/tokensave.tar.gz -R aovestdipaperino/tokensave
tar -xzf /tmp/tokensave.tar.gz -C /usr/local/bin
rm /tmp/tokensave.tar.gz
chmod +x /usr/local/bin/tokensave
tokensave install --agent claude --git-hook yes

gh extension install github/gh-stack

git config --global user.email "matteopietro.dazzi@gmail.com"
git config --global user.name "Matteo Pietro Dazzi"

paseo daemon start --foreground
