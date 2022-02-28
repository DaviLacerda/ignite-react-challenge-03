import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      let product = await api.get(`/products/${productId}`).then((response) => response.data)

      const productAmount = cart.reduce((acc, product) => {
        if(product.id === productId) {
          acc += product.amount
        }

        return acc;
      }, 1);

      if(productAmount === 1){
        const newProduct = {
          ...product,
          amount: 1
        }
        setCart([...cart,newProduct])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart,newProduct]))
      } else {
        const newCart = cart.map((item) => {
          if(item.id === productId){
            return {...item, amount: item.amount + 1}
          }
          return item
        })
        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      }

      // const storagedCart = localStorage.getItem('@RocketShoes:cart')
      // if(storagedCart){
      //   const storagedCardObject = JSON.parse(storagedCart)
      //   const newCart = storagedCardObject.map((currentProduct:Product) => {
      //     if(productId === currentProduct.id){
      //       const newProduct = {...product, amount: (currentProduct.amount + 1) || 1}
      //       updateProductAmount(newProduct)
      //       return newProduct 
      //     }
      //   })
      //   setCart(newCart)
      //   localStorage.setItem('@RocketShoes:cart', JSON.stringify([...newCart]))
      // } else {
      //   console.log(2);
        
      //   updateProductAmount(product)
      //   setCart(product)
      //   localStorage.setItem('@RocketShoes:cart', JSON.stringify([...product]))
      // }
      console.log(localStorage.getItem('@RocketShoes:cart'));
      
      
    } catch {
      toast.error('Falha ao adicionar o produto ao carrinho!')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      toast.error('Erro ao tentar remover o produto do carrinho!')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      let response = await api.get(`/stock/${productId}`)
      let stock = response.data.amount

      if(amount <= 0){
        return;
      }

      else if(amount > stock){
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      const newCart = cart.map((product) => {
        if(productId === product.id){
          return {
            ...product,
            amount: stock.amount
          }
        } else {
          return product
        }
      })  
      
      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart]))
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
