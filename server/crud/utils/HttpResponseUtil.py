from rest_framework.response import Response

INTERNAL_SERVER_ERROR_CODE = 'internal-server-error'
VALIDATION_ERROR_CODE = 'invalid'
NOT_FOUND_ERROR_CODE = 'not-found'

def to_json_response(data=None, status_code=200):
    return Response({"error": None, "data": data}, status_code)


def to_json_error_response(status_code=400, code="", error_detail=None, data=None):
    return Response({
        "error": {
            "code": code,
            "detail": error_detail
        },
        "data": data,
    }, status=status_code)