import imaplib
import email
import re
import pandas as pd
from email.utils import parsedate_to_datetime
import config

def connect_to_email(username, password):
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login(username, password)
    return mail

def fetch_emails(mail, limit=10, folder='inbox'):
    mail.select(folder)
    
    # Search for all emails in the folder
    result, data = mail.search(None, 'ALL')
    email_ids = data[0].split()
    
    emails = []

    # Fetch emails from newest to oldest
    for e_id in reversed(email_ids):
        if len(emails) >= limit:
            break

        result, msg_data = mail.fetch(e_id, '(RFC822)')
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        # Get email date
        date = parsedate_to_datetime(msg['Date'])

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
                    emails.append((date, body))
                    break  # Only get the first plain text part
        else:
            try:
                body = msg.get_payload(decode=True).decode('utf-8')
            except UnicodeDecodeError:
                try:
                    body = msg.get_payload(decode=True).decode('latin-1')
                except UnicodeDecodeError:
                    body = msg.get_payload(decode=True).decode('windows-1252')
            emails.append((date, body))

    # Sort emails by date (newest first) and return only the body
    return [email[1] for email in sorted(emails, key=lambda x: x[0], reverse=True)]

def extract_info(email_body):
    name_pattern = r"Name/Surname\s*:\s*(.+?)(?=\n)"
    phone_pattern = r"Phone\s*:\s*(\d+)"
    address_pattern = r"Address\s*:\s*(.+?)(?=\n\n|\Z)"
    
    name_match = re.search(name_pattern, email_body, re.IGNORECASE)
    phone_match = re.search(phone_pattern, email_body, re.IGNORECASE)
    address_match = re.search(address_pattern, email_body, re.IGNORECASE | re.DOTALL)
    
    name = name_match.group(1).strip() if name_match else "N/A"
    phone = phone_match.group(1).strip() if phone_match else "N/A"
    address = ' '.join(address_match.group(1).split()) if address_match else "N/A"
    
    return name, phone, address

def save_to_excel(data, filename='email_data_output.xlsx'):
    df = pd.DataFrame(data, columns=['Name', 'Phone Number', 'Address'])
    df.to_excel(filename, index=False)
    print(f"Data saved to {filename}")

def main(username, password, limit):
    mail = connect_to_email(username, password)
    
    print(f"Fetching up to {limit} latest emails...")
    emails = fetch_emails(mail, limit)

    data = []
    
    for email_body in emails:
        name, phone, address = extract_info(email_body)
        data.append([name, phone, address])
    
    save_to_excel(data)

# Set parameter
limit = 20  # Limit the number of emails to process

if __name__ == "__main__":
    main(config.EMAIL_USERNAME, config.EMAIL_PASSWORD, limit)