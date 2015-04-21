defmodule Ephemeral2.AllChannel do
  use Phoenix.Channel
  require Logger

  def join("all", _message, socket) do
    Logger.info "Joined AllChannel"
    {:ok, socket}
  end
end
