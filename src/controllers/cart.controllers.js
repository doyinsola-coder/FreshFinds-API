import { getCart as getCartService, addToCart as addToCartService, updateCart as updateCartService, removeFromCart as removeFromCartService } from "../services/cart.services.js";

export const getCart = async (req, res) => {
    try {
        const cart = await getCartService(req.user.id);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await addToCartService(req.user.id, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await updateCartService(req.user.id, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await removeFromCartService(req.user.id, productId);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}