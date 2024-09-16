
from datetime import datetime
import pytz
import re


def convert_to_iso(trans_tms):
    # Define the pattern to match the datetime format with EDT suffix
    pattern = r'(\d{8})(\d{6})(\d{3})(EDT)'
    
    # Regex match
    match = re.match(pattern, trans_tms)
    
    if not match:
        raise ValueError(f"Invalid datetime format: {trans_tms}")

    # Extract date, time and milliseconds
    date_str, time_str, ms_str, tz_str = match.groups()
    
    # Convert to datetime object
    dt_str = f"{date_str} {time_str}.{ms_str}"
    dt = datetime.strptime(dt_str, '%Y%m%d %H%M%S.%f')

    # Convert to ISO 8601 format
    iso_format = dt.astimezone(pytz.timezone('Asia/Kolkata')).isoformat()
    
    return iso_format