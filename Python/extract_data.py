import pandas as pd
import requests
from bs4 import BeautifulSoup

input_file = 'downloaded_page.html'

try:
    with open(input_file, 'r', encoding='utf-8') as file:
        html_content = file.read()
except FileNotFoundError:
    print(f"Arquivo {input_file} não encontrado.")
    exit()
except Exception as e:
    print(f"Erro ao ler o arquivo: {e}")
    exit()

soup = BeautifulSoup(html_content, 'html.parser')

odd_elements = soup.find_all(class_='odd')
even_elements = soup.find_all(class_='even')

players_data = []

def extract_and_store_info(row):
    cols = row.find_all('td')
    
    player_data = {}
    
    img_tag = cols[1].find('img', {'class': 'bilderrahmen-fixed'})
    player_data['Nome do jogador'] = img_tag['alt'] if img_tag else 'N/A'
    
    position_tag = cols[0].find_all('td')[2]
    player_data['Posição'] = position_tag.get_text(strip=True) if position_tag else 'N/A'

    age_tag = cols[5]
    player_data['Idade'] = age_tag.get_text(strip=True) if age_tag else 'N/A'
    
    nacionalidade_img_tag = cols[4].find('img')
    player_data['Nacionalidade'] = nacionalidade_img_tag['alt'] if nacionalidade_img_tag else 'N/A'
    
    team_tag = cols[6].find('img')
    player_data['Time'] = team_tag['alt'] if team_tag else 'N/A'
    
    market_value_tag = row.find('b')
    player_data['Valor de Mercado'] = market_value_tag.get_text(strip=True) if market_value_tag else 'N/A'
    
    players_data.append(player_data)

max_length = max(len(odd_elements), len(even_elements))

for i in range(max_length):
    if i < len(odd_elements):
        extract_and_store_info(odd_elements[i])
    if i < len(even_elements):
        extract_and_store_info(even_elements[i])

df = pd.DataFrame(players_data)
json_file = 'dados_limpos.json'
df.to_json(json_file, orient='records', indent=4)

print(f"Dados limpos salvos em {json_file}")

url = 'http://node:3000/upload'

files = {'dataset': open(json_file, 'rb')}
response = requests.post(url, files=files)

if response.status_code == 200:
    print("Dataset enviado com sucesso!")
else:
    print(f"Falha ao enviar o dataset. Status code: {response.status_code}")












