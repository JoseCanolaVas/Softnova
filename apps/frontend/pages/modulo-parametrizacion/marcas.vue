<template>
    <div flat class="mb-4">
        <div class="page-heading">
            <div>
                <span>SOFTNOVA</span>
                <h2>Marcas</h2>
                <p>
                    Organiza las Marcas disponibles para tus productos.
                </p>
            </div>

            <v-btn v-if="$can('marcas.crear')" color="primary" rounded depressed @click="abrirModalMarca()">
                <v-icon left>mdi-plus</v-icon>
                Crear marca
            </v-btn>
        </div>

        <v-card outlined class="panel-card table-card">

            <v-card-text class="mt-5">
                <v-row align="center">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="buscar" label="Buscar" outlined dense clearable rounded
                            prepend-inner-icon="mdi-magnify" />
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-text>
                <v-data-table :items="marcas" :headers="headersMarcas" :loading="loading.marcas" disable-pagination
                    hide-default-footer :search="buscar">
                    <template v-slot:item.estado="{ item }">
                        <v-chip :color="item.estado ? 'green' : 'red'" dark small>
                            {{ item.estado ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                    </template>

                    <template v-slot:item.acciones="{ item }">
                        <v-icon v-if="$can('marcas.editar')" color="teal" @click="abrirModalMarca(item)">
                            mdi-pencil
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="modalMarca" max-width="500px">
            <ModalMarcas :marcaSeleccionada="marcaSeleccionada" @cerrarModal="modalMarca = false"
                @recargar="listarMarcas" />
        </v-dialog>
    </div>
</template>

<script>
import ModalMarcas from '~/components/modulo-parametrizacion/marcas/modalMarcas.vue'

export default {
    layout: 'parametrizacion',

    components: {
        ModalMarcas,
    },

    data() {
        return {
            buscar: '',
            marcas: [],
            marcaSeleccionada: {},
            modalMarca: false,
            loading: {
                marcas: false,
            },
            headersMarcas: [
                { text: 'Nombre', value: 'nombre', align: 'center' },
                { text: 'Descripción', value: 'descripcion', align: 'center' },
                { text: 'Estado', value: 'estado', align: 'center' },
                { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
            ],
        }
    },

    mounted() {
        this.listarMarcas()
    },

    methods: {
        async listarMarcas() {
            try {
                this.loading.marcas = true
                const response = await this.$axios.get('/marcas/listar')
                this.marcas = response.data || []
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las marcas.')
            } finally {
                this.loading.marcas = false
            }
        },

        abrirModalMarca(item = {}) {
            this.marcaSeleccionada = { ...item }
            this.modalMarca = true
        },
    },
}
</script>

<style scoped>
.page-heading,
.panel-card {
    border-radius: 16px !important;
}

.page-heading {
    align-items: center;
    background: #fff;
    border: 1px solid #dfe8f0;
    display: flex;
    gap: 18px;
    justify-content: space-between;
    margin-bottom: 18px;
    padding: 24px;
}

.page-heading span {
    color: #0d7880;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.page-heading h2 {
    color: #14325f;
    font-size: 28px;
    font-weight: 950;
    margin: 4px 0;
}

.page-heading p {
    color: #65758d;
    line-height: 1.55;
    margin: 0;
}

.panel-card {
    border-color: #dfe8f0 !important;
    overflow: hidden;
}

.panel-card-title {
    align-items: center;
    gap: 14px;
    padding: 22px 24px;
}

.panel-title-icon {
    align-items: center;
    background: #eef6ff;
    border-radius: 14px;
    display: flex;
    height: 46px;
    justify-content: center;
    width: 46px;
}

.panel-card-title strong {
    color: #243b53;
    display: block;
    font-size: 19px;
}

.panel-card-title p {
    color: #65758d;
    font-size: 13px;
    margin: 2px 0 0;
}

.panel-search {
    max-width: 360px;
}

.panel-table {
    border-top: 1px solid #e6edf5;
}

@media (max-width: 760px) {

    .page-heading,
    .panel-card-title {
        align-items: flex-start;
        flex-direction: column;
    }

    .panel-search {
        max-width: 100%;
        width: 100%;
    }
}
</style>
