<template>
			<div class="search-box">
						<v-text-field theme="dark" density="compact"
																				variant="underlined"
																				v-model="termo"
																				@keyup.enter="buscar"
																				class="glass-field "
																				placeholder="Buscar nos PDFs..."
																				append-inner-icon="$mdiMagnify"
																				hide-details
																				single-line
																				@click:append-inner="buscar"
						></v-text-field>
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

<style>
			/*.glass-field .v-field {*/
						/*background: rgba(255, 255, 255, 0.1); !* opacidade *!*/
						/*backdrop-filter: blur(20px); !* efeito vidro *!*/
						/*-webkit-backdrop-filter: blur(20px);*/
			/*}*/
</style>
