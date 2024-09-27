export const Constant = {
  API_END_POINT: {
    PRODUCTS: 'http://localhost:5001/products',
    CATEGORIES: 'http://localhost:5001/categories',
    CART: 'http://localhost:5001/cart',
    USERS: 'http://localhost:5001/users',
  },
  METHODS: {
    // Product Methods
    GET_ALL_PRODUCTS: 'GetAllProducts',
    GET_PRODUCT_BY_ID: 'GetProductById',
    GET_PRODUCT_BY_NAME: 'GetProductByName/',
    CREATE_PRODUCT: 'CreateProduct',
    UPDATE_PRODUCT: 'UpdateProduct/',
    DELETE_PRODUCT: 'DeleteProduct/',
     
    
    // Category Methods
    GET_ALL_CATEGORIES: 'GetAllCategories',
    GET_CATEGORY_BY_ID: 'GetCategoryById/',
    
    // Cart Methods
    GET_ALL_CART_ITEMS: 'GetAllCartItems',
    GET_CART_ITEM_BY_ID: 'GetCartItemById/',
    CREATE_CART_ITEM: 'CreateCartItem',
    UPDATE_CART_ITEM: 'UpdateCartItem/',
    DELETE_CART_ITEM: 'DeleteCartItem/',
    
    // User Methods
    GET_ALL_USERS: 'GetAllUsers',
    GET_USER_BY_ID: 'GetUserById/',
    CREATE_USER: 'CreateUser',
  }
}
