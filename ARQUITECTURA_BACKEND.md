# Arquitectura del Backend del Sistema

## 1. Introduccion

El backend del sistema representa la logica central de la aplicacion. Su funcion principal es procesar la informacion enviada desde el frontend, validar reglas de negocio, garantizar la seguridad, y coordinar la comunicacion con la base de datos y servicios externos.

En este proyecto, el backend esta implementado con un enfoque **BFF (Backend for Frontend)** dentro de **Next.js 14 (App Router)**, utilizando **Supabase** como proveedor de autenticacion y base de datos PostgreSQL.

El objetivo de este documento es describir y justificar la arquitectura adoptada, destacando su separacion de responsabilidades, seguridad, mantenibilidad y escalabilidad.

---

## 2. Objetivos de arquitectura

La arquitectura del backend fue diseniada para cumplir los siguientes objetivos:

- Separar responsabilidades por capas y dominios.
- Reducir acoplamiento entre logica de negocio y detalles de infraestructura.
- Asegurar el control de acceso y la proteccion de operaciones criticas.
- Facilitar mantenimiento, pruebas y evolucion del sistema.
- Soportar crecimiento funcional y tecnico sin degradar estabilidad.

---

## 3. Stack tecnologico del backend

- **Framework backend:** Next.js 14 (App Router, rutas API en `app/api/**/route.ts`).
- **Lenguaje:** TypeScript.
- **Autenticacion y base de datos:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`) sobre PostgreSQL.
- **Control de sesion:** `middleware.ts` para gestion de sesion/cookies.
- **Modelo de datos:** definido en `supabase/schema.sql`.

---

## 4. Estructura general del backend

Actualmente, el backend se organiza principalmente en:

```text
app/
  api/
    admin/
      productos/[id]/route.ts
      tiendas/[id]/route.ts
    gremios/
      route.ts
      [id]/mensajes/route.ts
      [id]/unirse/route.ts
      [id]/boveda/route.ts
    noticias/[id]/apuntar/route.ts
    personajes/route.ts
    tiendas/comprar/route.ts

lib/
  auth.ts
  supabase/
    server.ts
    client.ts

middleware.ts
supabase/schema.sql
```

Esta estructura muestra una base funcional por dominios, con endpoints agrupados por recurso.

---

## 5. Componentes principales

### 5.1 Capa de API (entrada HTTP)

- **Ubicacion:** `app/api/**/route.ts`.
- **Responsabilidad:** recibir peticiones HTTP, validar parametros basicos, invocar logica de negocio y responder JSON.
- **Estado actual:** los handlers contienen tanto orquestacion como parte de la logica de negocio.

### 5.2 Capa de autenticacion y sesion

- **Ubicacion:** `lib/auth.ts`, `lib/supabase/server.ts`, `middleware.ts`.
- **Responsabilidad:** identificar usuario autenticado, recuperar sesion, y mantener contexto de seguridad.

### 5.3 Capa de negocio (dominio)

- **Estado actual:** implementada en gran parte dentro de los endpoints.
- **Mejora recomendada:** extraer casos de uso a servicios por dominio (`services`), para mejorar testabilidad y reutilizacion.

### 5.4 Capa de persistencia

- **Motor:** PostgreSQL via Supabase.
- **Estado actual:** consultas directas desde handlers y algunas paginas server-side.
- **Mejora recomendada:** encapsular acceso a datos mediante repositorios (`repositories`).

### 5.5 Componentes transversales

- Validacion de entradas.
- Manejo estandar de errores.
- Logging y trazabilidad.
- Politicas de seguridad (rate limiting, auditoria, idempotencia).

---

## 6. Flujo de solicitud backend (end-to-end)

Flujo general de una peticion:

1. El frontend envia una solicitud a un endpoint de `app/api`.
2. El endpoint parsea y valida entrada inicial.
3. Se obtiene la sesion del usuario autenticado.
4. Se verifica autorizacion segun rol/propiedad del recurso.
5. Se ejecutan reglas de negocio.
6. Se realizan lecturas/escrituras en base de datos.
7. Se retorna respuesta JSON con codigo HTTP adecuado.
8. Se registra la operacion para monitoreo/auditoria.

---

## 7. Decisiones tecnicas adoptadas y justificacion

### Decision 1: Arquitectura BFF integrada en Next.js

- **Justificacion:** acelera desarrollo, simplifica despliegue y reduce complejidad de infraestructura inicial.
- **Impacto:** buena productividad, pero exige disciplina de capas internas para evitar acoplamiento.

### Decision 2: Supabase para Auth + PostgreSQL

- **Justificacion:** permite integrar autenticacion y datos de forma rapida, con politicas RLS.
- **Impacto:** mejora velocidad de entrega; requiere configuracion cuidadosa de seguridad y permisos.

### Decision 3: TypeScript en toda la capa backend

- **Justificacion:** reduce errores en tiempo de ejecucion y mejora mantenibilidad.
- **Impacto:** contratos mas claros entre componentes.

### Decision 4: Middleware de sesion

- **Justificacion:** centraliza gestion de autenticacion y estado de usuario.
- **Impacto:** base solida de seguridad, aunque no reemplaza autorizacion especifica por endpoint.

---

## 8. Seguridad del backend

### Controles existentes

- Autenticacion de usuarios mediante Supabase Auth.
- Sesiones gestionadas en servidor.
- Endpoints diferenciados por dominio y algunos con control de acceso.

### Controles recomendados para robustecer la arquitectura

- Validacion fuerte de payloads con esquemas (por ejemplo, Zod).
- Autorizacion explicita por accion y recurso.
- Rate limiting en endpoints sensibles.
- Idempotencia en operaciones de compra/transferencia.
- Auditoria de acciones criticas (admin, cambios de saldo, compras).
- Revision de politicas RLS y pruebas de acceso por rol.

---

## 9. Mantenibilidad y separacion de responsabilidades

Para mejorar mantenibilidad, se propone consolidar una arquitectura por capas:

```text
API (route.ts)
  -> Services (reglas de negocio / casos de uso)
      -> Repositories (acceso a datos)
          -> Supabase / PostgreSQL
```

Beneficios:

- Endpoints mas limpios y faciles de entender.
- Reutilizacion de logica en distintos flujos.
- Pruebas unitarias enfocadas en servicios.
- Menor impacto de cambios en base de datos sobre la API.

---

## 10. Escalabilidad del sistema

### Escalabilidad funcional

- Modularizacion por dominios (`gremios`, `tiendas`, `noticias`, `personajes`, `admin`).
- Facil incorporacion de nuevos casos de uso sin romper existentes.

### Escalabilidad tecnica

- Migrar operaciones criticas a transacciones atomicas.
- Incorporar cache para lecturas frecuentes.
- Desacoplar tareas pesadas en procesamiento asincrono.
- Agregar metricas por endpoint y monitoreo de errores.

### Escalabilidad organizacional

- Documentar contratos API.
- Definir estandares de codigo backend.
- Versionar decisiones tecnicas (ADR).

---

## 11. Riesgos identificados y mitigaciones

### Riesgo 1: Inconsistencias en operaciones de multiples escrituras

- **Situacion:** operaciones como compras pueden ejecutar varios updates secuenciales.
- **Mitigacion:** usar transacciones atomicas (funciones SQL o RPC transaccional).

### Riesgo 2: Acoplamiento de logica en handlers

- **Situacion:** reglas de negocio y acceso a datos mezclados.
- **Mitigacion:** separar en servicios y repositorios.

### Riesgo 3: Validacion de entrada no estandarizada

- **Situacion:** validaciones manuales dispersas.
- **Mitigacion:** esquema comun de validacion por endpoint.

### Riesgo 4: Baja observabilidad

- **Situacion:** ausencia de logging estructurado y trazabilidad completa.
- **Mitigacion:** implementar logger con contexto de request y eventos de negocio.

### Riesgo 5: Proteccion antiabuso insuficiente

- **Situacion:** falta de rate limiting e idempotencia en acciones sensibles.
- **Mitigacion:** controles de cuota/frecuencia y llaves de idempotencia.

---

## 12. Propuesta de estructura objetivo

```text
app/api/
  <dominio>/<accion>/route.ts

lib/
  auth/
    session.ts
    authorization.ts
  services/
    guild.service.ts
    store.service.ts
    news.service.ts
    character.service.ts
  repositories/
    guild.repository.ts
    store.repository.ts
    wallet.repository.ts
  validation/
    guild.schemas.ts
    store.schemas.ts
  errors/
    app-error.ts
    error-mapper.ts
  observability/
    logger.ts
    metrics.ts
```

---

## 13. Criterios de calidad para validar la arquitectura

Se considera que el backend cumple con una arquitectura correcta cuando:

- Cada endpoint valida entrada, sesion y autorizacion.
- La logica de negocio reside en servicios reutilizables.
- El acceso a datos se centraliza en repositorios.
- Las operaciones criticas son atomicas.
- Los errores se manejan con formato estandar.
- Existen logs y trazabilidad de acciones sensibles.
- Hay pruebas en casos de uso prioritarios.

---

## 14. Conclusion

La arquitectura actual del backend es una base adecuada para un proyecto avanzado por su stack moderno y productividad de desarrollo. Sin embargo, para garantizar plenamente separacion de responsabilidades, seguridad, mantenibilidad y escalabilidad, se recomienda evolucionar a un modelo por capas (API, servicios, repositorios), reforzar validaciones y autorizacion, y asegurar atomicidad en operaciones criticas.

Este enfoque permite sostener el crecimiento del sistema con menor deuda tecnica y mayor robustez operativa.

