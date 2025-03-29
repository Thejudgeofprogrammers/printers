FROM python:3.12-alpine3.21
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn","main:app","--port","8000","--host","127.0.0.1"]
