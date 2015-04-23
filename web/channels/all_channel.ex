defmodule Ephemeral2.AllChannel do
  use Phoenix.Channel
  require Logger

  def join("all", _message, socket) do
    Logger.info "Joined AllChannel"
    Process.flag(:trap_exit, true)
    {:ok, socket}
  end
end
