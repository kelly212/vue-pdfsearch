<template>
	
	<div class="file_list">
		<v-list v-if="arquivos.length>0" style="background: transparent">
			<v-list-subheader>Lista de arquivos</v-list-subheader>
			<v-list-item
			v-for="f in arquivos"
			:key="f.name"
			color="primary"
			:value="f"
			rounded="shaped"
			class="file"
			@click="$emit('abrir',f,1)"
			:title="f.name"
			></v-list-item>
		</v-list>
		
		<!--<div-->
		<!--v-for="f in arquivos"-->
		<!--:key="f.name"-->
		<!--class="file"-->
		<!--@click="$emit('abrir',f,1)"-->
		<!--&gt;-->
		<!---->
		<!--{{f.name}}-->
		<!---->
	<!--</div>-->
	
</div>

</template>

<script>

export default{
	
	props:[
	"arquivos"
	]
	
}

</script>
<style>
.file_list{
	overflow-y: scroll;
	min-height: 70vh;
	max-height: 100vh;
	border-right: 1px solid #ccc;
}
</style>
