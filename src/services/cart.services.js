import User from "../models/user.js";

export const getCart = async (userId) => {
    const user = await User.findById(userId).populate("cart.product");
    // Add stock and totalPrice to each cart item
    const cartWithDetails = user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        stock: item.product.stock,
        totalPrice: item.quantity * item.product.price
    }));
    return cartWithDetails;
}

export const addToCart = async (userId, productId, quantity) => {
    const user = await User.findById(userId).populate("cart.product");
    const cartItem = user.cart.find((item) => item.product._id == productId);

    if (cartItem) {
        // Check stock before updating quantity
        const newQuantity = cartItem.quantity + quantity;
        if (newQuantity > cartItem.product.stock) {
            throw new Error("Quantity exceeds available stock");
        }
        cartItem.quantity = newQuantity;
    } else {
        // For new items, fetch product to check stock
        const Product = (await import("../models/product.js")).default;
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (quantity > product.stock) {
            throw new Error("Quantity exceeds available stock");
        }
        user.cart.push({ product: productId, quantity });
    }

    await user.save();
    // Repopulate to get product details for response
    await user.populate("cart.product");
    const cartWithDetails = user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        stock: item.product.stock,
        totalPrice: item.quantity * item.product.price
    }));
    return cartWithDetails;
}

export const updateCart = async (userId, productId, quantity) => {
    const user = await User.findById(userId).populate("cart.product");
    const cartItem = user.cart.find((item) => item.product._id == productId);
    if (cartItem) {
        // Check stock before updating quantity
        if (quantity > cartItem.product.stock) {
            throw new Error("Quantity exceeds available stock");
        }
        cartItem.quantity = quantity;
    }
    await user.save();
    await user.populate("cart.product");
    const cartWithDetails = user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        stock: item.product.stock,
        totalPrice: item.quantity * item.product.price
    }));
    return cartWithDetails;
}

export const removeFromCart = async (userId, productId) => {
    const user = await User.findById(userId).populate("cart.product");
    user.cart = user.cart.filter((item) => item.product._id != productId);
    await user.save();
    await user.populate("cart.product");
    const cartWithDetails = user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        stock: item.product.stock,
        totalPrice: item.quantity * item.product.price
    }));
    return cartWithDetails;
}