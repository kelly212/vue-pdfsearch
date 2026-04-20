<template>
						<v-main :theme="getTheme()">
												<v-card :theme="getTheme()">
															<router-view/>
												</v-card>
						</v-main>
					
</template>

<script>
   import router from "../router/router"

   export default {
      name: 'Admin',
      data: () => ({
         darkTheme: true,

      }),
      methods: {
         sair() {
            sessionStorage.clear()
            router.push("/")
         },
         getTheme() {
            return this.darkTheme ? 'dark' : 'ligth'
         },
         toggleTheme() {
            this.darkTheme = !this.darkTheme
         },
      
      },
      mounted() {
         localStorage.setItem('evolucaoCirurgia', '')
      }
   }
</script>


<style>

</style>
