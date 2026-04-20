<template>
			<div class="NotFound4">
						<div class="NotFound4_body">
									<div class="text">
												<h1>404</h1>
												<br>
												<h2>Ops</h2>
												<br>
												<h3>Desculpe, não conseguimos encontrar <br>o que você está procurando.</h3>
									</div>
									<div class="torch"></div>
						</div>
			</div>
</template>
<script>
   /* eslint-disable */
   import $ from 'jquery'
   export default {
      name: "404",
      mounted() {
         $(document).mousemove(function (event) {
            $('.torch').css({
               'top': event.pageY,
               'left': event.pageX
            });
         });
      },
   }
</script>
