import * as sdk from "casdoor-nodejs-sdk";
import { casdoorConfig } from "../utils/casdoor.config.js";
import { options } from "../utils/constants.js";

const casdoorSDK = new sdk.SDK(casdoorConfig);

export const Login = async (req, res) => {
  try {
    const redirectUri = encodeURIComponent(
      `${process.env.CASDOOR_ENDPOINT}/api/v1/callback`
    );
    const url = `${casdoorConfig.endpoint}/login/oauth/authorize?client_id=${casdoorConfig.clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read`;
    res.redirect(url);
  } catch (error) {
    res.status(500).json({
      message: "Failed to login user",
    });
  }
};

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const claims = casdoorSDK.parseJwtToken(token);
    req.user = claims;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const callBack = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: "No code received" });
  }
  try {
    const token = await casdoorSDK.getAuthToken(code);
    res.cookie("auth", token, options);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: "Failed to get token" });
  }
};
