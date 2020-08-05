# Database (PostgreSQL)

## Connecting to database

```
If on wsl, terminal etc.
sudo apt install postgresql-client

Inside database container
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 gis

Outside database container
PGPASSWORD=postgres psql -U postgres -h localhost -p 5435 gis

Inside any other container besides database container
PGPASSWORD=postgres psql -U postgres -h host.docker.internal -p 5435 gis
```
