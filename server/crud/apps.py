from django.apps import AppConfig


class CrudConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crud'
    
    def ready(self) -> None:
        
        from crud.services.event_service import EventService
        
        self.event_service = EventService()
