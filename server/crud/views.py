from rest_framework.decorators import api_view
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST
from concurrent.futures import ThreadPoolExecutor, as_completed
from crud.serializers import EventSerializer
from crud.utils.ServiceUtil import ServiceUtil
from crud.utils.HttpResponseUtil import to_json_response, to_json_error_response, INTERNAL_SERVER_ERROR_CODE, VALIDATION_ERROR_CODE, NOT_FOUND_ERROR_CODE
from crud.utils.ValidatorUtil import validate_id_format
from crud.utils.DateTimeUtil import convert_to_iso

MAX_WORKERS = 5

def process_event(item, event):

    event_copy = item.copy()
    event_copy.update(event)

    del event_copy["event"]

    try:
        event_copy['trans_id'] = validate_id_format(event_copy['trans_id'])
    except ValueError as e:
        print(f'Error validating ID: {e}')
        return None
    
    try:
        event_copy['trans_tms'] = convert_to_iso(event_copy['trans_tms'])
    except Exception as e:
        print(f'Error converting date: {e}')
        return None
        
    return event_copy

@api_view(['POST'])
def create_event(request):
    
    try:
        data = request.data.copy()
        
        try:
            data['trans_id'] = validate_id_format(data['trans_id'])
        except ValueError:
            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "Invalid Transaction ID format")
        
        serializer = EventSerializer(data=data)
        
        if serializer.is_valid():
            
            event_service = ServiceUtil.get_service(ServiceUtil.EVENT_SERVICE)
            event_service.create_event(serializer.validated_data)
            
            return to_json_response()
        
        return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, serializer.errors)
    except Exception as e:
        print(e)
        return to_json_error_response(HTTP_500_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE, str(e))
    
@api_view(['POST'])
def create_events_batch(request):
    try:
        data = request.data.copy()

        if not data:
            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "No data found")

        records = data.get("records", [])

        if not records:
            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "No records found")

        events = []
        failed_events = []

        # Parallel processing of events using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = []
            for item in records:
                for event in item["event"]:
                    futures.append(executor.submit(process_event, item, event))

            # Collect the results as they complete
            for future in as_completed(futures):
                event_copy = future.result()
                if event_copy:
                    events.append(event_copy)
                else:
                    failed_events.append(event_copy)

        # If all events failed, return error
        if not events:
            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "No valid records to process")

        # Serialize the valid events
        serializer = EventSerializer(data=events, many=True)

        if serializer.is_valid():
            event_service = ServiceUtil.get_service(ServiceUtil.EVENT_SERVICE)
            result = event_service.create_events_batch(serializer.validated_data)

            if result["added_count"] > 0:
                return to_json_response(data=result)

            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "No records added", result)

        return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, serializer.errors, events)

    except Exception as e:
        print(e)
        return to_json_error_response(HTTP_500_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE, str(e))
    
@api_view(['GET'])
def get_events(request):
    
    try:
        event_service = ServiceUtil.get_service(ServiceUtil.EVENT_SERVICE)
        events = event_service.get_all_events()
        
        serializer = EventSerializer(events, many=True)
        return to_json_response(serializer.data)
    except Exception as e:
        print(e)
        return to_json_error_response(HTTP_500_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE, str(e))

@api_view(['PUT'])
def update_event(request, event_id):
    
    try:
        event_id = validate_id_format(event_id)
    except ValueError as e:
        return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, str(e))
    
    try:
        event_service = ServiceUtil.get_service(ServiceUtil.EVENT_SERVICE)
        event = event_service.get_event_by_id(event_id)
        
        if not event:
            return to_json_error_response(HTTP_400_BAD_REQUEST, NOT_FOUND_ERROR_CODE, "Event not found")
        
        data = request.data.copy()
        
        if not data:
            return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "No data found")
        
        if 'trans_id' in data:
            try:
                data['trans_id'] = validate_id_format(data['trans_id'])
            except ValueError:
                return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, "Invalid Transaction ID format")
        
        serializer = EventSerializer(event, data=data)
        if serializer.is_valid():
            updated_event = event_service.update_event(event_id, serializer.validated_data)
            return to_json_response(data=EventSerializer(updated_event).data)
        return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, serializer.errors)
    except Exception as e:
        print(e)
        return to_json_error_response(HTTP_500_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE, str(e))

@api_view(['DELETE'])
def delete_event(request, event_id):
    
    try:
        event_id = validate_id_format(event_id)
    except ValueError as e:
        print(e)
        return to_json_error_response(HTTP_400_BAD_REQUEST, VALIDATION_ERROR_CODE, str(e))
    
    try:
        event_service = ServiceUtil.get_service(ServiceUtil.EVENT_SERVICE)
        event = event_service.get_event_by_id(event_id)
        
        if not event:
            to_json_error_response(HTTP_400_BAD_REQUEST, NOT_FOUND_ERROR_CODE, "Event not found")
            
        event_service.delete_event(event_id)
        return to_json_response(data=EventSerializer(event).data)
    except Exception as e:
        print(e)
        return to_json_error_response(HTTP_500_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE, str(e))
