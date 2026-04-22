<template>
	
	<div class="file_list">
		<v-list density="compact" v-if="arquivos.length>0"
			 style="background: transparent; font-size: 12px;">
			<v-list-subheader>Lista de arquivos</v-list-subheader>
			<v-list-item style="font-size: 11px;"
			v-for="f in arquivos"
			:key="f.name"
			color="primary"
			:value="f"
			rounded="shaped"
			class="file"
			@click="$emit('abrir',f,1)"
			>
						<v-list-item-title><span style="font-size: 12px">{{f.name}}</span></v-list-item-title>
			</v-list-item>
		</v-list>
		
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
	min-height: 50vh;
	max-height: 75vh;
	border-right: 1px solid #ccc;
}
</style>
