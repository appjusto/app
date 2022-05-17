import { Order, OrderItem, WithId } from '@appjusto/types';
import { formatCurrency, formatTime } from '../../common/utils/formatters';

export const printedOrder = (order: WithId<Order>) => {
  const printItems = (items: OrderItem[]) =>
    items.map((item) => {
      `<tr role="row">
      <td role="gridcell" data-is-numeric="true">${item.quantity}</td>
      <td role="gridcell">
        Maioneses e Molhos <br /><span>${item.product.name}</span><br /><span></span>
      </td>
      <td role="gridcell" data-is-numeric="true">${formatCurrency(
        item.quantity * item.product.price
      )}</td>
    </tr>`;
    });
  return `<html>
    <head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
      />
    </head>
    <body>
      <div style="max-width: 300px">
        <div>
          <div style="align-items: center; flex-direction: column">
            <!-- imagem app justo -->
            <!-- <div style="max-width: 80px">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/app-justo-live.appspot.com/o/businesses%2FR7GG6M58QshwOOuqFG5u%2Flogo_240x240.jpg?alt=media&amp;token=e181f589-a082-4f7b-a0bd-a66604407381"
              />
            </div> -->
          </div>
          <p style="font-size: 11px">Por um delivery mais justo e transparente!</p>
          <!-- nome do restaurante -->
          <p style="font-size: 16px; font-weight: 700; margin-top: 4">${order.business?.name}</p>
        </div>
        <!-- order.code -->
        <p style="font-size: 24px; font-weight: 700; line-height: 28px; margin-top: 4">
          Pedido Nº ${order.code}
        </p>
        <!-- order.consumer.name -->
        <p style="font-size: 12px; font-weight: 500; line-height: 16px">
          Cliente: <span style="font-weight: 700">${order.consumer.name}</span>
        </p>
        <!-- createdOn ? -->
        <p style="font-size: 12px; font-weight: 500; line-height: 16px">
          Hora: <span style="font-weight: 700">${formatTime(order.createdOn)}</span>
        </p>
        <!-- destination ?? address -->
        <p style="font-size: 12px; font-weight: 500; line-height: 16px">
          Endereço: <span style="font-weight: 700">${order.destination?.address}</span>
        </p>
        <!-- aqui vai a tabela com os itens, complementos : DetailedOrderItems > OrderListItem -->
        <p style="font-size: 12px; font-weight: 500; line-height: 16px">
          Complemento:
          <span style="font-weight: 700">${order.destination?.additionalInfo ?? 'N/I'}</span>
        </p>
        <p style="font-size: 18px; margin-top: 2">Detalhes do pedido</p>
        <table role="table" style="margin-top: 2">
          <!-- table header -->
          <thead style="border-bottom: 1px solid black">
            <tr role="row">
              <th data-is-numeric="true" style="font-size: 12; max-width: 20px;">Qtd.</th>
              <th style="font-size: 12;">Item</th>
              <th data-is-numeric="true" style="font-size: 12;">Valor und.</th>
            </tr>
          </thead>
          <tbody>
            ${printItems(order.items!)}
          </tbody>
          <!-- valor total -->
          <tfoot>
            <tr role="row">
              <th>Total</th>
              <th></th>
              <th data-is-numeric="true">R$ 39,51</th>
            </tr>
          </tfoot>
        </table>
        <!-- observações -->
        <p>Observações</p>
        <p>Sem observações.</p>
        <!-- aviso pedido já pago -->
        <div><p>Este pedido já está pago</p></div>
      </div>
    </body>
  </html>`;
};
