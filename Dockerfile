FROM python:3.11-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# Run the FastAPI application using uvicorn, reading the PORT environment variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
