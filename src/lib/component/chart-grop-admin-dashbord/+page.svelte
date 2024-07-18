<script>
    import Chartgraphadmin from '../chartdataadmin/+page.svelte'
    import CircleGraphadmin from '../circlegraphadmin/+page.svelte'
    import * as Card from "$lib/components/ui/card";
</script>


<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2 h-100 " >
    <Card.Root class="w-100 h-80" >
        <Card.Content class="flex justify-center" style="height:100%;width:100%" >
            <div style="width: 100%;" >
            <div class="chart-container content-center h-96 flex justify-center" style="width: 96%;">
                <Chartgraphadmin/>
              </div>
              <div>
        </div>
        </Card.Content>
      </Card.Root>

    <Card.Root class="w-100" > 

       
        <Card.Content class="flex justify-center" style="height:100%;width:100%" >
            <div style="width: 100%;" >
            <div class="chart-container content-center h-72 flex justify-center" style="width: 96%;">
                <CircleGraphadmin ></CircleGraphadmin>
              </div>
              <div>
        </div>
        </Card.Content>
      </Card.Root>
      
    
</div>


  