
import Address from "../models/Address.js";

// GET ALL CUSTOMER ADDRESSES
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ isDefault: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch addresses.",
    });
  }
};

// ADD NEW ADDRESS
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !addressLine?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !postalCode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required address fields.",
      });
    }

    const existingDefault = await Address.findOne({
      user: req.user.id,
      isDefault: true,
    });

    const makeDefault = Boolean(isDefault) || !existingDefault;

    if (makeDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country?.trim() || "Pakistan",
      isDefault: makeDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      address,
    });
  } catch (error) {
    console.error("Add address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add address.",
    });
  }
};

// UPDATE ADDRESS
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const fields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} is required.`,
          });
        }

        address[field] = req.body[field].trim();
      }
    }

    if (req.body.isDefault === true && !address.isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );

      address.isDefault = true;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      address,
    });
  } catch (error) {
    console.error("Update address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update address.",
    });
  }
};

// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Set another address as default if needed
    if (address.isDefault) {
      const nextAddress = await Address.findOne({
        user: req.user.id,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete address.",
    });
  }
};

export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
