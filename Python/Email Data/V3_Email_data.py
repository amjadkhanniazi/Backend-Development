import imaplib
import email
import re
import pandas as pd
from datetime import datetime
import config

# Function to connect to the email server
def connect_to_email(username, password):
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login(username, password)
    return mail

# Function to fetch emails with specific subject and date range
def fetch_emails(mail, subject_keyword, start_date, end_date, limit=10, folder='inbox'):
    mail.select(folder)
    
    # Format dates as required by IMAP search
    start_date = start_date.strftime("%d-%b-%Y")  # IMAP format e.g., 10-Sep-2024
    end_date = end_date.strftime("%d-%b-%Y")
    
    # Search for emails with the specified subject and within the date range
    search_criteria = f'(SUBJECT "{subject_keyword}" SINCE {start_date} BEFORE {end_date})'
    result, data = mail.search(None, search_criteria)
    email_ids = data[0].split()
    
    # Limit the number of emails to fetch
    email_ids = email_ids[-limit:]
    
    emails = []

    for e_id in email_ids:
        result, msg_data = mail.fetch(e_id, '(RFC822)')
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        # Check if email is multipart
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        body = part.get_payload(decode=True).decode('utf-8')
                    except UnicodeDecodeError:
                        try:
                            body = part.get_payload(decode=True).decode('latin-1')
                        except UnicodeDecodeError:
                            body = part.get_payload(decode=True).decode('windows-1252')
                    emails.append(body)
        else:
            try:
                body = msg.get_payload(decode=True).decode('utf-8')
            except UnicodeDecodeError:
                try:
                    body = msg.get_payload(decode=True).decode('latin-1')
                except UnicodeDecodeError:
                    body = msg.get_payload(decode=True).decode('windows-1252')
            emails.append(body)

    return emails

# Function to extract name and phone number
def extract_name_and_phone(email_body):
    name_pattern = r"Name:\s*([A-Za-z\s]+)(?=\n|$)"
    phone_pattern = r"Contact:\s*(\d{11})"
    
    name_match = re.search(name_pattern, email_body)
    phone_match = re.search(phone_pattern, email_body)
    
    name = name_match.group(1).strip() if name_match else "N/A"
    phone = phone_match.group(1).strip() if phone_match else "N/A"
    
    return name, phone

# Function to save data to Excel
def save_to_excel(data, filename='V3_output.xlsx'):
    df = pd.DataFrame(data, columns=['Name', 'Phone Number'])
    df.to_excel(filename, index=False)
    print(f"Data saved to {filename}")

# Main function
def main(username, password, subject_keyword, start_date, end_date, limit):
    mail = connect_to_email(username, password)
    
    print(f"Fetching up to {limit} latest emails with subject '{subject_keyword}' between {start_date} and {end_date}...")
    emails = fetch_emails(mail, subject_keyword, start_date, end_date, limit)

    data = []
    
    for email_body in emails:
        name, phone = extract_name_and_phone(email_body)
        data.append([name, phone])
    
    save_to_excel(data)

subject_keyword = 'Hello'  # Filter emails with this subject
start_date = datetime(2024, 9, 9)  # Start date in YYYY, MM, DD format
end_date = datetime(2024, 9, 11)   # End date in YYYY, MM, DD format
limit = 10  # Limit the number of emails

# Run the script
if __name__ == "__main__":
    main(config.EMAIL_USERNAME, config.EMAIL_PASSWORD, subject_keyword, start_date, end_date, limit)
