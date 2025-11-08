# Filialsucher MCP Server

Model Context Protocol (MCP) Server für Sparkasse Filial- und Geldautomatensuche.

## Übersicht

Dieser MCP Server ermöglicht AI-Assistenten und anderen MCP Clients den standardisierten Zugriff auf Sparkasse Filial- und Geldautomaten-Standortdaten. Die Implementierung folgt einer klaren Schichtenarchitektur und demonstriert professionelle Software-Engineering-Praktiken.

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

### Voraussetzungen

- Node.js 18 oder höher
- npm oder yarn

### Einrichtung

```bash
# Abhängigkeiten installieren
npm install

# Projekt bauen
npm run build

# Demo ausführen (zeigt alle 5 Tools mit JSON-Ausgabe)
npm run demo

# Oder MCP Server für Claude Desktop starten
npm start
```

## Verwendung

### Schnelle Demo

Der schnellste Weg, um den MCP Server in Aktion zu sehen:

```bash
npm run demo
```

Dies führt alle 5 Tools aus und zeigt deren strukturierte JSON-Antworten:
- Standortbasierte Suche mit Filtern (Radius, Typ, Ausstattung)
- Detaillierte Filialinformationen mit Öffnungszeiten und Kontaktdaten
- Verfügbare Ausstattungsmerkmale und Objekttypen
- Server-Konfiguration

### Konfiguration

**Umgebungsvariablen** (optional im Mock-Modus):

```bash
# Vorlage kopieren und bei Bedarf anpassen
cp .env.example .env
```

Oder manuell setzen:
```bash
export FILIALFINDER_BASE_URL=https://filialfinder-service.sparkasse.de
export FILIALFINDER_API_KEY=your_api_key_here
export FILIALFINDER_BLZ=50050000
export REQUEST_TIMEOUT_MS=2500
```

### Konfiguration mit Claude Desktop

Zur Claude Desktop Konfigurationsdatei hinzufügen:

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

### Verfügbare Tools

Alle Tools liefern strukturiertes JSON für maschinenlesbare Verarbeitung.

#### 1. `search_branch_or_atm`
Sucht nach Sparkasse-Filialen, Geldautomaten oder SB-Filialen im Umkreis eines Standorts.

**Parameter:**
- `latitude` (number, erforderlich): Breitengrad des Suchzentrums
- `longitude` (number, erforderlich): Längengrad des Suchzentrums
- `radius_km` (number, optional): Suchradius in Kilometern (Standard: 5km)
- `type_group` (enum, optional): Filter nach Typ (`ATM`, `BRANCH`, `SELF_SERVICE`)
- `open_now` (boolean, optional): Nur aktuell geöffnete Standorte
- `facilities` (integer[], optional): Filter nach Ausstattungs-IDs
- `limit` (integer, optional): Maximale Anzahl der Ergebnisse (Standard: 10)
- `page` (integer, optional): Seitennummer für Paginierung (Standard: 1)

**Rückgabewert:** JSON mit `results` (BranchSummary[]), `total_results`, `page`, `page_size`, `search_center`, `filters`

#### 2. `get_object_details`
Liefert Detailinformationen zu einer bestimmten Filiale oder einem Geldautomaten.

**Parameter:**
- `id` (integer, erforderlich): Die eindeutige ID des Standorts

**Rückgabewert:** JSON BranchDetail-Objekt mit vollständigen Informationen

#### 3. `list_facilities`
Liefert eine Liste aller verfügbaren Ausstattungsmerkmale.

**Parameter:**
- Keine Parameter erforderlich

**Rückgabewert:** JSON mit `facilities` (Array von {id, name}), `total`

#### 4. `list_object_types`
Liefert eine Liste aller verfügbaren Objekttypen.

**Parameter:**
- Keine Parameter erforderlich

**Rückgabewert:** JSON mit `object_types` (Array von {id, name, groupName}), `total`

#### 5. `get_configuration`
Liefert die aktuelle Filialfinder-Konfiguration.

**Parameter:**
- Keine Parameter erforderlich

**Rückgabewert:** JSON mit `blz`, `name`, `supportedObjectTypes`

## Design-Entscheidungen

### Schichtenarchitektur

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

### Technische Highlights

- **Haversine-Formel**: Präzise geografische Distanzberechnung
- **Type Safety**: Vollständige TypeScript-Typisierung durch alle Layer
- **Klare Trennung**: Saubere Separation zwischen Domain, Infrastructure und Presentation
- **Testbarkeit**: Port-Interface ermöglicht einfaches Unit-Testing

## Entwicklung

```bash
# Watch-Modus für Entwicklung
npm run dev

# Build für Produktion
npm run build
```

## Projektstruktur

```
filialsucher-mcp/
├── src/
│   ├── index.ts                         # Einstiegspunkt
│   ├── config.ts                        # Konfiguration
│   ├── demo.ts                          # Demo-Skript
│   ├── mcpServer.ts                     # MCP-Wrapper
│   ├── domain/
│   │   ├── models.ts                   # Domain-Modelle
│   │   └── mappers.ts                  # Modell-Mapper
│   ├── infra/
│   │   ├── filialfinderClient.ts       # Port-Interface
│   │   ├── mockFilialfinderClient.ts   # Mock-Adapter
│   │   └── realFilialfinderClient.ts   # Produktions-Adapter (Stub)
│   └── tools/
│       ├── searchBranchOrAtm.ts        # Such-Tool
│       ├── getObjectDetails.ts         # Detail-Tool
│       ├── listFacilities.ts           # Ausstattungs-Tool
│       ├── listObjectTypes.ts          # Objekttypen-Tool
│       └── getConfiguration.ts         # Konfigurations-Tool
├── dist/                                # Kompilierte Ausgabe (generiert)
├── .env.example                         # Umgebungsvorlage
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Aktuelle Einschränkungen

- **Mock-Daten**: Prototyp nutzt Mock-Implementierung, produktiver Client über Port-Interface einfach integrierbar
- **Geografische Abdeckung**: Mock-Daten beschränkt auf Raum Mainz (6 realistische Standorte)
- **Keine Persistenz**: Daten nur im Speicher

## Produktionsreife

Für den Produktiveinsatz sind folgende Schritte notwendig:

1. **Real API Client**: `RealFilialfinderClient implements FilialfinderPort` erstellen
2. **Error Handling**: Retry-Logik und Circuit Breaker für API-Calls
3. **Caching**: Redis/Memory-Cache für häufige Anfragen
4. **Monitoring**: Logging und Metrics (z.B. OpenTelemetry)
5. **Rate Limiting**: Schutz vor Überlastung der Sparkasse API
6. **Testing**: Unit Tests für alle Layer, Integration Tests mit Test-API