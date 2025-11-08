# Filialsucher MCP Server

Model Context Protocol (MCP) server für Sparkasse Filial- und Geldautomatensuche.

## Overview

Dieser MCP Server ermöglicht AI-Assistenten und anderen MCP Clients den standardisierten Zugriff auf Sparkasse Filial- und Geldautomaten-Standortdaten. Die Implementierung folgt einer klaren Layered Architecture und demonstriert professionelle Software-Engineering-Praktiken.

**⚠️ Mock-Modus:** Die aktuelle Implementation nutzt `MockFilialfinderClient` mit realistischen Beispieldaten, da kein Zugriff auf die Sparkasse REST API besteht. Ein `RealFilialfinderClient` kann via `FilialfinderPort`-Interface eingepluggt werden, sobald API-Zugangsdaten verfügbar sind.

**🎯 Für Case Study:** Dieses Projekt beantwortet die Frage "Ist es möglich den Filialsucher MCP Server umzusetzen ohne das Projektbudget von 5.000€ zu überschreiten?" mit einem funktionierenden Proof-of-Concept. Siehe `npm run demo` für sofortige Demonstration aller Features.

## Architektur

Das Projekt folgt einer sauberen Schichtenarchitektur:

- **Domain Layer** (`domain/`): Business-Modelle und View-Model-Mappings
- **Infrastructure Layer** (`infra/`): Port-Interface und Client-Implementierungen
- **Tools Layer** (`tools/`): MCP-Tool-Definitionen
- **MCP Layer** (`mcpServer.ts`): Protocol-Wrapper

## Features

- **Standortbasierte Suche**: Filialen und Geldautomaten im Umkreis finden
- **Typ-Filterung**: Gezielte Suche nach FILIALE, GELDAUTOMAT oder SB_FILIALE
- **Distanzberechnung**: Haversine-Formel für präzise Entfernungen
- **Öffnungszeiten**: Aktuelle Verfügbarkeit prüfen
- **Detailinformationen**: Vollständige Adresse, Services und Kontaktdaten

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run demo (shows all 5 tools with JSON output)
npm run demo

# Or start MCP server for Claude Desktop
npm start
```

## Usage

### Quick Demo

The fastest way to see the MCP server in action:

```bash
npm run demo
```

This executes all 5 tools and displays their structured JSON responses, demonstrating:
- Location-based search with filters (radius, type, facilities)
- Detailed facility information with opening hours and contact data
- Available facilities and object types
- Server configuration

### Configuration

**Environment Variables** (optional in mock mode):

```bash
# Copy template and adjust if needed
cp .env.example .env
```

Or set manually:
```bash
export FILIALFINDER_BASE_URL=https://filialfinder-service.sparkasse.de
export FILIALFINDER_API_KEY=your_api_key_here
export FILIALFINDER_BLZ=50050000
export REQUEST_TIMEOUT_MS=2500
```

### Configure with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filialsucher": {
      "command": "node",
      "args": ["/absolute/path/to/filialsucher-mcp/dist/index.js"]
    }
  }
}
```

Nach Konfiguration Claude Desktop neu starten.

### Available Tools

All tools return structured JSON for machine-readable consumption.

#### 1. `search_branch_or_atm`
Sucht nach Sparkasse-Filialen, Geldautomaten oder SB-Filialen im Umkreis eines Standorts.

**Parameters:**
- `latitude` (number, required): Breitengrad des Suchzentrums
- `longitude` (number, required): Längengrad des Suchzentrums
- `radius_km` (number, optional): Suchradius in Kilometern (Standard: 5km)
- `type_group` (enum, optional): Filter nach Typ (`ATM`, `BRANCH`, `SELF_SERVICE`)
- `open_now` (boolean, optional): Nur aktuell geöffnete Standorte
- `facilities` (integer[], optional): Filter nach Ausstattungs-IDs
- `limit` (integer, optional): Maximale Anzahl der Ergebnisse (Standard: 10)
- `page` (integer, optional): Seitennummer für Paginierung (Standard: 1)

**Returns:** JSON mit `results` (BranchSummary[]), `total_results`, `page`, `page_size`, `search_center`, `filters`

#### 2. `get_object_details`
Liefert Detailinformationen zu einer bestimmten Filiale oder einem Geldautomaten.

**Parameters:**
- `id` (integer, required): Die eindeutige ID des Standorts

**Returns:** JSON BranchDetail-Objekt mit vollständigen Informationen

#### 3. `list_facilities`
Liefert eine Liste aller verfügbaren Ausstattungsmerkmale.

**Parameters:**
- Keine Parameter erforderlich

**Returns:** JSON mit `facilities` (Array von {id, name}), `total`

#### 4. `list_object_types`
Liefert eine Liste aller verfügbaren Objekttypen.

**Parameters:**
- Keine Parameter erforderlich

**Returns:** JSON mit `object_types` (Array von {id, name, groupName}), `total`

#### 5. `get_configuration`
Liefert die aktuelle Filialfinder-Konfiguration.

**Parameters:**
- Keine Parameter erforderlich

**Returns:** JSON mit `blz`, `name`, `supportedObjectTypes`

## Design Decisions

### Layered Architecture

Die Implementierung folgt dem **Ports & Adapters** Pattern:

1. **Domain Layer**: Reine Business-Modelle und Mappings, keine externen Abhängigkeiten
2. **Infrastructure Layer**: `FilialfinderPort` Interface ermöglicht austauschbare Implementierungen (Mock vs. Real API)
3. **Tools Layer**: MCP-Tool-Definitionen nutzen das Port-Interface, unabhängig von konkreter Implementierung
4. **MCP Layer**: Dünner Wrapper um die offizielle MCP SDK

### Mock vs. Production

**Aktueller Stand:** `MockFilialfinderClient` mit 6 realistischen Standorten (Mainz-Gebiet), Haversine-Distanzberechnung und vollständiger Filter-Unterstützung (radius, facilities, type, open_now).

**Produktions-Migration:** `RealFilialfinderClient` ist als Stub implementiert (`src/infra/realFilialfinderClient.ts`) und zeigt den exakten Integrationsweg:
- HTTP-Client mit `/rest/v2/objects/{lon}/{lat}` und weiteren Endpunkten
- XML-Parsing via `fast-xml-parser` (Dependencies bereits in package.json)
- Strukturierte Error-Handling-Patterns
- Request-Logging und Timeout-Konfiguration

**Migration:** In `src/index.ts` einfach `new MockFilialfinderClient()` durch `new RealFilialfinderClient(config)` ersetzen. Keine Änderungen in Tools notwendig (Ports & Adapters Pattern).

### Technical Highlights

- **Haversine-Formel**: Präzise geografische Distanzberechnung
- **Type Safety**: Vollständige TypeScript-Typisierung durch alle Layer
- **Clean Separation**: Klare Trennung zwischen Domain, Infrastructure und Presentation
- **Testability**: Port-Interface ermöglicht einfaches Unit-Testing

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build
```

## Project Structure

```
filialsucher-mcp/
├── src/
│   ├── index.ts                         # Entry point
│   ├── config.ts                        # Configuration
│   ├── demo.ts                          # Demo script
│   ├── mcpServer.ts                     # MCP wrapper
│   ├── domain/
│   │   ├── models.ts                   # Domain models
│   │   └── mappers.ts                  # Model mappers
│   ├── infra/
│   │   ├── filialfinderClient.ts       # Port interface
│   │   ├── mockFilialfinderClient.ts   # Mock adapter
│   │   └── realFilialfinderClient.ts   # Production adapter (stub)
│   └── tools/
│       ├── searchBranchOrAtm.ts        # Search tool
│       ├── getObjectDetails.ts         # Details tool
│       ├── listFacilities.ts           # Facilities tool
│       ├── listObjectTypes.ts          # Object types tool
│       └── getConfiguration.ts         # Configuration tool
├── dist/                                # Compiled output (generated)
├── .env.example                         # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Current Limitations

- **Mock Data**: Prototyp nutzt Mock-Implementierung, produktiver Client über Port-Interface einfach integrierbar
- **Geografische Abdeckung**: Mock-Daten beschränkt auf Raum Mainz (6 realistische Standorte)
- **Keine Persistenz**: Daten nur im Speicher

## Production Readiness

Für den Produktiveinsatz sind folgende Schritte notwendig:

1. **Real API Client**: `RealFilialfinderClient implements FilialfinderPort` erstellen
2. **Error Handling**: Retry-Logic und Circuit Breaker für API-Calls
3. **Caching**: Redis/Memory-Cache für häufige Anfragen
4. **Monitoring**: Logging und Metrics (z.B. OpenTelemetry)
5. **Rate Limiting**: Schutz vor Überlastung der Sparkasse API
6. **Testing**: Unit Tests für alle Layer, Integration Tests mit Test-API