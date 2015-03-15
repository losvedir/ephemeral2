use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :ephemeral2, Ephemeral2.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :ephemeral2, Ephemeral2.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "ephemeral2_test",
  size: 1,
  max_overflow: false
