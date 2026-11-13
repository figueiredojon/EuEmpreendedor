# EuEmpreendedor

O EuEmpreendedor foi criado para facilitar a rotina de quem trabalha por conta própria, como eletricistas, encanadores, pintores, técnicos e autônomos em geral. A ideia é substituir os orçamentos feitos no papel ou improvisados em mensagens soltas por um fluxo simples no celular.

Pelo aplicativo, o profissional cadastra seus clientes, monta o orçamento em poucos segundos, gera um PDF pronto para impressão ou envia um link pelo WhatsApp para o próprio cliente aprovar ou recusar a proposta pelo navegador.


## O que o projeto já faz

- Login protegido por usuário e senha conectado ao servidor.
- Painel geral com a quantidade de orçamentos do mês, estimativa de faturamento e últimos registros.
- Cadastro completo de clientes, com busca rápida, edição e exclusão.
- Criação de orçamentos somando os itens de serviço automaticamente na hora.
- Filtro de orçamentos por abas: Todos, Pendentes e Aprovados.
- Geração de PDF formatado pronto para salvar ou imprimir pelo celular.
- Envio pelo WhatsApp com mensagem pronta e link único para o cliente aprovar ou recusar pelo navegador.


## Tecnologias usadas

O projeto é dividido em duas pastas principais que conversam entre si:

- euempreendedor-app: aplicativo mobile feito em React Native com Expo.
- euempreendedor-api: servidor feito em Python com Django, Django REST Framework e banco de dados SQLite. Ele também entrega a página web pública de aprovação do cliente.
- docs: imagens do protótipo, diagramas e modelo visual do orçamento.
- run_application.py: script na raiz para iniciar o servidor e o aplicativo ao mesmo tempo.


## Como executar o projeto

Você vai precisar do Python 3, do Node.js e do aplicativo Expo Go instalado no celular.

### 1. Preparando o servidor (pasta euempreendedor-api)

Abra o terminal na pasta euempreendedor-api e rode os comandos abaixo:

    cd euempreendedor-api
    python -m venv venv
    .\venv\Scripts\activate
    pip install django djangorestframework django-cors-headers
    python manage.py migrate
    python manage.py createsuperuser


### 2. Preparando o aplicativo (pasta euempreendedor-app)

Em outro terminal, entre na pasta euempreendedor-app e instale os pacotes:

    cd euempreendedor-app
    npm install

Depois, abra o arquivo .env dentro de euempreendedor-app e coloque o endereço IP do seu computador no Wi-Fi (você pode consultar esse número digitando ipconfig no terminal do Windows):

    EXPO_PUBLIC_API_URL=http://SEU_IP_DO_WIFI:8000/api
    EXPO_PUBLIC_LOCAL_IP=http://SEU_IP_DO_WIFI:8000

Importante: o celular e o computador precisam estar conectados na mesma rede Wi-Fi.


### 3. Iniciando tudo

Jeito rápido (um único comando na pasta raiz do projeto):

    python run_application.py

Jeito manual (usando dois terminais):

No primeiro terminal (dentro de euempreendedor-api):

    .\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000

No segundo terminal (dentro de euempreendedor-app):

    npx expo start -c

Depois é só ler o QR Code que aparece na tela usando o aplicativo Expo Go no celular.


## Tabela de testes

| Teste | Funcionalidade | Como testar | Resultado |
| :--- | :--- | :--- | :--- |
| 01 | Login | Entrar com o usuário e senha criados no Django | Abre o painel principal |
| 02 | Clientes | Criar um cliente, buscar pelo nome, editar e excluir | Atualiza na tela e no banco |
| 03 | Novo orçamento | Escolher cliente, adicionar serviços com valores e salvar | Soma o total e abre o resumo |
| 04 | Busca e filtros | Alternar entre as abas Todos, Pendentes e Aprovados | Filtra a lista corretamente |
| 05 | Gerar PDF | Tocar em Gerar PDF na tela de resumo | Abre o documento pronto para salvar |
| 06 | Enviar no WhatsApp | Tocar em Compartilhar na tela de resumo | Abre o WhatsApp com texto e link prontos |
| 07 | Aprovação pelo link | Abrir o link no navegador e clicar em Aprovar | Muda o status para Aprovado no banco e no app |


## Lista de pendências

- Hospedar a API na nuvem com HTTPS para que qualquer navegador de celular abra o link público de aprovação direto do WhatsApp sem bloqueio de rede local.
- Incluir a opção de envio por e-mail junto com o compartilhamento via WhatsApp.
- Salvar a sessão no aparelho para o usuário não precisar fazer login toda vez que abrir o aplicativo.
- Criar a tela de detalhes do orçamento para registrar observações de atendimento e ajustar itens quando o cliente pedir mudanças.
- Criar a tela de histórico mensal agrupando os valores orçados e aprovados de cada mês.
- Criar a tela de cadastro de novos usuários direto pelo aplicativo.
