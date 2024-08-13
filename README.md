## Passo a passo para rodar aplicação:
No arquivo '.env' no diretório raiz devem ser preenchidos o e-mail e senha da conta utilizada para envio de mensagens para o usuário.
OBS: Está configurado para aceitar uma conta hotmail/outlook.

Após isso, no diretório raiz do projeto, devem-se executar os comandos abaixo:

Para construir as imagens: docker compose build

Para iniciar os containers: docker compose up

Abra o navegador e acesse "http://localhost:3000" para encontrar o gráfico e "http://localhost:3000/notify" a fim de preencher o formulário.