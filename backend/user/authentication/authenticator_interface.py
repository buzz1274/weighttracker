class AuthenticatorInterface:
    def get_access_token(self, credential: str) -> dict:
        """get access token from remote OAuth Provider"""
        pass

    def get_user_info(self, token: str) -> dict:
        """get userinfo from remote OAuth Provider"""
        pass
