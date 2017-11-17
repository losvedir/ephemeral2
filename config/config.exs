# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :ephemeral2, Ephemeral2Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "bS5WZOnD3ul0jryRS2Afj9VuloR5hXh3bzXIuDqTEk5lf4G66zeP3Qm9f7FHNerz",
  render_errors: [view: Ephemeral2Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Ephemeral2.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
