const productList = {
    products: [
        { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"  },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"  },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"  },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"  },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"  },
    ]
}

getAllProducts = function() {
    return productList;
}

getProductById = function(productId) {
    productId = parseInt(productId);
    return productList.products.find((product) => product.id === productId);
}

postProduct = function(prod) {
    productList.products.push(prod);
}

putProduct = function(prod) {
    let product = productList.products.find((product) => product.id === prod.id);
    product.marca = prod.marca; 
    product.descricao = prod.descricao; 
    product.valor = prod.valor; 
    return product;
}

deleteProduct = function(productId) {
    let products = productList.products.filter((product) => product.id != productId);
    productList.products = products;
}

module.exports = {
    getAllProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct
}