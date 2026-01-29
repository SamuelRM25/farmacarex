# 📊 Integración de FarmaCarex con Google Sheets

Esta guía te explica cómo conectar FarmaCarex con Google Sheets para respaldar tus datos en la nube y acceder desde cualquier lugar.

---

## 🌟 ¿Por qué Google Sheets?

### ✅ Ventajas

1. **Acceso desde cualquier lugar**
   - En tu computadora
   - En el celular (app de Google Sheets)
   - En cualquier dispositivo con navegador

2. **Colaboración en tiempo real**
   - Múltiples usuarios pueden editar simultáneamente
   - Comparte con tu equipo
   - Trabaja junto en reportes y análisis

3. **Gratuito y Generoso**
   - Plan gratuito muy generoso
   - Hasta 10 millones de celdas por hoja
   - 100MB de almacenamiento

4. **Exportación Fácil**
   - Exporta a Excel, CSV, PDF
   - Compatible con Microsoft Excel
   - Formatos profesionales

5. **Historial Automático**
   - Todas las ediciones se guardan
   - Puedes ver cambios antiguos
   - Restaurar versiones anteriores

---

## 🔧 Configuración Paso a Paso

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Haz clic en "Seleccionar un proyecto" (arriba a la izquierda)
3. Haz clic en "NUEVO PROYECTO"
4. Nombre del proyecto: `FarmaCarex-Backend`
5. Organización: `Tu organización`
6. Haz clic en "CREAR"

### Paso 2: Habilitar API de Google Sheets

1. En el menú, ve a "APIs y servicios" → "Biblioteca"
2. Busca: `Google Sheets API`
3. Haz clic en el resultado
4. Haz clic en "HABILITAR"
5. Espera a que aparezca el mensaje "API habilitada"

### Paso 3: Crear Credenciales de Servicio (Service Account)

#### Opción A: Usar una cuenta de servicio existente (Recomendada)

1. Ve a: APIs & Services → Credenciales
2. Haz clic en "Crear credenciales"
3. Tipo: "Cuenta de servicio"
4. Nombre: `FarmaCarex Service Account`
5. ID del proyecto: `FarmaCarex-Backend`
6. Cuenta de servicio: `Nueva cuenta de servicio`
7. Rol: "Propietario" → "Editor"

#### Opción B: Crear credenciales de OAuth 2.0 (Para acceso desde Google)

1. Tipo de aplicación: "Web application"
2. Nombre: `FarmaCarex Web`
3. Dominios autorizados de JavaScript:
   ```
   http://localhost:3000
   ```
4. Para producción, agrega también:
   ```
   https://tu-app-en-render.com
   ```

### Paso 4: Compartir el Spreadsheet con la Cuenta de Servicio

1. Ve a: https://docs.google.com/spreadsheets
2. Crea un nuevo spreadsheet: `FarmaCarex - Datos`
3. Haz clic en "Compartir"
4. Agrega el email de la cuenta de servicio
5. Selecciona: "Editor"
6. Haz clic en "Enviar"

### Paso 5: Obtener las credenciales JSON

1. Ve a: API Console → Cuentas de servicio
2. Crea la clave privada (Private Key)
3. Esto descargará un archivo `.json`
4. Guarda este archivo de forma segura
5. **IMPORTANTE**: No compartas este archivo públicamente

### Paso 6: Configurar Variables de Entorno

Copia los valores del archivo JSON descargado:

```bash
# En tu archivo .env
GOOGLE_PROJECT_ID="tu-proyecto-id"
GOOGLE_PRIVATE_KEY_ID="tu-private-key-id"
GOOGLE_CLIENT_EMAIL="tu-service-account@proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
...contenido completo del archivo json...
-----END PRIVATE KEY-----'
```

---

## 📱 Uso de la Integración

### Desde el Dashboard de FarmaCarex

1. Ve a la sección "Google Sheets" en el menú lateral
2. Haz clic en "Conectar con Google Sheets"
3. Esto creará automáticamente las siguientes hojas:
   - **Clientes**: Todos tus médicos y farmacias
   - **Medicamentos**: Inventario completo
   - **Visitas**: Registro de visitas con ventas
   - **Ventas**: Detalle de todas las ventas
   - **Citas**: Tu calendario de citas
   - **Planificaciones**: Planificaciones semanales y mensuales

### Opciones de Sincronización

1. **Sincronizar Todo**
   - Sincroniza todos los datos a Google Sheets
   - Útil para respaldos masivos
   - Se recomienda ejecutar al final del día

2. **Sincronizar por Tipo**
   - Sincroniza solo un tipo de datos a la vez
   - Clientes, Medicamentos, Visitas, Ventas, Citas, Planificaciones
   - Más rápido para actualizaciones específicas

3. **Abrir en Google Sheets**
   - Abre directamente tu spreadsheet en Google Sheets
   - Puedes hacer análisis adicionales
   - Crear gráficos y reportes personalizados

---

## 🔄 Flujo de Trabajo Recomendado

### Diario

1. **Por la mañana**: Sincroniza los clientes y medicamentos actualizados
2. **Durante el día**: Cuando crees una visita o venta, sincroniza automáticamente
3. **Al final del día**: Sincroniza todos los datos
4. **Por la noche**: Verifica en Google Sheets los reportes del día

### Semanal

1. **Domingo**: Prepara la planificación de la siguiente semana
2. **Lunes**: Sincroniza la planificación completa
3. **Viernes**: Sincroniza todas las visitas y ventas de la semana

### Mensual

1. **Último día del mes**: Sincronización masiva completa
2. **Inicio del mes**: Abre Google Sheets y genera reportes mensuales
3. **Revisión**: Analiza tendencias y métricas en los datos

---

## 📊 Estructura de Datos en Google Sheets

### Hoja: Clientes

| Columna | Descripción |
|---------|-------------|
| A | ID del cliente |
| B | Fecha de sincronización |
| C | Tipo (médico/farmacia) |
| D | Nombre |
| E | Apellido |
| F | Colegiado |
| G | Especialidad |
| H | Dirección |
| I | Municipio |
| J | Departamento |
| K | Teléfono |
| L | Email |
| M | Notas |
| N | Estado (Activo/Inactivo) |

### Hoja: Medicamentos

| Columna | Descripción |
|---------|-------------|
| A | ID del medicamento |
| B | Fecha de sincronización |
| C | Nombre |
| D | Descripción |
| E | Precio Público |
| F | Precio Farmacia |
| G | Precio Médico |
| H | Bonificación 2-9 unidades |
| I | Bonificación 10+ unidades |
| J | Oferta (Sí/No) |
| K | Descripción de oferta |
| L | Stock |
| M | Estado (Activo/Inactivo) |

### Hoja: Visitas

| Columna | Descripción |
|---------|-------------|
| A | ID de la visita |
| B | Fecha de sincronización |
| C | Fecha de visita |
| D | Cliente |
| E | Total de ventas |
| F | Notas |
| G | Número de ventas |
| H | Total de productos vendidos |

### Hoja: Ventas

| Columna | Descripción |
|---------|-------------|
| A | ID de la venta |
| B | Fecha de sincronización |
| C | Fecha de venta |
| D | Cliente |
| E | Total de venta |
| F | Número de productos |
| G | Lista de productos |
| H | Notas |

### Hoja: Citas

| Columna | Descripción |
|---------|-------------|
| A | ID de la cita |
| B | Fecha de sincronización |
| C | Fecha de cita |
| D | Cliente |
| E | Título |
| F | Duración (minutos) |
| G | Estado (pendiente/completada/cancelada) |
| H | Descripción |

### Hoja: Planificaciones

| Columna | Descripción |
|---------|-------------|
| A | ID de planificación |
| B | Fecha de sincronización |
| C | Fecha inicio |
| D | Fecha fin |
| E | Tipo (semanal/mensual) |
| F | Detalles (días y asignaciones) |
| G | Número de días |
| H | Notas |

---

## 🛡 Solución de Problemas

### Error: "No se pudo conectar con Google Sheets"

**Causas posibles:**
- Credenciales incorrectas en .env
- Cuenta de servicio no tiene permisos
- Spreadsheet no compartido con la cuenta de servicio

**Soluciones:**
1. Verifica que el archivo .env tiene los valores correctos
2. Asegúrate de compartir el spreadsheet con el email de la cuenta de servicio
3. Verifica que la API de Google Sheets está habilitada

### Error: "Error al sincronizar datos"

**Causas posibles:**
- Spreadsheet eliminado o movido
- Permisos insuficientes
- Límite de cuota alcanzado

**Soluciones:**
1. Verifica que el spreadsheet existe y está accesible
2. Aumenta cuota en Google Cloud Console
3. Revisa los permisos del Service Account

### Error: "API Key inválida"

**Causas posibles:**
- Clave privada corrupta
- Líneas rotas en el archivo .env
- Caracteres especiales mal escapados

**Soluciones:**
1. Vuelve a generar la clave privada
2. Copia exactamente el contenido del archivo JSON
3. Asegúrate de mantener los saltos de línea correctos

---

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca compartas el archivo .env**
   - Está en .gitignore
   - Contiene credenciales sensibles
   - Agrega a tu archivo .gitignore si no está

2. **Usa cuentas de servicio dedicadas**
   - Una cuenta por proyecto o ambiente
   - No uses tu cuenta personal
   - Facilita la revocación de permisos

3. **Limita permisos**
   - Solo otorga permisos necesarios
   - La API de Google Sheets es suficiente
   - No otorgues acceso a otros servicios de Google

4. **Rotación de credenciales**
   - Considera rotar las credenciales cada 90 días
   - Elimina cuentas de servicio antiguas
   - Registra cambios en un documento seguro

---

## 📞 Soporte y Ayuda

Si necesitas ayuda adicional:

1. **Documentación de Google Sheets API**: https://developers.google.com/sheets/api
2. **Guía de autenticación de Google**: https://developers.google.com/identity/protocols/oauth2
3. **Documentación de Next.js**: https://nextjs.org/docs
4. **Comunidad**: Foros de Google Cloud y StackOverflow

---

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Google Cloud Console
- [ ] API de Google Sheets habilitada
- [ ] Cuenta de servicio creada
- [ ] Credenciales JSON descargadas
- [ ] Variables de entorno configuradas en .env
- [ ] Spreadsheet de prueba creado en Google Sheets
- [ ] Spreadsheet compartido con la cuenta de servicio
- [ ] Conexión inicial exitosa con FarmaCarex
- [ ] Prueba de sincronización de clientes
- [ ] Prueba de sincronización de medicamentos
- [ ] Prueba de sincronización masiva
- [ ] Verificación de datos en Google Sheets

---

## 💡 Consejos Pro

1. **Sincroniza regularmente**: No esperes a tener muchos datos
2. **Usa filtros en Google Sheets**: Crea filtros y tablas dinámicas
3. **Gráficos visuales**: Usa los gráficos integrados de Google Sheets
4. **Formato condicional**: Colorea celdas según valores (ej. stock bajo = rojo)
5. **Compartir reportes**: Puedes compartir hojas específicas con tu equipo
6. **Versionamiento**: Considera crear copias mensuales como respaldos
7. **Automatización**: Usa Google Apps Script para automatizaciones avanzadas
8. **Backup local**: Mantén siempre una copia local en SQLite como respaldo

---

**¡Listo para conectar FarmaCarex con Google Sheets!**
