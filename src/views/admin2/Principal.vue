<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
   <PForm2>
      <template #conteudo>
         <v-container fluid style="max-height: 100vh;">
            <v-row>
               <v-col cols="3">
                  <v-card class="card_table">
                     <v-card-text>
                        <v-row>
                           <v-col cols="12">
                              <v-btn color="primary" @click="escolherPasta">
                                 Selecionar pasta
                              </v-btn>
                              <div v-if="indexando" style="color: blue; margin-top: 10px;">
                                 
                                 <div class="d-flex ga-2 align-center">
                                    <v-progress-linear
                                    v-model="value"
                                    chunk-count="9"
                                    chunk-gap="9"
                                    color="indigo"
                                    height="25"
                                    rounded="sm"
                                    clickable
                                    >
                                    <small class="text-white">{{ value.toFixed() }}%</small>
                                 </v-progress-linear>
                                 
                              </div>
                              <p> {{cortarString(txtIndexando, 70)}} Por favor,Aguarde</p>
                           </div>
                        </v-col>
                        <v-col cols="12" v-if="!indexando">
                           <SearchBox @buscar="buscar"/>
                        </v-col>
                        <v-col cols="12" v-if="!indexando">
                           <FileList
                           :arquivos="arquivos"
                           @abrir="abrirPDF"
                           />
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
               
            </v-col>
            <v-col cols="9">
               <v-row>
                  <v-col cols="12">
                     <ResizablePanels>
                        <template #topo>
                           <v-card v-if="!indexando" class="card_table">
                              <v-card-text>
                                 <PdfViewer ref="viewer"/>
                              </v-card-text>
                           </v-card>
                        </template>
                        <template #bottom>
                           <v-card v-if="termoBusca" class="card_table">
                              <v-card-text>
                                 <div class="results-container" style="background: transparent">
                                    <div v-if="termoBusca && Object.keys(resultadosAgrupados).length === 0 && !indexando">
                                       <p>Nenhum resultado encontrado para "{{ termoBusca }}"</p>
                                    </div>
                                    
                                    <div v-else class="results-header">
                                       <h3 style="color: green;">
                                          Busca "{{ termoBusca }}"
                                          ({{ totalOcorrencias }} ocorrências em {{ totalArquivos }} arquivos)
                                       </h3>
                                    </div>
                                    
                                    <v-expansion-panels v-if="Object.keys(resultadosAgrupados).length > 0"
                                       style="background: transparent"
                                    
                                       v-model="painelAberto"
                                       variant="accordion"
                                       density="compact"
                                       >
                                       <v-expansion-panel style="background: transparent"
                                       v-for="(grupo, arquivo) in resultadosAgrupados"
                                       :key="arquivo" density="compact"
                                       >
                                       <v-expansion-panel-title density="compact">
                                          <v-row no-gutters>
                                             <v-col cols="8">
                                                <strong style="color:#03A89E; font-size: 13px;">{{ arquivo }}</strong>
                                             </v-col>
                                             <v-col cols="4" class="text-right">
                                                <v-chip size="small" color="primary">
                                                   {{ grupo.length }} {{ grupo.length === 1 ? 'resultado' : 'resultados' }}
                                                </v-chip>
                                             </v-col>
                                          </v-row>
                                       </v-expansion-panel-title>
                                       
                                       <v-expansion-panel-text density="compact">
                                          <v-list style="background: transparent">
                                             <v-list-item
                                             v-for="resultado in grupo" :value="resultado" color="orange"
                                             :key="resultado.id"
                                             @click="abrirPDF(resultado.handle, resultado.pagina)"
                                             class="result-item"
                                             >
                                             <!--<v-list-item-content>-->
                                                <v-list-item-title style="color: #20A9FD">
                                                   <strong>Página {{ resultado.pagina }}</strong>
                                                </v-list-item-title>
                                                <v-list-item-subtitle>
                                                   <div v-html="resultado.trecho" class="trecho-texto"></div>
                                                </v-list-item-subtitle>
                                             <!--</v-list-item-content>-->
                                          </v-list-item>
                                       </v-list>
                                    </v-expansion-panel-text>
                                 </v-expansion-panel>
                              </v-expansion-panels>
                           </div>
                        </v-card-text>
                     </v-card>
                     
                     
                  </template>
               </ResizablePanels>
            </v-col>
            
         </v-row>
      </v-col>
      
   </v-row>
</v-container>
</template>
</PForm2>
</template>
<script>
import {v4 as uuidV4} from 'uuid';
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import worker from "pdfjs-dist/build/pdf.worker?url"
import PdfViewer from "../../components/PdfViewer.vue"
import SearchBox from "../../components/SearchBox.vue"
import FileList from "../../components/FileList.vue"
import ResizablePanels from "../ResizablePanels.vue";

pdfjsLib.GlobalWorkerOptions.workerSrc = worker

export default {
   name: "Principal",
   components: {
      PdfViewer,
      SearchBox,
      FileList,
      ResizablePanels
   },
   data() {
      return {
         interval: -1,
         value: 0,
         arquivos: [],
         resultados: [],
         resultadosAgrupados: {}, // Objeto agrupado por arquivo
         dir: null,
         txtIndexando: 'Indexando PDFs',
         termoBusca: null,
         handles: {},
         indice: [],
         indexando: false,
         painelAberto: [] // Para controlar quais painéis estão abertos
      }
   },
   
   methods: {
      validarCampo(campo) {
         if (campo !== undefined && campo !== null && campo !== '') {
            return true
         } else {
            return false
         }
      },
      cortarString(str, tam) {
         if (this.validarCampo(str)) {
            if (str.length > tam) {
               str = str.slice(0, tam) + '...'
            }
         }
         return str
      },
      async escolherPasta() {
         this.dir = await window.showDirectoryPicker()
         this.arquivos = []
         this.handles = {}
         this.indice = []
         this.resultados = []
         this.resultadosAgrupados = {}
         
         for await (const entry of this.dir.values()) {
            if (entry.kind === "file" && entry.name.endsWith(".pdf")) {
               this.arquivos.push(entry)
               this.handles[entry.name] = entry
            }
         }
         
         await this.montarIndice()
      },
      
      async lerTextoPagina(page) {
         const txt = await page.getTextContent()
         return txt.items.map(i => i.str).join(" ")
      },
      
      async montarIndice() {
         this.indexando = true
         console.log("📚 Iniciando indexação...")
         
         this.indice = []
         
         const total = this.arquivos.length || 1; // evita divisão por 0
         let processados = 0;
         
         for (const arquivo of this.arquivos) {
            try {
               this.txtIndexando = `📄 Carregando: ${arquivo.name}`
               
               // console.log(`📄 Indexando: ${arquivo.name}`)
               // this.value =  (preenchidos / total) * 100
               
               const file = await arquivo.getFile()
               const buffer = await file.arrayBuffer()
               
               const loadingTask = pdfjsLib.getDocument({data: buffer})
               const pdf = await loadingTask.promise
               
               for (let p = 1; p <= pdf.numPages; p++) {
                  try {
                     const page = await pdf.getPage(p)
                     const texto = await this.lerTextoPagina(page)
                     
                     if (texto && texto.trim().length > 0) {
                        this.indice.push({
                           arquivo: arquivo.name,
                           pagina: p,
                           textoOriginal: texto,
                           textoBusca: texto.toLowerCase()
                        })
                     }
                  } catch (e) {
                     console.warn(`Falha ao ler página ${p} de ${arquivo.name}`, e)
                  }
               }
               
               
               // console.log(`✅ Indexado: ${arquivo.name} - ${this.indice.filter(i => i.arquivo === arquivo.name).length} páginas com texto`)
               
            } catch (e) {
               console.warn(`Falha ao abrir PDF ${arquivo.name}`, e)
               this.value = 0
               this.txtIndexando = `Falha ao abrir PDF ${arquivo.name}`
            }
            
            processados++;
            this.value = Number(((processados / total) * 100).toFixed(2))
         }
         
         this.indexando = false
         console.log(`✅ Indexação concluída! Total de ${this.indice.length} páginas indexadas.`)
      },
      
      buscar(termo) {
         console.log("🔍 Buscando:", termo)
         this.termoBusca = termo
         
         if (!termo || termo.trim().length < 2) {
            this.resultados = []
            this.resultadosAgrupados = {}
            return
         }
         
         const termoLower = termo.toLowerCase()
         
         let encontrados = this.indice.filter(i => i.textoBusca.includes(termoLower))
         
         console.log(`📊 Encontrados ${encontrados.length} resultados`)
         
         if (!encontrados.length) {
            this.resultados = []
            this.resultadosAgrupados = {}
            return
         }
         
         // Adicionar IDs e handles
         const resultadosCompletos = encontrados.map(r => ({
            id: uuidV4(),
            file: {name: r.arquivo},
            pagina: r.pagina,
            handle: this.handles[r.arquivo],
            textoOriginal: r.textoOriginal,
            trecho: this.gerarTrecho(r.textoOriginal, termo)
         }))
         
         this.resultados = resultadosCompletos
         
         // Agrupar por arquivo
         this.resultadosAgrupados = {}
         for (const resultado of resultadosCompletos) {
            const nomeArquivo = resultado.file.name
            if (!this.resultadosAgrupados[nomeArquivo]) {
               this.resultadosAgrupados[nomeArquivo] = []
            }
            this.resultadosAgrupados[nomeArquivo].push(resultado)
         }
         
         // Abrir automaticamente o primeiro painel
         if (Object.keys(this.resultadosAgrupados).length > 0) {
            const primeiroArquivo = Object.keys(this.resultadosAgrupados)[0]
            this.painelAberto = [primeiroArquivo]
         }
      },
      
      gerarTrecho(texto, termo) {
         const textoLower = texto.toLowerCase()
         const idx = textoLower.indexOf(termo.toLowerCase())
         
         if (idx === -1) return ""
         
         const inicio = Math.max(0, idx - 60)
         const fim = Math.min(texto.length, idx + termo.length + 60)
         
         let trecho = texto.substring(inicio, fim)
         
         // Escapar HTML
         trecho = trecho.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;'
            if (m === '<') return '&lt;'
            if (m === '>') return '&gt;'
            return m
         })
         
         // Marcar o termo encontrado
         const regex = new RegExp(`(${termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
         trecho = trecho.replace(regex, "<mark>$1</mark>")
         
         return (inicio > 0 ? "..." : "") + trecho + (fim < texto.length ? "..." : "")
      },
      
      abrirPDF(handle, pagina = 1) {
         if (!handle) return
         this.$refs.viewer.abrir(handle, pagina)
      }
   },
   
   computed: {
      // Total de ocorrências (páginas encontradas)
      totalOcorrencias() {
         let total = 0
         for (let arquivo in this.resultadosAgrupados) {
            total += this.resultadosAgrupados[arquivo].length
         }
         return total
      },
      
      // Total de arquivos que têm resultados
      totalArquivos() {
         return Object.keys(this.resultadosAgrupados).length
      }
   },
   // mounted(){
   //    this.carregarDaPasta()
   // }
}
</script>
<style scoped>
.results-container {
   
   overflow-y: auto;
   border: 1px solid #ddd;
   border-radius: 4px;
   padding: 10px;
   background: white;
}

.result-item {
   cursor: pointer;
   border-bottom: 1px solid #f0f0f0;
}

.result-item:hover {
   background-color: #f1f1f154;
}

.trecho-texto {
   font-size: 12px;
   color: #ccc;
   margin-top: 5px;
}

.trecho-texto :deep(mark) {
   background-color: yellow;
   color: black;
   padding: 0 2px;
   font-weight: bold;
   border-radius: 2px;
}
</style>
