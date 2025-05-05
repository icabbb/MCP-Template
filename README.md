# MCP Template - Modelo base para implementaciones personalizadas

[![Model Context Protocol](https://img.shields.io/badge/MCP-1.0.0-blue.svg)](https://modelcontextprotocol.ai/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

## Descripción

Este proyecto es un **template base para crear cualquier implementación personalizada del Model Context Protocol (MCP)**. El MCP es un protocolo que permite a modelos de AI solicitar herramientas externas para realizar tareas específicas.

Este template proporciona toda la infraestructura necesaria para desarrollar herramientas MCP personalizadas que pueden ser consumidas por modelos de AI como Claude, GPT, etc. Como ejemplo de implementación, incluye una herramienta para consultar datos del Servicio de Impuestos Internos (SII) de Chile, pero puede ser adaptado para cualquier propósito o API.

## Características

- 🔄 Implementación completa del Model Context Protocol (MCP)
- 🔌 Servidor con Server-Sent Events (SSE) para comunicación en tiempo real
- 🛠️ Estructura lista para implementar tus propias herramientas MCP
- 🔧 Arquitectura modular y fácilmente extensible

## Tecnologías

- **TypeScript**: Lenguaje principal del proyecto
- **Express**: Framework web para el servidor
- **ModelContextProtocol SDK**: Implementación oficial del protocolo MCP
- **SSE (Server-Sent Events)**: Para comunicación bidireccional con los modelos
- **Zod**: Validación de esquemas


## Arquitectura

El proyecto sigue una arquitectura modular:

```
src/
├── dispatcher/    # Manejo de solicitudes de herramientas
├── tools/         # Implementaciones de herramientas MCP
├── index_sse.ts   # Punto de entrada principal (servidor SSE)
├── index.ts       # Punto de entrada principal (servidor STDIO)
├── apis/          # Implementaciones de APIs

```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/mcp-template.git
cd mcp-template

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Uso

### Desarrollo local

```bash
# Iniciar el servidor en modo desarrollo
npm run dev

# O usando el inspector MCP para depuración
npm run inspector

# O usando SSE con el inspector MCP
npm run inspectorSSE
```

### Construcción

```bash
# Construir el proyecto
npm run build
```

### Ejecución en producción

```bash
# Iniciar el servidor con el código compilado
npm start
```

## Herramientas MCP disponibles en el ejemplo

El template incluye un ejemplo de implementación:

- `fetch_sii`: Ejemplo de herramienta que consulta información del SII de Chile
  - Demuestra cómo implementar una herramienta MCP
  - Muestra el patrón para conectar a APIs externas
  - Sirve como referencia para crear tus propias herramientas

## Creando tus propias herramientas MCP

Este template está diseñado para ser personalizado. Puedes:

1. Reemplazar la herramienta de ejemplo con tus propias implementaciones
2. Conectar a cualquier API o servicio externo
3. Implementar cualquier lógica de negocio específica para tu caso de uso
4. Exponer funcionalidades específicas de tu dominio a modelos de AI

## Integración con modelos de AI

Una vez implementado y desplegado tu servidor MCP personalizado, puedes integrarlo con modelos como Claude:

1. Configure el modelo para usar el endpoint MCP:
   ```
   https://tu-servidor.com/mcp
   ```

2. El modelo podrá acceder a las herramientas que hayas implementado cuando el usuario haga consultas relacionadas con tu dominio específico.

## Desarrollo de nuevas herramientas

Para agregar nuevas herramientas MCP:

1. Cree un nuevo archivo en el directorio `src/tools/`
2. Implemente la herramienta siguiendo el formato MCP
3. Exporte la herramienta desde `src/tools/index.ts`
4. Actualice el dispatcher en `src/dispatcher/tool.dispatcher.ts` si es necesario

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo [ISC License](https://opensource.org/licenses/ISC).

## Autor

Eduardo Cardoso Martin - [cardosomartin33@gmail.com]
Eduardo Cardoso Martinez - [ecardoso2002.ec@gmail.com]

## Recursos adicionales

- [Documentación oficial de MCP](https://modelcontextprotocol.ai/)
- [SDK de MCP en GitHub](https://github.com/model-context-protocol/sdk)
- [Ejemplos de implementaciones MCP](https://github.com/model-context-protocol/examples)
