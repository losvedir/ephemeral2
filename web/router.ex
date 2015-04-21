defmodule Ephemeral2.Router do
  use Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  socket "/ws", Ephemeral2 do
    channel "have:*", HaveChannel
    channel "want:*", WantChannel
    channel "all", AllChannel
  end

  scope "/", Ephemeral2 do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :new
    get "/:hash", PageController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", Ephemeral2 do
  #   pipe_through :api
  # end
end
