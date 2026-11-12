
import Wishlist from "../models/Wishlist.js";

// GET CUSTOMER WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      products: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist.",
    });
  }
};

// ADD PRODUCT TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    if (!productId || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, name and price are required.",
      });
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid product price.",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (item) => item.productId === String(productId)
    );

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message: "Product is already in your wishlist.",
        products: wishlist.products,
      });
    }

    wishlist.products.push({
      productId: String(productId),
      name: name.trim(),
      price: Number(price),
      image: image || "",
    });

    await wishlist.save();

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      products: wishlist.products,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to wishlist.",
    });
  }
};

// REMOVE PRODUCT FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found.",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.productId !== productId
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      products: wishlist.products,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove product from wishlist.",
    });
  }
};
