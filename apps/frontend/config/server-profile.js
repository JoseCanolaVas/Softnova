// Variante exclusiva de este servidor: lista única para rutas y permisos.
export const modules = [
  ['productos', 'productos.ver'], ['marcas', 'marcas.ver'],
  ['bodegas', 'bodegas.ver'], ['pos', 'ventas.ver'],
  ['ventas', 'ventas.ver'], ['inventario', 'ventas.ver'],
  ['sitio-publico', 'administrar-sitio'], ['imagenes', 'imagenes.ver'],
  ['usuarios', 'usuarios.ver'], ['roles', 'roles.ver'],
].map(([name, permission]) => ({ path: `/modulo-parametrizacion/${name}`, permission }))
export const enabledPermission = name => name !== 'panel.ver' && !name.startsWith('categorias.')
export const canVisit = (user, item) => Boolean(user && (user.es_super_admin || (Array.isArray(user.permisos) && user.permisos.includes(item.permission))))
