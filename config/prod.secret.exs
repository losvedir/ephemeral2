use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :ephemeral2, Ephemeral2.Endpoint,
  secret_key_base: "COk8Hg2VRvOflXEkAJe9HTiPA3GaMhyqvPvoFbsgQ1Fn6e4J9XKFHvvMzMUfgLuU"

# Configure your database
config :ephemeral2, Ephemeral2.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "ephemeral2_prod"
