<script>
    import Topuseradmintable from '../topuseradmin/+page.svelte'
    import Newuseradmintable from '../newusertableadmin/+page.svelte'
    import Fakeslipuseradmidtable from '../fakeslipusertableadmin/+page.svelte'
    import Transectionadmintable from '../transectionadmintable/+page.svelte'
</script>



<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-2 mx-5 my-6 ">
    <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3  mx-5 my-6 ">

        <Topuseradmintable/>
        <Newuseradmintable/>
        <Fakeslipuseradmidtable/>
        
    </div>

    <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-1 mx-5 my-6 ">

        <Transectionadmintable/>
    </div>

</div>