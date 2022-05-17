export const printedOrder = () => {
  // TODO: we must return a HTML string to print into PDF file (must be between ``)
  return `
    <html>
    
     <div class="css-1qp1kp5">
  <div class="css-1vr2anf">
    <div class="chakra-stack css-g9cw6v">
      <div class="css-kezrx0">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/app-justo-live.appspot.com/o/businesses%2FR7GG6M58QshwOOuqFG5u%2Flogo_240x240.jpg?alt=media&amp;token=e181f589-a082-4f7b-a0bd-a66604407381"
          class="chakra-image css-0"
        />
      </div>
      <div class="css-sto8vp">
        <img
          src="/static/media/logo-black.87463fad3f1ff8e7d10bb04c9a83b9d8.svg"
          class="chakra-image css-0"
        />
      </div>
    </div>
    <p class="chakra-text css-9e9owo">Por um delivery mais justo e transparente!</p>
    <p class="chakra-text css-3o9neg">Burger Lab - Itaim</p>
  </div>
  <p class="chakra-text css-1q1l3ls">Pedido Nº 5761</p>
  <p class="chakra-text css-8k1bih">
    Cliente: <span class="chakra-text css-1vg6q84">Letícia</span>
  </p>
  <p class="chakra-text css-8k1bih">Hora: <span class="chakra-text css-1vg6q84">N/E</span></p>
  <p class="chakra-text css-8k1bih">
    Endereço: <span class="chakra-text css-1vg6q84">Rua João Ramalho, 929</span>
  </p>
  <p class="chakra-text css-8k1bih">Complemento: <span class="chakra-text css-1vg6q84"></span></p>
  <p class="chakra-text css-12bf9z8">Detalhes do pedido</p>
  <table role="table" class="chakra-table css-13mgyt3">
    <thead class="css-ycfik3">
      <tr role="row" class="css-0">
        <th data-is-numeric="true" class="css-16r4zcd">Qtd.</th>
        <th class="css-16tih7l">Item</th>
        <th data-is-numeric="true" class="css-7safn">Valor und.</th>
      </tr>
    </thead>
    <tbody class="css-0">
      <tr role="row" class="css-1ioryd0">
        <td role="gridcell" data-is-numeric="true" class="css-37nxch">1</td>
        <td role="gridcell" class="css-dyv93v">
          Maioneses e Molhos <br /><span class="chakra-text css-114n22q"
            >Maionese Verde Temperada</span
          ><br /><span class="chakra-text css-cwm84b"></span>
        </td>
        <td role="gridcell" data-is-numeric="true" class="css-1e8krge">R$ 3,60</td>
      </tr>
      <tr role="row" class="css-1t6wxlw">
        <td role="gridcell" data-is-numeric="true" class="css-1gt7yww">1</td>
        <td role="gridcell" class="css-115yfa">
          Escolha seu molho - <span class="chakra-text css-0">Verde temperada</span>
        </td>
        <td role="gridcell" data-is-numeric="true" class="css-fwqdm4">R$ 0,00</td>
      </tr>
      <tr role="row" class="css-1ioryd0">
        <td role="gridcell" data-is-numeric="true" class="css-37nxch">1</td>
        <td role="gridcell" class="css-dyv93v">
          Combos da Lab <br /><span class="chakra-text css-114n22q"
            >American + Fritas + Refri 350ml</span
          ><br /><span class="chakra-text css-cwm84b"></span>
        </td>
        <td role="gridcell" data-is-numeric="true" class="css-1e8krge">R$ 35,91</td>
      </tr>
      <tr role="row" class="css-1t6wxlw">
        <td role="gridcell" data-is-numeric="true" class="css-1gt7yww">1</td>
        <td role="gridcell" class="css-115yfa">
          Escolha seu refri - <span class="chakra-text css-0">Coca-Cola lata 350 ml</span>
        </td>
        <td role="gridcell" data-is-numeric="true" class="css-fwqdm4">R$ 0,00</td>
      </tr>
    </tbody>
    <tfoot class="css-ozci9u">
      <tr role="row" class="css-0">
        <th class="css-16tih7l">Total</th>
        <th class="css-1yz9rtv"></th>
        <th data-is-numeric="true" class="css-7safn">R$ 39,51</th>
      </tr>
    </tfoot>
  </table>
  <p class="chakra-text css-12bf9z8">Observações</p>
  <p class="chakra-text css-nxo94s">Sem observações.</p>
  <div class="css-cq172s"><p class="chakra-text css-16q89qc">Este pedido já está pago</p></div>
</div>
    </html>
    `;
};
