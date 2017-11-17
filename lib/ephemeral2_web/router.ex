defmodule Ephemeral2Web.Router do
  use Ephemeral2Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Ephemeral2Web do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :new
    get "/:hash", PageController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", Ephemeral2Web do
  #   pipe_through :api
  # end
end
