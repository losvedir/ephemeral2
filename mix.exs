defmodule Ephemeral2.Mixfile do
  use Mix.Project

  def project do
    [app: :ephemeral2,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  # Configuration for the OTP application
  # Type `mix help compile.app` for more information
  def application do
    [mod: {Ephemeral2, []},
     applications: [:phoenix, :cowboy, :logger]]
  end

  # Specifies your project dependencies
  # Type `mix help deps` for examples and options
  defp deps do
    [
      {:cowboy, "~> 1.0"},
      {:phoenix, "~> 0.13"},
      {:phoenix_ecto, "~> 0.4"},
      {:phoenix_html, "~> 1.0"},
      {:phoenix_live_reload, "~> 0.4"},
      {:postgrex, ">= 0.0.0"},
    ]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]
end
