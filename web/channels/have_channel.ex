defmodule Ephemeral2.HaveChannel do
  use Phoenix.Channel
  require Logger

  def join("have:" <> hash, _message, socket) do
    Logger.info "Joined HaveChannel: #{hash}"
    broadcast socket, "VISITORS", %{"count" => (visitor_count(socket) + 1)}
    {:ok, socket}
  end

  def leave(_message, socket) do
    Logger.info "Left HaveChannel: #{socket.topic}"
    broadcast socket, "VISITORS", %{"count" => (visitor_count(socket) - 1)}
    {:ok, socket}
  end

  def handle_in("CONTENT", %{"content" => content, "hash" => hash}, socket) do
    verify_hash = :crypto.hash(:sha256, content) |> Base.encode16 |> String.downcase

    if verify_hash == hash do
      Ephemeral2.Endpoint.broadcast! "want:" <> hash, "CONTENT", %{"content" => content}
      {:ok, socket}
    else
      {:leave, socket}
    end
  end

  def handle_in("VISITOR_REQUEST", _msg, socket) do
    reply socket, "VISITORS", %{"count" => visitor_count(socket)}
    {:ok, socket}
  end

  defp visitor_count(socket) do
    100
    # HashSet.size Phoenix.PubSub.subscribers(Ephemeral2.PubSub, socket.topic)
  end
end
