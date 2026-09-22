import { modules, canVisit } from '~/config/server-profile'

export default async function ({ route, redirect, error, $axios }) {
  if (!process.client) return
  const path = route.path.replace(/\/+$/, '') || '/'
  const token = sessionStorage.getItem('softnova_token')
  if (!token) return path === '/login' ? undefined : redirect('/login')
  let user
  try {
    const response = await $axios.$get('/auth/me')
    user = response.user
    sessionStorage.setItem('softnova_user', JSON.stringify(user))
  } catch (failure) {
    if (failure.response && failure.response.status === 401) {
      sessionStorage.removeItem('softnova_token')
      sessionStorage.removeItem('softnova_user')
      return path === '/login' ? undefined : redirect('/login')
    }
    return error({ statusCode: 503, message: 'No se pudo verificar la sesión. Intenta nuevamente.' })
  }
  const first = modules.find(item => canVisit(user, item))
  if (!first) return error({ statusCode: 403, message: 'Tu cuenta no tiene acceso a Parametrización.' })
  const current = modules.find(item => item.path === path)
  if (!current || !canVisit(user, current)) return redirect(first.path)
}
