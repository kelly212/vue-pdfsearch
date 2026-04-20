<template>
			<div class="search-box">
						<v-text-field theme="dark" density="compact"
																				variant="solo"
																				v-model="termo"
																				@keyup.enter="buscar"
																				placeholder="Buscar nos PDFs..."
																				append-inner-icon="$mdiMagnify"
																				hide-details
																				single-line
																				@click:append-inner="buscar"
						></v-text-field>
						<!--<button @click="buscar">Buscar</button>-->
			</div>
</template>

<script>
   export default {
      data() {
         return {
            termo: ''
         }
      },
      methods: {
         buscar() {
            console.log("SearchBox emitindo buscar com:", this.termo)
            this.$emit('buscar', this.termo)
         }
      }
   }
</script>

