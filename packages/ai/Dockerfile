FROM python:3.11-slim

# Set working directory
WORKDIR /project

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set Python path to root so `models` is discoverable
ENV PYTHONPATH=/project

EXPOSE 4073

# Run the app from app.main
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4073"]
