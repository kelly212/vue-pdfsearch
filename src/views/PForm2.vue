<template>
   <div class="admin2" >
      <div class="pa-0 screen" style="background: black">
         <!--<div class="header">-->
            <!--<div style="padding: 1% 5%; color: white; ">-->
               <!--<v-row>-->
                  <!--<v-col cols="2"  v-for="(item, i) in direita" :key="'item'+i">-->
                     <!--<v-card theme="dark" class="card " style="padding: 5px; height: 60px" :class="getAtivo($route,item, false)" @click.stop="setPasta()">-->
                        <!--<v-avatar :color="item.cor" size="30">-->
                           <!--<v-icon size="20">{{item.icon}}</v-icon>-->
                        <!--</v-avatar>-->
                        <!--<small>{{item.title}}</small>-->
                     <!--</v-card>-->
                  <!--</v-col>-->
               <!--</v-row>-->
            <!--</div>-->
         <!--</div>-->
         
         <!-- Grid -->
         <div class="cards2" style="overflow: hidden;">
            <slot name="conteudo"></slot>
         </div>
         
      </div>
   </div>
   
</template>

<script>
import router from "../router/router"

export default {
   name: 'Admin',
   data: () => ({
      isInicial: true,
      darkTheme: true,
      direita: [
      {path: '/', title: 'Pasta', icon: '$mdiViewDashboard', cor: '#3cff54'},
      ],
      
      
   }),
   methods: {
      sair() {
         sessionStorage.clear()
         localStorage.clear();
         router.push("/")
      },
      getTheme() {
         return this.darkTheme ? 'dark' : 'ligth'
      },
      toggleTheme() {
         this.darkTheme = !this.darkTheme
      },
      validarCampo(campo) {
         if (campo !== undefined && campo !== null && campo !== '') {
            return true
         } else {
            return false
         }
      },
      getAtivo(atual, item, isLista = false) {
         var ativo = isLista ? (item.childrens.find(list => new RegExp(list.path, 'i').test(atual.path))) : (new RegExp(item.path, 'i').test(atual.path))
         var classe = this.darkTheme ? 'is_ativo_list2' : 'is_ativo_list_light2'
         var classe2 = this.darkTheme ? 'is_ativo2' : 'is_ativo_light2'
         return isLista ? (this.validarCampo(ativo) ? classe : 'no_ativo') : (ativo ? classe2 : 'no_ativo')
      },
      setPasta(path) {
         this.$emit('setPasta')
      },
   },
   mounted() {
      localStorage.setItem('pasta', '')
   }
}
</script>


<style>

</style>
