import fs from 'fs';

export default class ProductManager {
    
    constructor(){
        if (!fs.existsSync('./products.json')) {
			// escribo el archivo de forma sincronica con un array vacio
			fs.writeFileSync('./products.json', JSON.stringify([]));
		} 
        this.path = './products.json'; 
        this.products = [];                
    }     
    
    
    async addProduct(product) {       
        
        const productos = await this.getProducts();

        product.id = this.#getId(productos);

        const productoCodigo = productos.findIndex(
			(producto) => producto.code === product.code
		);
		try {
		    if (productoCodigo !== -1) {            
			    console.log('Producto Existente');
			    return; 
		    }else {            
                             
                const actualProducts = await this.getProducts();
                
                actualProducts.push(product);    
                
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(actualProducts) // Transformo el array en string
                );
            }
        } catch (err) {                
                // Si hay error imprimo el error en consola
                console.log('No puedo agregar el producto');
            }             
                 
    }

    #getId(products) {
        if (products.length === 0) {
            return 1;
        }   
        
        const maxId = products.reduce((acc, product) => {
            if (product.id > acc) {
            return product.id;
            } else {
            return acc;
            }
        }, 0);   
       
        return maxId + 1;
        }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);       
                                 
          } catch (error) {
            console.log('Error al cargar los productos');
          }
    }

    async getProductById(id) {
        const productos = await this.getProducts();
        productos.forEach((elem) =>{
            if(id === elem.id) {
                console.log(elem);
                return;                
            }else {
                throw new Error('Not found')
            }            
        })                 
    } 
    
    async upDateProduct(productId, newData) {
        
        const productos = await this.getProducts();
        const productIndex = productos.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {        
        const updatedProduct = {
        ...productos[productIndex],
        ...newData,
        id: productId 
        };  
        
        productos.splice(productIndex, 1, updatedProduct);
            fs.writeFileSync(this.path, JSON.stringify(productos, null, 2));;           
        }
    }

    async deleteProduct(id) {
        const productos = await this.getProducts();
        const index = productos.find(product => product.id === id);
        if (index) {
        const prodActualizado = productos.filter(product => product.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(prodActualizado));     
        }    
    }    

}

let producto = new ProductManager()

// producto.addProduct('leche', 'larga vida', 400, 'sin imagen', 2, 20)
// producto.addProduct('leche', 'larga vida', 400, 'sin imagen', 2, 20)
// producto.addProduct('queso', 'dambo', 600, 'sin imagen', 3, 80)
// producto.addProduct('salame', 'carolla', 800, 'sin imagen', 5, 300);
// producto.addProduct('choclo', 'cremoso', 100, 'sin imagen', 6, 100)
// producto.addProduct('choclo', 'grano', 200, 'sin imagen', 7, 200)
// producto.addProduct('salsa', 'bolognesa', 200, 'sin imagen', 8, 180)
// producto.addProduct('jabon', 'tocador', 500, 'sin imagen', 9, 300);
// producto.addProduct('shampoo', 'c.graso', 200, 'sin imagen', 10, 280)
// producto.addProduct('afeitadora', 'gillete', 800, 'sin imagen', 11, 300);
// producto.addProduct('perfume', 'colbert', 400, 'sin imagen', 13, 500);
// producto.upDateProduct(12, {price: 300})
// producto.deleteProduct(1)
// producto.getProductById(2);

