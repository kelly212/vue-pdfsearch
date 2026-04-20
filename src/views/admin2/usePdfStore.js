import { defineStore } from "pinia"

export const usePdfStore = defineStore("pdf", {
   state: () => ({
      pastaPDF: "artigos",
      arquivos: [],
      indice: [],
      termoBusca: "",
      resultados: []
   }),

   actions: {

      setArquivos(lista){
         this.arquivos = lista
      },

      setIndice(indice){
         this.indice = indice
      },

      buscar(){

         const termo = this.termoBusca.toLowerCase().trim()

         if(termo.length < 2){
            this.resultados = []
            return
         }

         this.resultados = this.indice.filter(i =>
          i.textoBusca.includes(termo)
         )

      }

   }
})
