<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import Chartdata from "$lib/component/chartdata/+page.svelte";
	import Overview from "$lib/component/overview/+page.svelte";
	import PastandBank from "$lib/component/pastandbank/+page.svelte";
	
	

</script>


<div class="mx-5" >
<Overview />
</div>
<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-2 mx-5 my-6 ">
    <div>
		
		<Card.Root class="w-100" style="height:100%;" >
			<Card.Content class="flex justify-center" style="height:100%;width:100%" >
				<div style="width: 100%;" >
				<div class="chart-container content-center h-96 flex justify-center" style="width: 96%;">
					<Chartdata />
				  </div>
				  <div>
			</div>
			</Card.Content>
		  </Card.Root>
		  
           
    </div>
	<div>
		<Card.Root style="height:100%;width:100%" >
			<Card.Content class="flex justify-center" style="height:100%;width:100%" >
				<div>
				<div class="chart-container w-100 max-w-96 my-1" style="width: 100%;">
					<PastandBank />
				  </div>
				  <div>
			</div>
			</Card.Content>
		  </Card.Root>
           
		</div>
    
</div>


