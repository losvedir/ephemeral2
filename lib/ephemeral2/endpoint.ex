defmodule Ephemeral2.Endpoint do
  use Phoenix.Endpoint, otp_app: :ephemeral2

  # Serve at "/" the given assets from "priv/static" directory
  plug Plug.Static,
    at: "/", from: :ephemeral2,
    only: ~w(css images js favicon.ico robots.txt)

  plug Plug.Logger

  # Code reloading will only work if the :code_reloader key of
  # the :phoenix application is set to true in your config file.
  if code_reloading? do
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_ephemeral2_key",
    signing_salt: "SI6FJuUf",
    encryption_salt: "AtTBQ5x4"

  plug :router, Ephemeral2.Router
end
