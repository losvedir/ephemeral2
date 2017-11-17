defmodule Ephemeral2Web.WantChannel do
  use Phoenix.Channel
  require Logger

  def join("want:" <> hash, _message, socket) do
    Logger.info "Joined WantChannel: #{hash}"
    {:ok, %{}, socket}
  end

  def handle_in("content_request", %{"hash" => hash}, socket) do
    Logger.info "handle_in WantChannel content_request"
    Ephemeral2Web.Endpoint.broadcast! "have:" <> hash, "content_request", %{}
    {:noreply, socket}
  end
end
