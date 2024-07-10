<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import Chartdata from "$lib/component/chartdata/+page.svelte";
	import Overview from "$lib/component/overview/+page.svelte";
	import PastandBank from "$lib/component/pastandbank/+page.svelte";
</script>


<div>
<Overview />
</div>
<div class="grid gap-2 md:grid-cols-1 lg:grid-cols-2 mx-5 my-6">
    <Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
           
            
        </Card.Header>
        <Card.Content>
           <Chartdata />
        </Card.Content>
    </Card.Root>
	<Card.Root>
        <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
        </Card.Header>
        <Card.Content>
           <PastandBank />
        </Card.Content>
    </Card.Root>
    
</div>