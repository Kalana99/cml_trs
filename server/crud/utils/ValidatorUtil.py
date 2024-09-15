import uuid

def validate_id_format(event_id):
    try:
        return uuid.UUID(event_id)
    except ValueError:
        raise ValueError("Invalid ID format")