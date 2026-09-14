# Como rodar o projeto

Este guia instala tudo o que é preciso e sobe o projeto no seu computador. Siga os passos na ordem. Da primeira vez, leva uns 20 minutos, a maior parte esperando downloads.

O projeto precisa de quatro programas:

- **Git**, para baixar o projeto
- **Docker** ou **Podman**, para rodar o banco de dados
- **Java 25**, para rodar o backend
- **Node.js**, para rodar o frontend

## Antes de começar

Todos os comandos deste guia são digitados no **terminal**.

- **Fedora ou Ubuntu:** aperte a tecla `Super` (a do logo do Windows), digite `Terminal` e aperte `Enter`.
- **Windows:** o terminal é o app **Ubuntu**, que você instala no passo 1.

Algumas dicas:

- Para colar um comando no terminal, use `Ctrl+Shift+V` (só `Ctrl+V` não funciona).
- Cole um bloco de comandos por vez e espere terminar antes de colar o próximo.
- Comandos com `sudo` pedem a sua senha. **Enquanto você digita, nada aparece na tela.** Isso é normal: digite a senha e aperte `Enter`.
- Se o terminal perguntar `[y/N]` ou `[S/n]`, digite `y` (ou `s`) e aperte `Enter`.

## Passo 1: instalar os programas

Siga **só** a seção do seu sistema.

### Fedora

Cole no terminal:

```bash
sudo dnf install git podman podman-compose java-25-openjdk-devel nodejs npm
```

Pronto. Vá para o passo 2.

### Ubuntu (24.04 ou mais novo)

1. Instale o Git, o Docker e o Java:

   ```bash
   sudo apt update
   sudo apt install git docker.io docker-compose-v2 openjdk-25-jdk
   sudo usermod -aG docker $USER
   ```

2. **Reinicie o computador.** Sem isso, o Docker vai dar erro de permissão.

3. Abra o terminal de novo e instale o Node. A versão do Node que vem no Ubuntu é antiga demais, então usamos o `nvm`:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
   ```

4. **Feche o terminal e abra de novo.** Depois cole:

   ```bash
   nvm install 24
   ```

Pronto. Vá para o passo 2.

### Windows

No Windows, o projeto roda dentro de um Linux (Ubuntu) instalado pelo WSL.

1. Clique com o botão direito no menu Iniciar e escolha **Terminal (Admin)** ou **PowerShell (Admin)**. Cole:

   ```powershell
   wsl --install
   ```

2. **Reinicie o computador.**

3. Abra o app **Ubuntu** pelo menu Iniciar. Na primeira vez, ele pede para criar um usuário e uma senha. Pode ser qualquer um, mas **anote a senha**: ela é pedida nos comandos com `sudo`.

4. Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/). Depois de instalado:
   - Abra o Docker Desktop.
   - Clique na engrenagem (**Settings**), depois em **Resources** e em **WSL Integration**.
   - Ligue a opção do **Ubuntu** e clique em **Apply & restart**.

5. No app Ubuntu, instale o Git e o Java:

   ```bash
   sudo apt update
   sudo apt install git openjdk-25-jdk
   ```

6. Ainda no app Ubuntu, instale o Node:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
   ```

7. **Feche o app Ubuntu e abra de novo.** Depois cole:

   ```bash
   nvm install 24
   ```

Pronto. A partir daqui, todos os comandos são digitados no app Ubuntu.

**Importante:** o Docker Desktop precisa estar aberto sempre que você for rodar o projeto.

## Passo 2: conferir a instalação

Cole um comando por vez:

```bash
git --version
java -version
node -v
```

O `java -version` deve mostrar `25`, e o `node -v` deve mostrar `v22` ou um número maior.

Depois, confira o Docker:

- **Fedora:** `podman compose version`
- **Ubuntu e Windows:** `docker compose version`

Se algum desses comandos der erro, veja a seção [Deu erro?](#deu-erro) no fim do guia.

## Passo 3: baixar o projeto

```bash
cd ~
git clone https://github.com/SamuelKrabbe/xopxe.git
```

Isso cria a pasta `xopxe` dentro da sua pasta pessoal. Só precisa ser feito uma vez.

## Passo 4: rodar o projeto

```bash
cd ~/xopxe
./dev.sh
```

Da primeira vez demora alguns minutos, porque o script baixa o banco de dados e as bibliotecas do projeto. Das próximas vezes é bem mais rápido.

Quando aparecerem as mensagens do backend e do frontend, abra no navegador:

**http://localhost:5173**

**Deixe o terminal aberto** enquanto usa o projeto. Fechar o terminal desliga o projeto.

### Para desligar

1. No terminal onde o projeto está rodando, aperte `Ctrl+C`.
2. O banco de dados continua ligado em segundo plano. Para desligar ele também, cole:

   ```bash
   ./dev.sh --stop
   ```

### Nas próximas vezes

Não precisa repetir os passos 1 a 3. Basta abrir o terminal e colar:

```bash
cd ~/xopxe
./dev.sh
```

## Deu erro?

**`command not found` ou `comando não encontrado`**
O programa não foi instalado. Volte ao passo 1 e rode de novo o bloco de comandos do seu sistema. Se o erro for no `nvm` ou no `node`, feche o terminal, abra de novo e tente outra vez.

**`java -version` mostra um número diferente de 25**
O computador tem outra versão do Java instalada. Escolha a versão 25 na lista que aparecer com este comando:

- Fedora: `sudo alternatives --config java`
- Ubuntu e Windows: `sudo update-alternatives --config java`

**`Erro: instale o docker ou o podman para subir o Postgres.`**
O Docker não foi encontrado. No Windows, confira se o Docker Desktop está aberto e se a integração com o Ubuntu está ligada (passo 1, item 4). No Ubuntu e no Fedora, volte ao passo 1.

**`permission denied while trying to connect to the Docker daemon socket`**
No Ubuntu, reinicie o computador. O comando `usermod` do passo 1 só vale depois de reiniciar.

**`Erro: o Postgres não respondeu em 30 segundos.`**
Rode `./dev.sh` de novo. Da primeira vez, o download do banco pode demorar mais que o esperado.

**`address already in use` ou `Port 5173 is already in use`**
Outro programa está usando uma das portas do projeto (5432, 8080 ou 5173). Isso costuma acontecer quando o projeto já está rodando em outro terminal. Feche esse terminal, ou reinicie o computador, e tente de novo.
