# Variante del servidor 200.234.233.146

Directorio: /opt/softnova-parametrizacion
Rama local: servidor/parametrizacion-200-234-233-146
Base original: 8dac6b4b3a0084f92d5119123471d19c32d147f1
El destino de push de origin está bloqueado con /dev/null. No publicar esta rama.

## Operación

Desde el directorio del proyecto:

```sh
docker compose -f docker/compose/docker-compose.server.yml up -d --build
docker compose -f docker/compose/docker-compose.server.yml ps
docker compose -f docker/compose/docker-compose.server.yml logs --tail=80
python3 deploy/verify.py
```

Frontend estático Nuxt servido con Nginx; proxy Nginx para /api y /storage.
nicamente el puerto 80 se publica. PostgreSQL, Redis y PHP-FPM quedan dentro de Docker.
Los datos y claves OAuth persisten en volúmenes. No ejecutar down -v.
Los archivos env/database.env, env/backend.env y env/admin-access.json contienen secretos locales, están ignorados por Git y excluidos de la imagen Docker.
env/frontend.env contiene API_URL=/api y BACKEND_URL=http://200.234.233.146; estos mismos valores se pasan al compilar desde Compose. Cambios de configuración del frontend requieren recompilar.

## Alcance

Login lleva a Productos, o a la primera opción permitida para la cuenta.
Se conservan Productos, Marcas, Bodegas, POS, Ventas, Inventario, configuración del Sitio público, Contenido, Usuarios y Roles/permisos.
Inicio/dashboard, Categorías, landing, catálogo público e inspire no se registran en el router ni se muestran en el menú. Nginx bloquea las direcciones antiguas.
El código original excluido se conserva como referencia; no se borra.
La API exige autenticación excepto login. Crear/editar categorías está deshabilitado; su lectura autenticada se conserva como dependencia de formularios. Categoría es opcional al crear un producto.
Los permisos panel.ver y categorias.* se omiten del catálogo y del sembrado inicial.
Se corrigieron la ubicación de claves Passport, el manejo de sesiones inválidas (401) y la revocación al cerrar sesión.

## Estado de datos

Base nueva, sin migración de información desde otros servidores.
Cuenta administrativa inicial: jose.vasquez@softnova.com. Su contraseña generada está en env/admin-access.json (solo root).
Inventario conserva las pantallas y cifras de demostración que ya trae el repositorio; este despliegue no implementa movimientos nuevos.
Acceso HTTP por IP; no se configuró dominio ni certificado TLS.
