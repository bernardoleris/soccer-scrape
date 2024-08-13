FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl netcat-openbsd && apt-get clean

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY scrape.sh .
COPY extract_data.py .

RUN chmod +x scrape.sh

CMD ["bash", "-c", "./scrape.sh && python extract_data.py"]


