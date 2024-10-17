import dotenv from "dotenv";
dotenv.config();

const certificate = process.env.CASDOOR_CERTIFICATE;

const PEMFormattedCertificate =
  certificate &&
  certificate
    .replace(/-----BEGIN CERTIFICATE-----/g, "-----BEGIN CERTIFICATE-----\n")
    .replace(/-----END CERTIFICATE-----/g, "\n-----END CERTIFICATE-----")
    .replace(/(.{64})/g, "$1\n");

export const casdoorConfig = {
  endpoint: `${process.env.CASDOOR_ENDPOINT}`,
  clientId: `${process.env.CASDOOR_CLIENT_ID}`,
  clientSecret: `${process.env.CASDOOR_CLIENT_SECRET}`,
  certificate: PEMFormattedCertificate,
  orgName: "Nischte",
  appName: "Nischte",
};
