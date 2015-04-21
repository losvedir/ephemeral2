defmodule Ephemeral2.HaveChannel do
  use Phoenix.Channel
  require Logger

  def join("have:" <> hash, _message, socket) do
    Logger.info "Joined HaveChannel: #{hash}"
    Process.flag(:trap_exit, true)
    send(self, :broadcast_count)
    {:ok, socket}
  end

  def terminate(_reason, socket) do
    Logger.info "Left HaveChannel: #{socket.topic}"
    broadcast! socket, "visitors_count", %{"count" => visitor_count(socket) - 1}
    :ok
  end

  def handle_in("content", %{"content" => content, "hash" => hash}, socket) do
    verify_hash = :crypto.hash(:sha256, content) |> Base.encode16 |> String.downcase

    if verify_hash == hash do
      Ephemeral2.Endpoint.broadcast! "want:" <> hash, "content", %{"content" => content}
      {:noreply, socket}
    else
      {:stop, :bad_hash, socket}
    end
  end

  def handle_info(:broadcast_count, socket) do
    broadcast! socket, "visitors_count", %{"count" => visitor_count(socket)}
    {:noreply, socket}
  end

  defp visitor_count(socket) do
    Enum.count Phoenix.PubSub.Local.subscribers(Ephemeral2.PubSub.Local, socket.topic)
  end
end
