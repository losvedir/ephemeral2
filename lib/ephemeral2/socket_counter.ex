defmodule Ephemeral2.SocketCounter do
  use GenServer
  require Logger

  def start_link() do
    GenServer.start_link(__MODULE__, [])
  end

  def init([]) do
    Logger.info "Init'ing SocketCounter"
    Process.send_after(self, :log_stuff, 5_000)
    {:ok, []}
  end

  def handle_info(:log_stuff, state) do
    Logger.info "total_subscribers=#{Enum.count Phoenix.PubSub.Local.subscribers(Ephemeral2.PubSub.Local, "all")}"
    Process.send_after(self, :log_stuff, 5_000)
    {:noreply, state}
  end
end
