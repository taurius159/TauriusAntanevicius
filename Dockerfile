FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["tauriusantanevicius.csproj", "."]
RUN dotnet restore "tauriusantanevicius.csproj"
COPY . .
RUN dotnet build "tauriusantanevicius.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "tauriusantanevicius.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "tauriusantanevicius.dll"]
