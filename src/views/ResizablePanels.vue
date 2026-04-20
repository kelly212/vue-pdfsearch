<template>
			<v-container fluid class="pa-0 fill-height flex-column align-stretch">
						<div
								class="d-flex flex-grow-1 overflow-hidden"
								style="height: 100vh; position: relative;"
								@mousemove="handleMouseMove"
								@mouseup="stopDragging"
								@mouseleave="stopDragging"
						>
								
									<div class="flex-grow-1 d-flex flex-column" ref="container">
												
												<div
														class="panel-top"
														:style="{ height: topHeight + 'px' }"
														:class="{ 'dragging-now': isDragging }"
												>
															<div class="pa-4">
																		<slot name="topo"></slot>
															</div>
												</div>
												
												<div class="resizer" @mousedown="startDragging">
															<v-icon size="small">$mdiUnfoldMoreHorizontal</v-icon>
												</div>
												
												<div
														class="panel-bottom "
												>
															<div class="pa-4" style="max-height: 900px; ">
																		<slot name="bottom"></slot>
															</div>
												</div>
									
									</div>
						</div>
			</v-container>
</template>

<script>
   export default {
      data() {
         return {
            isDragging: false,
            topHeight: 600, // Altura inicial do painel azul
            minHeight: 50,  // Altura mínima permitida
         };
      },
      methods: {
         startDragging(e) {
            this.isDragging = true;
            // Impede seleção de texto durante o arraste
            document.body.style.cursor = 'row-resize';
            // Isso evita que o iframe capture o mouse
            document.body.classList.add('resizing-active');
            
            document.body.style.userSelect = 'none';
            
         },
         handleMouseMove(e) {
            if (!this.isDragging) return;

            // Cálculo da nova altura baseado na posição do mouse dentro do container
            const containerRect = this.$refs.container.getBoundingClientRect();
            const newHeight = e.clientY - containerRect.top;

            // Limites para não "sumir" com os painéis
            if (newHeight > this.minHeight && newHeight < (containerRect.height - this.minHeight)) {
               this.topHeight = newHeight;
            }
         },
         stopDragging() {
            if (this.isDragging) {
               this.isDragging = false;
               document.body.style.cursor = 'default';
               document.body.classList.remove('resizing-active');
               document.body.style.userSelect = 'auto';
            }
         }
      }
   };
</script>

<style scoped>
			.sidebar {
						height: 100%;
			}
			
			.resizer {
						height: 8px;
						cursor: row-resize;
						background-color: #333;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: background-color 0.2s;
						z-index: 10;
			}
			
			.resizer:hover {
						background-color: #666;
			}
			
			.resizer i {
						color: white;
			}
			
			/*.panel-top, .panel-bottom {*/
						/*width: 100%;*/
						/*overflow: auto;*/
			/*}*/
			.panel-top, .panel-bottom {
						display: flex;
						/*flex-direction: column;*/
						overflow: hidden; /* Importante: o scroll será controlado internamente pelos cards */
			}
			
			/* Estilo para o painel que contém o PDF */
			.panel-top {
						display: flex;
						flex-direction: column;
						overflow: hidden; /* Evita scroll duplo com o iframe */
			}
			
			/* Força o conteúdo do slot (seu PdfViewer) a ocupar tudo */
			.panel-top > :deep(*) {
						height: 100% !important;
						width: 100% !important;
						display: flex;
						flex-direction: column;
			}
			
			/* Alvo direto no iframe dentro do PdfViewer */
			.panel-top :deep(iframe) {
						flex-grow: 1;
						border: none;
						height: 100% !important;
						width: 100% !important;
			}
			
			/* TRUQUE PARA O ARRASTE:
						Quando estiver arrastando, desabilita eventos de mouse no painel do PDF
						para o iframe não "roubar" o cursor */
			.dragging-now {
						pointer-events: none;
			}
			
			/* Garante que o container interno do Vuetify v-if ou v-col não quebre a altura */
			:deep(.v-col), :deep(.v-row) {
						height: 100%;
						margin: 0;
			}
			
			/* Força os cards do Vuetify a ocuparem 100% da altura do painel */
			.panel-top :deep(.card_table),
			.panel-bottom :deep(.card_table) {
						height: 100% !important;
						display: flex;
						flex-direction: column;
			}
			
			/* Faz o conteúdo do card (v-card-text) ser o container do scroll */
			.panel-top :deep(.v-card-text),
			.panel-bottom :deep(.v-card-text) {
						flex-grow: 1;
						overflow-y: auto;
						padding: 0; /* Opcional: remove padding interno para ganhar espaço */
			}
			
			/* Estilo específico para o visualizador de PDF no topo */
			.panel-top :deep(.v-card-text) {
						overflow: hidden; /* PDF não deve ter scroll no v-card-text, o iframe já cuida disso */
			}
			
			/* Garante que o PdfViewer dentro do card ocupe tudo */
			.panel-top :deep(iframe) {
						width: 100%;
						height: 100%;
						border: none;
			}
</style>
