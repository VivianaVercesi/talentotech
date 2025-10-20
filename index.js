const [,, method, resource, ...params] = process.argv;

const API_DB_URL = 'https://fakestoreapi.com';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_DB_URL}${endpoint}`, options)
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('Error en la petición:', error.message)
    }
}

async function getAllProducts() { 
    console.log('Consultando todos los productos...\n');

    const products = await fetchAPI(`/products`) 
    console.log('Productos obtenidos: ');
    console.log(JSON.stringify(products,null,2));//null significa que no elijo que dato traer, trae todos y con el 2 le doy la sangría
        
}

async function getProductById(productId) {
    if(isNaN(productId)) {
        console.error('El ID del producto debe ser un número');
        process.exit(1);
    }

    console.log('Consultando producto con ID: ${productID}...\n');
    
    const options = {
        method: 'GET'
    };

    const result = await fetchAPI(`/products/${productId}`, options);
    console.log('Producto obtenido');
    console.log(JSON.stringify(result, null, 2));
    
}

async function createProduct(title, price, category) {
    console.log('Creando nuevo producto...\n'); 

    const priceNumber = parseFloat(price);
    if(isNaN(priceNumber) || priceNumber <= 0) {
        console.error('El precio debe ser un número válido mayor a 0');
        process.exit(1);
    }

    const newProduct = {
        title,
        price,
        category,
        description: `Producto ${title} creado`,
        image: 'http://via.placeholder.com/200'
    }  

    const options = {
    method: 'POST',
    Headers: {
        'Content-Type': 'application/json'
        
    },
    body: JSON.stringify(newProduct)
    }

    const result = await fetchAPI('/products',options)
    console.log('Producto creado exitosamente:');
    console.log(JSON.stringify(result, null, 2));
    
}

async function deleteProduct(productId) {
    if(isNaN(productId)) {
        console.error('El ID del producto debe ser un número');
        process.exit(1);
    }

    console.log('Eliminando producto con ID: ${productID}...\n');
    
    const options = {
        method: 'DELETE'
    };

    const result = await fetchAPI(`/products/${productID}`, options);
    console.log('Producto eliminado exitosamente');
    console.log(JSON.stringify(result, null, 2));
    
}

function showHelp() {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🛍️  GESTOR DE PRODUCTOS - FAKE STORE API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 COMANDOS DISPONIBLES:

📦 Consultar todos los productos:
   npm run start GET products
   npm run start GET users


🔍 Consultar producto específico:
   npm run start GET products/<productId>
   Ejemplo: npm run start GET products/15

➕ Crear nuevo producto:
   npm run start POST products <title> <price> <category> <img>
   Ejemplo: npm run start POST products "Remera Nueva" 300 remeras http://www.ejemplo.com/img.png

🗑️  Eliminar producto:
   npm run start DELETE products/<productId>
   Ejemplo: npm run start DELETE products/7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);  
    
}

async function processCommand() {
    if(!method || !resource) {
        showHelp();
        process.exit(1);
    }

    const httpMethod = method.toUpperCase();

    switch (httpMethod) {
        case 'GET':
            if(resource.includes('/')){
                const [, productID] = resource.split('/');
                await getProductById(productId)
            } else if (resource === 'products') {
                await getAllProducts();
            } else {
                console.error('No válido. Usa "products" o "product/<id>"');
                process.exit(1);
            }
            break;

        case 'POST':
            if(resource === 'products'){
                const [title, price, category] = params;
                if (!title || !price || !category) {
                    console.error('Faltan parámetros. Uso npm run start POST products <title> <price> <category>');
                    process.exit(1);
                }
                await createProduct(title, price, category);
                } else {
                    console.error('Recurso no válido. Usa products');
                    process.exit(1);
                }    
            break;

         case 'DELETE':
            if(resource.include('/')){
                const [, productID] = resource.split('/');
                await deleteProduct(productId)
            } else {
                console.error('Debes especificar el ID del producto. Uso: npm run start DELETE product/<id>');
                process.exit(1);
            }
            break;

        default:
            console.error(`Método HTTP no soportado: ${httpMethod}`);
            console.log('Métodos disponibles: GET, POST, DELETE')
            process.exit(1);
            
    }
}

processCommand();