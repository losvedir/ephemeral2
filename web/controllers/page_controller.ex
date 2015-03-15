defmodule Ephemeral2.PageController do
  use Ephemeral2.Web, :controller

  plug :action

  def new(conn, _params) do
    render conn, "new.html"
  end

  def show(conn, %{"hash" => hash}) do
    render conn, "show.html", hash: hash
  end
end
