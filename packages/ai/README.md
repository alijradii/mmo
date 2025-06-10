Build command:
```
docker build -t mmo-ai .
```

Run command:
```
docker run -d -p 4073:4073 --name mmo-ai mmo-ai
```

Run without docker
```
uvicorn app.main:app --host 0.0.0.0 --port 4073 --reload
```