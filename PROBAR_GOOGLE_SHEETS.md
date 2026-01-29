# 🧪 Cómo Probar la Integración con Google Sheets

## ✅ Estado Actual
- ✅ Credenciales configuradas en `.env`
- ✅ Servicio de Google Sheets implementado
- ✅ Botón de integración agregado en la aplicación

## 🚀 Pasos para Probar

### 1. Verificar que la API de Google Sheets está habilitada

1. Ve a: https://console.cloud.google.com/apis/dashboard?project=hip-scarab-430706-p9
2. Busca "Google Sheets API" en la lista
3. Si no aparece, ve a: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=hip-scarab-430706-p9
4. Haz clic en **"Habilitar"** (Enable)

### 2. Abrir la Aplicación

1. En el panel de Preview (derecha), ve a la aplicación
2. Navega a la pestaña **"Google Sheets"**
3. Deberías ver un botón que dice: **"Conectar con Google Sheets"**

### 3. Crear el Spreadsheet

1. Haz clic en **"Conectar con Google Sheets"**
2. Espera unos segundos mientras se crea
3. Deberías ver un mensaje de éxito: **"Spreadsheet de FarmaCarex creado exitosamente"**
4. Haz clic en **"Abrir en Google Sheets"**
5. Se abrirá una nueva pestaña con tu Google Sheet

### 4. Compartir el Spreadsheet con la Cuenta de Servicio

**IMPORTANTE**: Este paso es necesario para que la cuenta de servicio pueda escribir en el sheet.

1. En el Google Sheet recién creado, haz clic en el botón **"Compartir"** (arriba a la derecha)
2. En el campo de correo, escribe:
   ```
   farmacarex@hip-scarab-430706-p9.iam.gserviceaccount.com
   ```
3. Selecciona: **Editor**
4. Haz clic en **"Enviar"**

### 5. Probar Sincronización

#### Opción A: Sincronizar Todo

1. En la pestaña "Google Sheets" de FarmaCarex
2. Haz clic en **"Sincronizar Todo"**
3. Espera a que termine
4. Verás estadísticas de cuántos registros se sincronizaron

#### Opción B: Sincronizar por Tipo

1. Haz clic en **"Sincronizar Clientes"**
2. Ve al Google Sheet y verifica en la hoja "Clientes"
3. Haz clic en **"Sincronizar Medicamentos"**
4. Verifica la hoja "Medicamentos"
5. Repite con Visitas, Ventas, Citas, Planificaciones

## 📊 Verificar Datos en Google Sheets

Después de sincronizar, verifica cada hoja:

### Hoja "Clientes"
Debería contener:
- ID, fecha de sincronización, tipo, nombre, apellido
- Colegiado, especialidad, dirección, municipio, departamento
- Teléfono, email, notas, estado

### Hoja "Medicamentos"
Debería contener:
- ID, fecha de sincronización, nombre, descripción
- Precio público, precio farmacia, precio médico
- Bonificaciones 2-9 y 10+, oferta, stock

### Hoja "Visitas"
Debería contener:
- ID, fecha de sincronización, fecha de visita
- Cliente, total de ventas, notas, número de ventas

### Hoja "Ventas"
Debería contener:
- ID, fecha de sincronización, fecha de venta
- Cliente, total, número de productos, lista de productos

### Hoja "Citas"
Debería contener:
- ID, fecha de sincronización, fecha de cita
- Cliente, título, duración, estado, descripción

### Hoja "Planificaciones"
Debería contener:
- ID, fecha de sincronización, fecha inicio, fecha fin
- Tipo, detalles, número de días, notas

## 🔧 Solución de Problemas

### Error: "No se pudo conectar con Google Sheets"

**Causa 1**: La API de Google Sheets no está habilitada
**Solución**: Habilita la API en https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=hip-scarab-430706-p9

**Causa 2**: Credenciales incorrectas
**Solución**: Verifica que las variables en `.env` estén correctas

### Error: "No tienes permisos para acceder a este spreadsheet"

**Causa**: El spreadsheet no está compartido con la cuenta de servicio
**Solución**: Comparte el spreadsheet con `farmacarex@hip-scarab-430706-p9.iam.gserviceaccount.com` y dale permisos de Editor

### Error: "Error al sincronizar datos"

**Causa**: Límites de cuota de Google Sheets API
**Solución**: Espera unos minutos y vuelve a intentar. La cuota gratuita es generosa (100 solicitudes por 100 segundos por usuario).

## 📝 Prueba Rápida

1. Agrega un cliente nuevo en FarmaCarex (pestaña Clientes)
2. Ve a la pestaña Google Sheets
3. Haz clic en "Sincronizar Clientes"
4. Abre el Google Sheet
5. Verifica que el cliente aparece en la hoja "Clientes"

¡Si ves el cliente en Google Sheets, la integración está funcionando! 🎉

## 🎉 Éxito

Si todo funciona correctamente:
- ✅ Puedes ver tus datos en Google Sheets
- ✅ Las sincronizaciones funcionan sin errores
- ✅ Los datos se actualizan correctamente
- ✅ Puedes editar los datos en Google Sheets

Felicidades, tu aplicación FarmaCarex está completamente integrada con Google Sheets! 🚀
