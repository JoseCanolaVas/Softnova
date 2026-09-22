#!/usr/bin/env python3
"""Pruebas de acceso sin imprimir ni guardar tokens."""
import json
import urllib.request
import urllib.error
from pathlib import Path
BASE='http://127.0.0.1'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs): return None
opener=urllib.request.build_opener(NoRedirect)
def request(path,data=None,token=None,method=None,accept=True):
    headers={'Content-Type':'application/json'}
    if accept: headers['Accept']='application/json'
    if token: headers['Authorization']='Bearer '+token
    req=urllib.request.Request(BASE+path,data=json.dumps(data).encode() if data is not None else None,headers=headers,method=method)
    try:
        with opener.open(req,timeout=20) as r:return r.status,r.read().decode(),r.headers
    except urllib.error.HTTPError as e:return e.code,e.read().decode(),e.headers
access=json.loads((Path(__file__).resolve().parents[1]/'env/admin-access.json').read_text())
status,body,_=request('/api/auth/login',access)
assert status==200,('login',status)
token=json.loads(body)['access_token']
try:
    checks=[('/api/auth/me',None),('/api/productos/listar',{}),('/api/marcas/listar',None),('/api/bodegas/listar',None),('/api/usuarios/listar',None),('/api/roles/listar',None),('/api/permisos/listar',{}),('/api/categorias/listar',None),('/api/sitio-publico/configuracion',None),('/api/imagenes/listar',None),('/api/ventas/resumen',{})]
    for path,data in checks:
        status,body,_=request(path,data,token)
        assert status==200,(path,status,body[:100])
        print('OK',path)
        if path=='/api/permisos/listar':
            assert 'panel.ver' not in body and 'categorias.ver' not in body
    for path in ['/index','/index.html','/dashboard','/panel','/categorias/categorias','/catalogo','/inspire','/modulo-parametrizacion/categorias','/modulo-parametrizacion/categorias/','/modulo-parametrizacion/index']:
        assert request(path)[0]==404,path
    assert request('/api/categorias/crear',{},token)[0]==404
    assert request('/api/categorias/actualizar/1',{},token,'PUT')[0]==404
    for accept in [True,False]:
        assert request('/api/productos/listar',{},accept=accept)[0]==401
    assert request('/')[0]==302
    assert request('/')[2]['Location'].endswith('/login')
    assert request('/modulo-parametrizacion')[2]['Location'].endswith('/modulo-parametrizacion/productos')
    print('OK rutas excluidas, autenticación obligatoria y redirecciones')
finally:
    assert request('/api/auth/logout',{},token)[0]==200
assert request('/api/auth/me',token=token)[0]==401
print('OK logout revoca token; sesión inválida devuelve 401')
