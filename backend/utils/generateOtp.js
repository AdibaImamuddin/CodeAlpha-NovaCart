
import crypto from "crypto";

export const generateOtp = () => {
  // Generate a secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing it in database
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  return {
    otp,
    otpHash,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };
};
