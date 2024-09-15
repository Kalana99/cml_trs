from django.apps import apps

class ServiceUtil:
    EVENT_SERVICE = 'event_service'

    @staticmethod
    def get_service(service_name: str):
        app_conf = apps.get_app_config('myapp')
        return getattr(app_conf, service_name)
