
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    const items = [
    { title: "Item 1", description: "This is the first item", imageUrl: "path/to/image1.jpg",package:'1' },
    { title: "Item 2", description: "This is the second item", imageUrl: "path/to/image2.jpg",package:'2' },
    { title: "Item 3", description: "This is the third item", imageUrl: "path/to/image3.jpg",package:'3' },
    { title: "Item 4", description: "This is the fourth item", imageUrl: "path/to/image4.jpg",package:'4' },
    { title: "Item 5", description: "This is the fifth item", imageUrl: "path/to/image5.jpg",package:'5' }
  ];
  </script>
  
<div class="flex justify-center ... text-4xl font-sans ...  font-bold ..." >
<h1> CHOOSE YOUR PACKAGE</h1>
</div>
<div class="flex justify-center ... pt-6">
    <div class=" bg-black w-3/5  rounded-lg ..." >r</div>
</div>


<div class="flex justify-center ... pt-10">
    <div class="w-3/5">
  <Carousel.Root class="w-full max-w-4xl">
    <Carousel.Content class="-ml-1">
    {#each items as item}
        <Carousel.Item class="pl-1 md:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <Card.Root>
              <Card.Content
                class="aspect-square items-center justify-center p-6"
              >
                <div class="text-2xl font-semibold">{item.package}</div>
                <div class="text-2xl font-semibold">{item.title}</div>
                <div class="text-2xl font-semibold">{item.description}</div>
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