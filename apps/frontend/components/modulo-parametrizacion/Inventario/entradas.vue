<template>
	<div class="entries-page">
		<v-card outlined class="entries-filter-card mb-6">
			<div class="entries-section-heading">
				<div class="entries-section-icon blue">
					<v-icon color="white">mdi-filter-variant</v-icon>
				</div>
				<div>
					<span>Consulta de movimientos</span>
					<h3>Entradas de inventario</h3>
					<p>Revisa quién registró cada ingreso, cuándo ocurrió y en qué bodega.</p>
				</div>
			</div>

			<v-row dense align="center">
				<v-col cols="12" sm="6" md="3">
					<v-text-field v-model="filtros.buscar" label="Buscar producto o movimiento"
						prepend-inner-icon="mdi-magnify" outlined dense rounded clearable hide-details />
				</v-col>
				<v-col cols="12" sm="6" md="2">
					<v-select v-model="filtros.mes" :items="meses" label="Mes" outlined dense rounded clearable
						hide-details />
				</v-col>
				<v-col cols="12" sm="6" md="2">
					<v-select v-model="filtros.bodega" :items="bodegas" label="Bodega" outlined dense rounded
						clearable hide-details />
				</v-col>
				<v-col cols="12" sm="6" md="2">
					<v-select v-model="filtros.usuario" :items="usuarios" label="Registrado por" outlined dense
						rounded clearable hide-details />
				</v-col>
				<v-col cols="12" md="3" class="text-md-right">
					<v-btn rounded outlined color="error" class="mr-2" @click="limpiarFiltros">
						<v-icon left>mdi-broom</v-icon>
						Limpiar
					</v-btn>
					<v-btn rounded color="primary" depressed @click="consultar">
						<v-icon left>mdi-refresh</v-icon>
						Consultar
					</v-btn>
				</v-col>
			</v-row>
		</v-card>

		<v-row class="entries-summary-row">
			<v-col v-for="card in tarjetasResumen" :key="card.title" cols="12" sm="4">
				<v-card outlined class="entries-stat-card" :class="`stat-${card.class}`">
					<div class="entries-stat-icon" :class="card.class">
						<v-icon color="white">{{ card.icon }}</v-icon>
					</div>
					<span>{{ card.title }}</span>
					<strong>{{ card.value }}</strong>
					<small>{{ card.help }}</small>
				</v-card>
			</v-col>
		</v-row>

		<v-row class="entries-analytics-row mt-2 align-stretch">
			<v-col cols="12" lg="8">
				<v-card outlined class="entries-panel full-height-panel">
					<div class="entries-panel-header">
						<div>
							<span>Rendimiento por período</span>
							<h3>Productos ingresados por mes</h3>
						</div>
						<v-chip color="primary" outlined small>Últimos 6 meses</v-chip>
					</div>
					<div class="month-bars">
						<div v-for="mes in estadisticaMensual" :key="mes.nombre" class="month-bar-row">
							<div class="month-label">
								<strong>{{ mes.nombre }}</strong>
								<span>{{ mes.entradas }} entrada(s)</span>
							</div>
							<div class="month-bar-track">
								<div class="month-bar-fill" :style="{ width: porcentajeMes(mes.entradas) + '%' }" />
							</div>
							<strong>{{ mes.unidades }} und.</strong>
						</div>
					</div>
				</v-card>
			</v-col>

			<v-col cols="12" lg="4">
				<v-card outlined class="entries-panel ranking-panel full-height-panel">
					<div class="entries-panel-header">
						<div>
							<span>Equipo</span>
							<h3>Quién ingresó más productos</h3>
						</div>
						<v-icon color="warning">mdi-trophy-outline</v-icon>
					</div>
					<div v-for="(persona, index) in rankingUsuarios" :key="persona.nombre" class="ranking-item">
						<div class="ranking-position">{{ index + 1 }}</div>
						<v-avatar size="38" color="blue lighten-5">
							<span class="primary--text font-weight-bold">{{ iniciales(persona.nombre) }}</span>
						</v-avatar>
						<div class="ranking-person">
							<strong>{{ persona.nombre }}</strong>
							<span>{{ persona.entradas }} movimientos</span>
						</div>
						<b>{{ persona.unidades }} und.</b>
					</div>
				</v-card>
			</v-col>
		</v-row>

		<v-row class="entries-table-row align-stretch mt-2">
			<v-col cols="12" lg="8">
				<v-card outlined class="entries-panel table-panel full-height-panel">
					<div class="entries-panel-header">
						<div>
							<span>Histórico</span>
							<h3>Detalle de entradas</h3>
						</div>
						<v-chip color="primary" outlined>{{ entradasFiltradas.length }} registro(s)</v-chip>
					</div>
					<v-data-table :headers="headers" :items="entradasFiltradas" disable-pagination hide-default-footer>
						<template v-slot:item.producto="{ item }">
							<div class="product-cell">
								<v-avatar size="34" color="blue lighten-5">
									<v-icon small color="primary">mdi-package-variant-closed</v-icon>
								</v-avatar>
								<div>
									<strong>{{ item.producto }}</strong>
									<small>{{ item.codigo }}</small>
								</div>
							</div>
						</template>
						<template v-slot:item.cantidad="{ item }">
							<v-chip small color="success" outlined>{{ item.cantidad }} und.</v-chip>
						</template>
						<template v-slot:item.fecha="{ item }">
							{{ formatearFecha(item.fecha) }}
						</template>
						<template v-slot:item.usuario="{ item }">
							<span class="font-weight-medium">{{ item.usuario }}</span>
						</template>
					</v-data-table>
				</v-card>
			</v-col>

			<v-col cols="12" lg="4">
				<v-card outlined class="entries-panel calendar-panel full-height-panel">
					<div class="entries-panel-header">
						<div>
							<span>Filtro diario</span>
							<h3>Calendario de entradas</h3>
						</div>
						<v-btn icon small color="error" :disabled="!fechaSeleccionada" title="Mostrar todos los días"
							@click="limpiarFecha">
							<v-icon>mdi-calendar-remove-outline</v-icon>
						</v-btn>
					</div>
					<v-date-picker v-model="fechaSeleccionada" full-width color="primary" locale="es-CO"
						@input="filtrarPorFecha" />
					<div class="selected-day">
						<v-icon color="primary" class="mr-2">mdi-calendar-check-outline</v-icon>
						<div>
							<small>Día seleccionado</small>
							<strong>{{ fechaSeleccionadaFormateada }}</strong>
						</div>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	data() {
		return {
			filtros: {
				buscar: '',
				mes: null,
				bodega: null,
				usuario: null,
			},
			fechaSeleccionada: null,
			entradas: [],
			headers: [
				{ text: 'Producto', value: 'producto' },
				{ text: 'Cantidad', value: 'cantidad', align: 'center' },
				{ text: 'Bodega', value: 'bodega' },
				{ text: 'Registrado por', value: 'usuario' },
				{ text: 'Fecha', value: 'fecha' },
			],
		}
	},

	computed: {
		entradasFiltradas() {
			return this.entradas.filter((entrada) => {
				const texto = `${entrada.producto} ${entrada.codigo} ${entrada.usuario}`.toLowerCase()
				const coincideTexto = !this.filtros.buscar || texto.includes(this.filtros.buscar.toLowerCase())
				const coincideMes = !this.filtros.mes || this.mesDeFecha(entrada.fecha) === this.filtros.mes
				const coincideBodega = !this.filtros.bodega || entrada.bodega === this.filtros.bodega
				const coincideUsuario = !this.filtros.usuario || entrada.usuario === this.filtros.usuario
				const coincideFecha = !this.fechaSeleccionada || entrada.fecha === this.fechaSeleccionada
				return coincideTexto && coincideMes && coincideBodega && coincideUsuario && coincideFecha
			})
		},

		meses() {
			return [...new Set(this.entradas.map(entrada => this.mesDeFecha(entrada.fecha)))]
		},

		bodegas() {
			return [...new Set(this.entradas.map(entrada => entrada.bodega))]
		},

		usuarios() {
			return [...new Set(this.entradas.map(entrada => entrada.usuario))]
		},

		tarjetasResumen() {
			const unidades = this.entradasFiltradas.reduce((total, entrada) => total + Number(entrada.cantidad || 0), 0)
			const bodegasActivas = new Set(this.entradasFiltradas.map(entrada => entrada.bodega)).size

			return [
				{ title: 'Unidades ingresadas', value: unidades, help: 'En el mes seleccionado', icon: 'mdi-package-plus', class: 'blue' },
				{ title: 'Movimientos registrados', value: this.entradasFiltradas.length, help: 'Entradas de mercancía', icon: 'mdi-clipboard-list-outline', class: 'green' },
				{ title: 'Bodegas con actividad', value: bodegasActivas, help: 'Con ingresos este período', icon: 'mdi-warehouse', class: 'orange' },
			]
		},

		estadisticaMensual() {
			const grupos = this.entradas.reduce((resultado, entrada) => {
				const nombre = this.mesDeFecha(entrada.fecha)
				const grupo = resultado[nombre] || { nombre, entradas: 0, unidades: 0 }
				grupo.entradas += 1
				grupo.unidades += Number(entrada.cantidad || 0)
				resultado[nombre] = grupo
				return resultado
			}, {})

			return Object.values(grupos)
		},

		maxEntradasMensuales() {
			return Math.max(...this.estadisticaMensual.map(mes => mes.entradas), 1)
		},

		rankingUsuarios() {
			const grupos = this.entradas.reduce((resultado, entrada) => {
				const grupo = resultado[entrada.usuario] || { nombre: entrada.usuario, entradas: 0, unidades: 0 }
				grupo.entradas += 1
				grupo.unidades += Number(entrada.cantidad || 0)
				resultado[entrada.usuario] = grupo
				return resultado
			}, {})

			return Object.values(grupos).sort((a, b) => b.unidades - a.unidades)
		},

		fechaSeleccionadaFormateada() {
			if (!this.fechaSeleccionada) return 'Todos los días'
			return this.formatearFecha(this.fechaSeleccionada)
		},
	},

	methods: {
		consultar() {},

		limpiarFiltros() {
			this.filtros = { buscar: '', mes: null, bodega: null, usuario: null }
			this.fechaSeleccionada = null
		},

		filtrarPorFecha() {},

		limpiarFecha() {
			this.fechaSeleccionada = null
		},

		mesDeFecha(fecha) {
			const fechaNormalizada = new Date(`${fecha}T00:00:00`)
			const nombreMes = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(fechaNormalizada)
			const mes = `${nombreMes} ${fechaNormalizada.getFullYear()}`
			return mes.charAt(0).toUpperCase() + mes.slice(1)
		},

		porcentajeMes(valor) {
			return Math.round((valor / this.maxEntradasMensuales) * 100)
		},

		iniciales(nombre) {
			return nombre.split(' ').map(parte => parte[0]).slice(0, 2).join('')
		},

		formatearFecha(fecha) {
			return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${fecha}T00:00:00`))
		},
	},
}
</script>

<style scoped>
.entries-page {
	background: transparent;
	border-top: 1px solid #dce8f5;
	display: flex;
	flex-direction: column;
	padding-top: 22px;
}

.entries-page > .entries-filter-card { order: 3; }
.entries-page > .entries-summary-row { order: 1; }
.entries-page > .entries-analytics-row { order: 2; }
.entries-page > .entries-table-row { order: 4; }

.entries-filter-card,
.entries-panel {
	border: 1px solid #dce8f5 !important;
	border-radius: 14px !important;
	box-shadow: 0 8px 24px rgba(6, 29, 67, .045) !important;
}

.entries-summary-row {
	align-items: stretch;
	background: #f7fafc;
	border: 1px solid #dce8f5;
	border-radius: 14px;
	margin-left: 0 !important;
	margin-right: 0 !important;
	padding: 8px 4px;
}

.entries-summary-row > .v-col {
	padding: 8px 12px;
}

.entries-summary-row > .v-col:not(:last-child) .entries-stat-card {
	border-right: 2px solid #d2dfeb !important;
}

.entries-filter-card {
	background: #f8fbfe !important;
	padding: 22px;
}

.entries-section-heading,
.entries-panel-header {
	align-items: center;
	display: flex;
	gap: 14px;
}

.entries-section-heading {
	margin-bottom: 22px;
}

.entries-section-heading span,
.entries-panel-header span {
	color: #0d7880;
	font-size: 11px;
	font-weight: 950;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.entries-section-heading h3,
.entries-panel-header h3 {
	color: #243b53;
	font-size: 19px;
	margin: 3px 0;
}

.entries-section-heading p {
	color: #65758d;
	font-size: 13px;
	margin: 0;
}

.entries-section-icon,
.entries-stat-icon {
	align-items: center;
	border-radius: 16px;
	display: flex;
	justify-content: center;
}

.entries-section-icon {
	height: 46px;
	width: 46px;
}

.entries-section-icon.blue,
.entries-stat-icon.blue { background: linear-gradient(135deg, #0b5ed7, #2da8ff); }
.entries-stat-icon.green { background: linear-gradient(135deg, #0c7a4d, #19c463); }
.entries-stat-icon.orange { background: linear-gradient(135deg, #e67800, #ffb020); }

.entries-stat-card {
	background: transparent !important;
	border: 0 !important;
	box-shadow: none !important;
	min-height: 92px;
	padding: 10px 12px;
}

.entries-stat-card .entries-stat-icon {
	height: 34px;
	margin-bottom: 8px;
	width: 34px;
}

.entries-stat-icon {
	height: 42px;
	margin-bottom: 13px;
	width: 42px;
}

.entries-stat-card span,
.entries-stat-card small,
.ranking-person span,
.product-cell small,
.selected-day small {
	color: #7487a3;
	display: block;
}

.entries-stat-card span { font-weight: 800; }
.entries-stat-card strong { color: #17365d; display: inline-block; font-size: 23px; line-height: 1.1; margin: 5px 8px 0 0; }
.entries-stat-card small { font-size: 12px; }

.entries-panel { overflow: hidden; padding: 22px; }
.full-height-panel { height: 100%; }
.entries-panel-header { justify-content: space-between; margin-bottom: 20px; }
.entries-panel-header h3 { margin-bottom: 0; }
.month-bar-row { align-items: center; display: grid; gap: 14px; grid-template-columns: 105px 1fr 70px; margin: 18px 0; }
.month-label strong, .month-label span { display: block; }
.month-label span { color: #7487a3; font-size: 12px; }
.month-bar-track { background: #edf3f9; border-radius: 20px; height: 10px; overflow: hidden; }
.month-bar-fill { background: linear-gradient(90deg, #0b5ed7, #2da8ff); border-radius: inherit; height: 100%; }
.month-bar-row > strong { color: #17365d; font-size: 13px; text-align: right; }
.ranking-item { align-items: center; border-bottom: 1px solid #edf2f7; display: flex; gap: 10px; padding: 12px 0; }
.ranking-item:last-child { border-bottom: 0; }
.ranking-panel { display: flex; flex-wrap: wrap; }
.ranking-panel .entries-panel-header { flex-basis: 100%; }
.ranking-panel .ranking-item { border-bottom: 0; border-right: 1px solid #edf2f7; flex: 1 1 30%; min-width: 220px; padding: 12px 16px; }
.ranking-panel .ranking-item:last-child { border-right: 0; }
.ranking-position { color: #0d7880; font-size: 16px; font-weight: 900; width: 18px; }
.ranking-person { flex: 1; }
.ranking-person strong { color: #243b53; display: block; }
.ranking-person span { font-size: 12px; margin-top: 2px; }
.ranking-item b { color: #17365d; font-size: 13px; }
.calendar-panel { padding-bottom: 16px; }
.selected-day { align-items: center; background: #f2f7ff; border-radius: 12px; display: flex; margin-top: 12px; padding: 12px; }
.selected-day strong { color: #17365d; display: block; font-size: 14px; }
.product-cell { align-items: center; display: flex; gap: 10px; }
.product-cell strong { color: #243b53; display: block; }
.product-cell small { font-size: 11px; margin-top: 2px; }
.table-panel { padding: 0; }
.table-panel .entries-panel-header { padding: 22px 22px 0; }

@media (max-width: 600px) {
	.entries-filter-card, .entries-panel { border-radius: 16px !important; padding: 16px; }
	.entries-summary-row > .v-col:not(:last-child) .entries-stat-card {
		border-bottom: 1px solid #d2dfeb !important;
		border-right: 0 !important;
	}
	.entries-section-heading p { line-height: 1.4; }
	.month-bar-row { gap: 8px; grid-template-columns: 78px 1fr; }
	.month-bar-row > strong { grid-column: 2; text-align: left; }
	.ranking-panel .ranking-item { border-bottom: 1px solid #edf2f7; border-right: 0; flex-basis: 100%; }
	.ranking-panel .ranking-item:last-child { border-bottom: 0; }
}
</style>