/* Neon Functions runtime boundary. Node.js 24, bundler installs jose.
 * NOT DEPLOYED; read-only /api/me until Auth, origin and server E2E PASS.
 */
import {createRemoteJWKSet,jwtVerify} from "jose";
import Gateway from "../../pvp/cloud/auth-gateway.cjs";
const {createGateway}=Gateway;
const base=process.env.NEON_AUTH_BASE_URL;
const url=process.env.NEON_AUTH_JWKS_URL;
const allowed=(process.env.CHESS_ALLOWED_ORIGINS||"").split(",").map(v=>v.trim()).filter(Boolean);
if(!base||!url||!allowed.length)throw Error("Missing Neon Auth/allowed-origins configuration");
const issuer=new URL(base).origin;
const jwks=createRemoteJWKSet(new URL(url));
const gateway=createGateway({
 allowedOrigins:allowed,
 verifyToken:async token=>{
  const {payload}=await jwtVerify(token,jwks,{algorithms:["EdDSA"],issuer,audience:issuer});
  return payload;
 }
});
export default gateway;
