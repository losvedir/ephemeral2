defmodule Ephemeral2.SocketCounter do
  use GenServer
  require Logger

  def start_link() do
    GenServer.start_link(__MODULE__, [])
  end

  def init([]) do
    Logger.info "Init'ing SocketCounter"
    Process.send_after(self(), :log_stuff, 5_000)
    {:ok, []}
  end

  def handle_info(:log_stuff, state) do
    # YES THIS IS BAD AND SHOULD USE PHOENIX.PRESENCE
    Logger.info "total_subscribers=#{length(:ets.lookup(Elixir.Ephemeral2.PubSub.Local0, "all"))}"
    Process.send_after(self(), :log_stuff, 5_000)
    {:noreply, state}
  end
end
