
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import logo from"$lib/image/pack.png";
    import { Button } from '$lib/components/ui/button';
    const items = [
    { title: "Package 1", description: "-ได้รับสิทธิ์ในการใช้บริการ 100 ครั้ง\n-ถ้าใช้เกินจะปรับครั้งละ 1.00 บาท/ครั้ง", imageUrl: logo,package:'1' ,color:'#FF0033'},
    { title: "Package 2", description: "-ได้รับสิทธิ์ในการใช้บริการ 300 ครั้ง\n-ถ้าใช้เกินจะปรับครั้งละ 0.75 บาท/ครั้ง", imageUrl: logo,package:'2' ,color:'#66CCFF' },
    { title: "Package 3", description: "-ได้รับสิทธิ์ในการใช้บริการ 500 ครั้ง\n-ถ้าใช้เกินจะปรับครั้งละ 0.50 บาท/ครั้ง", imageUrl: logo,package:'3'  ,color:'#6699FF'},
    { title: "Package 4", description: "-ได้รับสิทธิ์ในการใช้บริการ 500 ครั้ง\n-ถ้าใช้เกินจะปรับครั้งละ 0.30 บาท/ครั้ง", imageUrl: logo,package:'4' ,color:'#F0FFFF'},
    { title: "Package 5", description: "-ได้รับสิทธิ์ในการใช้บริการ 600 ครั้ง\n-ถ้าใช้เกินจะปรับครั้งละ 0.20 บาท/ครั้ง", imageUrl: logo,package:'5' ,color:'#6A5ACD'}
  ];
  let loading = false;

  function formatDescription(description: string) {
    return description.replace(/\n/g, '<br>');
  }
  </script>
  
<div class="flex justify-center ... text-4xl font-sans ...  font-bold ..." >
<h1> CHOOSE YOUR PACKAGE</h1>
</div>
<div class="flex justify-center pt-6">
    <div class=" bg-black w-4/5  rounded-lg ..." >r</div>
</div>



{#if loading}
  <div class="spinner my-5">
    <!-- ตัวอย่าง spinner -->
    <div class="border border-blue-300 shadow rounded-md p-4 max-w-xl w-full mx-auto">
      <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-6 py-1">
          <div class="h-5 bg-slate-200 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-5 bg-slate-200 rounded col-span-2"></div>
              <div class="h-5 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded"></div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-5 bg-slate-200 rounded col-span-2"></div>
              <div class="h-5 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div class="h-5 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
<div class="flex justify-center pt-10">
  <div class="w-3/5">
<Carousel.Root class="w-full max-w-4xl">
  <Carousel.Content class="-ml-1">
  {#each items as item}
      <Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/3 flex justify-evenly" >
        <div class="p-1">
          <Card.Root style="background-color:{item.color}">
            <Card.Content
              class="aspect-square items-center justify-center p-6 h-100 w-100 max-h-80 max-w-80" 
            >
              <div class="flex justify-center"><img src={item.imageUrl} alt={`Item ${item.package}`} /></div>
              <div class="text-xl font-semibold">{item.title}</div>
              <div class="text-sm font-semibold">{@html formatDescription(item.description)}</div>
              <Button variant="outline" class="bg-orange-500 mt-5">Buy Now</Button>
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
</div>
</div>
{/if}

<style>
  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh; /* หรือความสูงที่คุณต้องการ */
  }
</style>