export const modules = [
  ['', 'panel.ver'],
  ['categorias', 'categorias.ver'],
  ['productos', 'productos.ver'],
  ['marcas', 'marcas.ver'],
  ['bodegas', 'bodegas.ver'],
  ['pos', 'ventas.ver'],
  ['ventas', 'ventas.ver'],
  ['inventario', 'inventario.ver'],
  ['sitio-publico', 'administrar-sitio'],
  ['imagenes', 'imagenes.ver'],
  ['usuarios', 'usuarios.ver'],
  ['roles', 'roles.ver'],
].map(([name, permission]) => ({
  path: name
    ? `/modulo-parametrizacion/${name}`
    : '/modulo-parametrizacion',
  permission,
}))

export const canVisit = (user, item) => Boolean(
  user && (user.es_super_admin || (Array.isArray(user.permisos) && user.permisos.includes(item.permission)))
)