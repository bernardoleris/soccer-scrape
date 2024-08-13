#!/bin/bash

if ! command -v curl &> /dev/null
then
    echo "curl não está instalado. Saindo."
    exit 1
fi

URL="https://www.transfermarkt.com.br/spieler-statistik/marktwertaenderungen/marktwertetop"  # Substitua com a URL desejada

OUTPUT_FILE="downloaded_page.html"

curl -o $OUTPUT_FILE $URL

echo "Conteúdo baixado e salvo em $OUTPUT_FILE"

python extract_data.py

ls -l

echo "Processo completo."


