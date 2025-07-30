class AuthenticatorInterface:
    def decode_credentials(self, credential: str) -> dict:
        """decode credentials"""
        pass
