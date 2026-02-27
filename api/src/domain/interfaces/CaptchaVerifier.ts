export interface CaptchaVerifier {
  verifyToken(token: string, remoteIp?: string): Promise<boolean>;
}
