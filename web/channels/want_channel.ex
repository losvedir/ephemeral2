defmodule Ephemeral2.WantChannel do
  use Phoenix.Channel
  require Logger

  def join("want:" <> hash, _message, socket) do
    Logger.info "Joined WantChannel: #{hash}"
    {:ok, socket}
  end

  def handle_in("CONTENT_REQUEST", %{"hash" => hash}, socket) do
    Logger.info "handle_in WantChannel CONTENT_REQUEST"
    Ephemeral2.Endpoint.broadcast! "have:" <> hash, "CONTENT_REQUEST", %{}
    {:noreply, socket}
  end
end
