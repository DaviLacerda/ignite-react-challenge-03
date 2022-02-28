import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product : Product) => {
    return {...product,
      formattedPrice: formatPrice(product.price),
      subTotal: formatPrice(product.amount * product.price)
    }
  })
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal += (product.amount * Number(product.price))

        return sumTotal
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    const productToUpdateAmount = {
      productId: product.id,
      amount: product.amount + 1
    }
    updateProductAmount(productToUpdateAmount)
  }  

  function handleProductDecrement(product: Product) {
    const productToUpdateAmount = {
      productId: product.id,
      amount: product.amount - 1
    }
    updateProductAmount(productToUpdateAmount)
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {
            cartFormatted.map((product) => {
              return (
                  <tr data-testid="product" key={product.id}>
                    <td>
                      <img src={product.image} alt={product.title} />
                    </td>
                    <td>
                      <strong>{product.title}</strong>
                      <span>{product.formattedPrice}</span>
                    </td>
                    <td>
                      <div>
                        <button
                          type="button"
                          data-testid="decrement-product"
                        disabled={product.amount <= 1}
                        onClick={() => handleProductDecrement(product)}
                        >
                          <MdRemoveCircleOutline size={20} />
                        </button>
                        <input
                          type="text"
                          data-testid="product-amount"
                          readOnly
                          value={product.amount}
                        />
                        <button
                          type="button"
                          data-testid="increment-product"
                          onClick={() => handleProductIncrement(product)}
                        >
                          <MdAddCircleOutline size={20} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{product.subTotal}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        data-testid="remove-product"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
              )
            })
          }
        </tbody>
      </ProductTable>

      <footer>
        <button type="button" onClick={() => toast.success('Pedido Finalizado com sucesso! Obrigado por visitar meu projeto. by Davi Lacerda')}>Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
