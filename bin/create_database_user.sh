docker exec -it postgres12 bash -c "psql -v ON_ERROR_STOP=1 --username 'postgres' <<-EOSQL
    CREATE DATABASE weight_tracker;
    CREATE USER weight_tracker;
    GRANT ALL PRIVILEGES ON DATABASE weight_tracker to weight_tracker;
    ALTER USER weight_tracker WITH PASSWORD 'weight_tracker';
EOSQL"