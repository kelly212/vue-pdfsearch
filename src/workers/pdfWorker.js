import * as pdfjsLib from "pdfjs-dist/build/pdf"
import worker from "pdfjs-dist/build/pdf.worker?url"
import { Index } from "flexsearch"

pdfjsLib.GlobalWorkerOptions.workerSrc = worker

const index = new Index({
   tokenize: "forward",
   resolution: 9,
   optimize: true,
   context: true
})

let paginas = [] // { nome, pagina, texto? }

self.onmessage = async (e) => {
   console.log("Worker recebeu mensagem:", e.data.tipo)

   if (e.data.tipo === "indexar") {
      try {
         const file = e.data.file
         const nome = e.data.nome

         console.log(`📄 Indexando: ${nome}`)

         const buffer = await file.arrayBuffer()
         const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

         console.log(`📖 PDF carregado: ${pdf.numPages} páginas`)

         for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p)
            const txt = await page.getTextContent()
            const texto = txt.items.map(i => i.str || "").join(" ").trim()

            if (texto.length > 0) {
               const id = paginas.length

               paginas.push({
                  nome: nome,
                  pagina: p,
                  texto: texto.substring(0, 500) // Guarda parte do texto para debug
               })

               index.add(id, texto)

               console.log(`   Página ${p}: ${texto.length} caracteres`)
            } else {
               console.log(`   Página ${p}: sem texto`)
            }
         }

         console.log(`✅ Indexação concluída: ${nome}, total de páginas indexadas: ${paginas.length}`)

         self.postMessage({
            tipo: "indexado",
            nome: nome,
            totalPaginas: pdf.numPages
         })

      } catch (error) {
         console.error("Erro ao indexar:", error)
         self.postMessage({
            tipo: "erro",
            erro: error.message
         })
      }
   }

   if (e.data.tipo === "buscar") {
      try {
         const termo = e.data.termo

         console.log(`🔎 Buscando no worker: "${termo}"`)
         console.log(`📚 Total de páginas indexadas: ${paginas.length}`)

         if (!termo || termo.trim() === "") {
            self.postMessage({
               tipo: "resultado",
               resultados: []
            })
            return
         }

         // Busca no índice
         const ids = index.search(termo)

         console.log(`🔍 IDs encontrados:`, ids)

         if (!ids || ids.length === 0) {
            console.log("❌ Nenhum resultado encontrado")
            self.postMessage({
               tipo: "resultado",
               resultados: []
            })
            return
         }

         // Mapeia IDs para resultados
         const resultados = ids.map(id => {
            const pagina = paginas[id]
            return {
               nome: pagina.nome,
               pagina: pagina.pagina
            }
         })

         console.log(`✅ Encontrados ${resultados.length} resultados:`, resultados)

         self.postMessage({
            tipo: "resultado",
            resultados: resultados
         })

      } catch (error) {
         console.error("Erro na busca:", error)
         self.postMessage({
            tipo: "erro",
            erro: error.message
         })
      }
   }
}
