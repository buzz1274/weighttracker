class AuthenticatorInterface:
    def get_access_token(self, credential: str) -> str:
        """get access token from remote OAuth Provider"""
        pass
