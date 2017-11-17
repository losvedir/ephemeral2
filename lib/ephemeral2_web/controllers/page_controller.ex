defmodule Ephemeral2Web.PageController do
  use Ephemeral2Web, :controller

  def new(conn, _params) do
    render conn, "new.html"
  end

  def show(conn, %{"hash" => hash}) do
    render conn, "show.html", hash: hash
  end
end
