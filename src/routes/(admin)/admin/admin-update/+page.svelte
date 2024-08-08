<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
   
    const packages = [
      {
        value: "Package1",
        label: "Package1"
      },
      {
        value: "Package2",
        label: "Package2"
      },
      {
        value: "Package3",
        label: "Package3"
      },
      {
        value: "Package4",
        label: "Package4"
      }
    ];
  </script>

   <div style="display: flex; justify-content:center; margin:30px">
    
       
      <Card.Root class="w-[400px] h-[300px]">
        <Card.Header>
          <Card.Title>Update Package</Card.Title>
          <Card.Description>Update User Package</Card.Description>
        </Card.Header>
        <Card.Content>
          <form>
            <div class="grid w-full items-center gap-4">
              <div class="flex flex-col space-y-1.5">
                <Label for="name">Merchant Name</Label>
                <Input id="name" placeholder="Merchant Name" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="framework">Package</Label>
                <Select.Root>
                  <Select.Trigger id="framework">
                    <Select.Value placeholder="Select" />
                  </Select.Trigger>
                  <Select.Content>
                    {#each packages as packagess}
                      <Select.Item value={packagess.value} label={packagess.label}
                        >{packagess.label}</Select.Item
                      >
                    {/each}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </form>
        </Card.Content>
        <Card.Footer class="flex justify-end">
          <Button><a href="/admin">Save</a></Button>
        </Card.Footer>
      </Card.Root>
</div>