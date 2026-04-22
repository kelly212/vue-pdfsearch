<template>
   <div class="pdf-viewer" style="height: 100vh;">
      <!-- Usa iframe para visualização rápida -->
      <iframe
      v-if="!modoBusca && pdfUrl"
      :src="pdfUrl"
      width="100%"
      
      />
      
      <!-- Usa pdfjs quando precisa de busca/destaque -->
      <canvas
      v-else-if="modoBusca && pdf"
      ref="canvas"
      />
   </div>
</template>

<script>
export default {
   data() {
      return {
         modoBusca: false, // Ativado quando vem de resultado de busca
         pdfUrl: null
      }
   },
   methods: {
      async abrir(handle, pagina = 1, destacarTexto = null) {
         if (destacarTexto) {
            this.modoBusca = true
            // Usar pdfjs para renderizar com destaque
            await this.carregarComPdfjs(handle, pagina, destacarTexto)
         } else {
            this.modoBusca = false
            // Usar iframe para visualização normal
            const file = await handle.getFile()
            const url = URL.createObjectURL(file)
            this.pdfUrl = `${url}#page=${pagina}`
         }
      }
   }
}
</script>
<style>
/*.pdf-viewer, iframe{*/
/*height: 30vw;*/
/*}*/
</style>
