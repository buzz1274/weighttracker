from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport import requests
from google.oauth2 import id_token


@csrf_exempt
def verify_token(request):
    """verify the jwt token with google"""

    x = 1
    print("IN")
    print(request.BODY.get("data"))
    print("jfjf")

    print("HERP DERP")

    return JsonResponse({"test": "test2"}, content_type="application/json", status=200)
