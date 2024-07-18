<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from '$lib/components/ui/card';

   
    const invoices = [
      {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "2024-07-05"
      },
      {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "2024-07-05"
      }
    ];
  </script> 


<Card.Root >
    
    <Card.Content class="text-center ">
        <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Merchant</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Date</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each invoices as invoice, i (i)}
                <Table.Row>
                  <Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
                  <Table.Cell>{invoice.paymentStatus}</Table.Cell>
                  <Table.Cell>{invoice.paymentMethod}</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
    </Card.Content>
</Card.Root>
   
 